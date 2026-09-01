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
 * Uses local downloaded high-res JPEG /media/${code}.jpg
 */
export function getInstagramThumbnailUrl(url: string): string | null {
  const code = getInstagramShortcode(url);
  if (!code) return null;
  return `/media/${code}.jpg`;
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

export interface InstagramFeedItem {
  shortcode: string;
  plays: number;
  views: string;
  likes: string;
  comments: string;
  caption: string;
  thumbnailUrl: string;
  videoUrl: string;
}

function formatStat(num?: number | null): string {
  if (!num && num !== 0) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 10_000) return `${Math.round(num / 1_000)}K`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

/**
 * Pure Node.js fetch for live Instagram profile feed with real play counts
 * Runs directly on Vercel / serverless without python dependency
 */
export async function fetchInstagramProfileFeed(username = "d_bagpacker_"): Promise<InstagramFeedItem[]> {
  try {
    const url = `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=30`;
    const headers = {
      "x-ig-app-id": "936619743392459",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Referer": `https://www.instagram.com/${username}/`,
    };

    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    const items = data.items || [];

    return items.map((it: any) => {
      const code = it.code;
      const rawPlays = it.play_count !== undefined && it.play_count !== null ? it.play_count : (it.view_count || 0);
      const rawLikes = it.like_count || 0;
      const rawComments = it.comment_count || 0;
      const caption = (it.caption?.text || "").split("\n")[0].slice(0, 80);
      const image = it.image_versions2?.candidates?.[0]?.url || "";
      const video = it.video_versions?.[0]?.url || "";

      return {
        shortcode: code,
        plays: rawPlays,
        views: formatStat(rawPlays),
        likes: formatStat(rawLikes),
        comments: formatStat(rawComments),
        caption,
        thumbnailUrl: image,
        videoUrl: video,
      };
    });
  } catch (err) {
    console.error("fetchInstagramProfileFeed error:", err);
    return [];
  }
}

