// Shared Instagram & Media Utilities

/**
 * Extracts shortcode from any Instagram Reel, Post, or TV link
 * Handles query parameters like ?igsi=..., trailing slashes, etc.
 */
export function getInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i);
  return match ? match[2] : null;
}

/**
 * Generates official clean Instagram 9:16 responsive embed URL
 * Example: https://www.instagram.com/reel/Dcla50ahuGq/embed/
 */
export function getCleanInstagramEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (!match) return null;
  const type = match[1].toLowerCase() === "reels" ? "reel" : match[1].toLowerCase();
  const code = match[2];
  return `https://www.instagram.com/${type}/${code}/embed/`;
}

/**
 * Generates direct canonical Instagram post link
 */
export function getCleanInstagramPermalink(url: string): string | null {
  const code = getInstagramShortcode(url);
  if (!code) return null;
  return `https://www.instagram.com/reel/${code}/`;
}

/**
 * Generates direct high-resolution poster image for any Instagram post/reel
 * Example: https://www.instagram.com/p/Dcla50ahuGq/media/?size=l
 */
export function getInstagramThumbnailUrl(url: string): string | null {
  const code = getInstagramShortcode(url);
  if (!code) return null;
  return `https://www.instagram.com/p/${code}/media/?size=l`;
}

/**
 * Resolves any video URL:
 * - If it's already a direct video file (.mp4, .webm, /media/...), returns it
 * - If it's an Instagram URL with shortcode, maps to clean direct video /media/${shortcode}.mp4
 */
export function getDirectVideoUrl(url?: string | null): string | null {
  if (!url) return null;
  const clean = url.trim();
  if (clean.startsWith("/media/") || clean.match(/\.(mp4|webm|mov)(\?.*)?$/i)) {
    return clean;
  }
  const code = getInstagramShortcode(clean);
  if (code) {
    return `/media/${code}.mp4`;
  }
  return null;
}

export function isInstagramUrl(url: string): boolean {
  return Boolean(url && url.includes("instagram.com"));
}
