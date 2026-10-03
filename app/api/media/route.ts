import { NextResponse } from "next/server";
import { MEDIA_BUCKET, type MediaAsset } from "@/lib/media";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Media service is not configured." }, { status: 503 });
  }

  const service = createSupabaseServiceClient();
  const { data, error } = await service
    .from("media_assets")
    .select("id,title,description,category,media_type,mime_type,file_size,object_path,is_published,created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load published media." }, { status: 500 });
  }

  const assets = await Promise.all(
    (data as MediaAsset[]).map(async (asset) => {
      const { data: signed, error: signedError } = await service.storage
        .from(MEDIA_BUCKET)
        .createSignedUrl(asset.object_path, 3600);

      return signedError ? null : { ...asset, signed_url: signed.signedUrl };
    }),
  );

  return NextResponse.json({ items: assets.filter(Boolean) });
}