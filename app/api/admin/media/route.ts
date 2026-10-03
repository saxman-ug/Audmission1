import { NextResponse } from "next/server";
import { isAllowedMedia, MAX_MEDIA_BYTES, MEDIA_BUCKET, type MediaAsset, type MediaKind } from "@/lib/media";
import { isSupabaseConfigured, requireAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unavailableResponse() {
  return NextResponse.json({ error: "Media service is not configured." }, { status: 503 });
}

export async function GET() {
  if (!isSupabaseConfigured()) return unavailableResponse();

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { data, error } = await admin.service
    .from("media_assets")
    .select("id,title,description,category,media_type,mime_type,file_size,object_path,is_published,created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Unable to load media." }, { status: 500 });

  const items = await Promise.all(
    (data as MediaAsset[]).map(async (asset) => {
      const { data: signed } = await admin.service.storage
        .from(MEDIA_BUCKET)
        .createSignedUrl(asset.object_path, 3600);
      return { ...asset, signed_url: signed?.signedUrl ?? null };
    }),
  );

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return unavailableResponse();

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const objectPath = typeof body.object_path === "string" ? body.object_path : "";
  const mediaType = body.media_type as MediaKind;
  const mimeType = typeof body.mime_type === "string" ? body.mime_type : "";
  const fileSize = Number(body.file_size);

  if (
    !title || title.length > 160 || description.length > 2000 || !category || category.length > 80 ||
    !["ebook", "photo", "video"].includes(mediaType) || !isAllowedMedia(mediaType, mimeType) ||
    !Number.isSafeInteger(fileSize) || fileSize <= 0 || fileSize > MAX_MEDIA_BYTES ||
    !objectPath.startsWith(`${admin.user.id}/`) || objectPath.includes("..")
  ) {
    return NextResponse.json({ error: "Media details are invalid or exceed upload limits." }, { status: 400 });
  }

  const { data, error } = await admin.service
    .from("media_assets")
    .insert({
      title,
      description,
      category,
      media_type: mediaType,
      mime_type: mimeType,
      file_size: fileSize,
      object_path: objectPath,
      created_by: admin.user.id,
      is_published: false,
    })
    .select("id,title,description,category,media_type,mime_type,file_size,object_path,is_published,created_at")
    .single();

  if (error) {
    await admin.service.storage.from(MEDIA_BUCKET).remove([objectPath]);
    return NextResponse.json({ error: "Unable to save media details." }, { status: 500 });
  }

  return NextResponse.json({ item: data }, { status: 201 });
}