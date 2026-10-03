import { NextResponse } from "next/server";
import { MEDIA_BUCKET } from "@/lib/media";
import { isSupabaseConfigured, requireAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Media service is not configured." }, { status: 503 });
  }

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: Record<string, string | boolean> = {};
  if (typeof body.title === "string" && body.title.trim() && body.title.trim().length <= 160) {
    updates.title = body.title.trim();
  }
  if (typeof body.description === "string" && body.description.length <= 2000) {
    updates.description = body.description.trim();
  }
  if (typeof body.category === "string" && body.category.trim() && body.category.trim().length <= 80) {
    updates.category = body.category.trim();
  }
  if (typeof body.is_published === "boolean") updates.is_published = body.is_published;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid media changes supplied." }, { status: 400 });
  }

  const { data, error } = await admin.service
    .from("media_assets")
    .update(updates)
    .eq("id", id)
    .select("id,title,description,category,media_type,mime_type,file_size,object_path,is_published,created_at")
    .single();

  if (error) return NextResponse.json({ error: "Unable to update media." }, { status: 404 });
  return NextResponse.json({ item: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Media service is not configured." }, { status: 503 });
  }

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { id } = await context.params;
  const { data: asset, error } = await admin.service
    .from("media_assets")
    .select("object_path")
    .eq("id", id)
    .single();

  if (error || !asset) return NextResponse.json({ error: "Media item not found." }, { status: 404 });

  const { error: deleteError } = await admin.service.from("media_assets").delete().eq("id", id);
  if (deleteError) return NextResponse.json({ error: "Unable to delete media record." }, { status: 500 });

  await admin.service.storage.from(MEDIA_BUCKET).remove([asset.object_path]);
  return NextResponse.json({ success: true });
}