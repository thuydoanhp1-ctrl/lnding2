import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

export const BUCKET_COVERS = "product-covers";
export const BUCKET_ASSETS = "product-assets"; // PRIVATE bucket

// Lazy initialization of Supabase client
export function getSupabaseAdmin() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Generates a temporary Signed URL for a private digital product file (expires in 3600s / 1h)
 */
export async function createPrivateAssetSignedUrl(storagePath: string, expiresIn = 3600): Promise<string | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(BUCKET_ASSETS).createSignedUrl(storagePath, expiresIn);

    if (error || !data?.signedUrl) {
      console.error("❌ Error generating signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("❌ Supabase storage exception:", err);
    return null;
  }
}

/**
 * Gets the public URL for images stored in the public covers bucket
 */
export function getPublicCoverUrl(path: string): string {
  const supabase = getSupabaseAdmin();
  const { data } = supabase.storage.from(BUCKET_COVERS).getPublicUrl(path);
  return data.publicUrl;
}
