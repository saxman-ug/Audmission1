export type MediaKind = "ebook" | "photo" | "video";

export type MediaAsset = {
  id: string;
  title: string;
  description: string;
  category: string;
  media_type: MediaKind;
  mime_type: string;
  file_size: number;
  object_path: string;
  is_published: boolean;
  created_at: string;
  signed_url?: string;
};

export const MEDIA_BUCKET = "media";
export const MAX_MEDIA_BYTES = 500 * 1024 * 1024;

export function isAllowedMedia(kind: MediaKind, mimeType: string): boolean {
  if (kind === "ebook") return mimeType === "application/pdf";
  if (kind === "photo") return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mimeType);
  return ["video/mp4", "video/webm"].includes(mimeType);
}