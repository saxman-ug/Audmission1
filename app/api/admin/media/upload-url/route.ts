import { NextResponse } from "next/server";
import {
  isAllowedMedia,
  MAX_MEDIA_BYTES,
  MEDIA_BUCKET,
  type MediaKind,
} from "@/lib/media";
import {
  isSupabaseConfigured,
  requireAdmin,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Media service is not configured." },
      { status: 503 },
    );
  }

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }

  const mediaType = body.media_type as MediaKind;
  const mimeType =
    typeof body.mime_type === "string" ? body.mime_type : "";
  const fileSize = Number(body.file_size);
  const originalName =
    typeof body.file_name === "string" ? body.file_name : "";

  const safeName = (originalName.split(/[\\/]/).pop() || "upload")
    .replace(/[^\w.() -]/g, "_")
    .slice(0, 120);

  if (
    !safeName ||
    !["ebook", "photo", "video"].includes(mediaType) ||
    !isAllowedMedia(mediaType, mimeType) ||
    !Number.isSafeInteger(fileSize) ||
    fileSize <= 0 ||
    fileSize > MAX_MEDIA_BYTES
  ) {
    return NextResponse.json(
      { error: "File type or size is invalid. Maximum size is 50 MB." },
      { status: 400 },
    );
  }

  const objectPath =
    `${admin.user.id}/${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await admin.service.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(objectPath, { upsert: false });

  if (error || !data?.token) {
    return NextResponse.json(
      { error: "Could not prepare the upload. Check your media bucket." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    path: objectPath,
    token: data.token,
  });
}
