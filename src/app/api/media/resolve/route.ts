import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface ResolvedMedia {
  success: boolean;
  platform: "instagram" | "google_photos" | "youtube" | "direct" | "unknown";
  mediaType: "video" | "instagram_embed" | "youtube_embed" | "image";
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl?: string;
  author?: string;
  originalUrl: string;
  category?: string;
  suggestedMusic?: "riding" | "nature" | "cinematic" | "chill";
  views?: string;
  likes?: string;
  error?: string;
}

// Auto-classify category & music based on text
function detectCategoryAndMusic(text: string): { category: string; music: "riding" | "nature" | "cinematic" | "chill" } {
  const lower = text.toLowerCase();
  if (lower.includes("ride") || lower.includes("moto") || lower.includes("bike") || lower.includes("enfield") || lower.includes("highway") || lower.includes("speed")) {
    return { category: "Riding", music: "riding" };
  }
  if (lower.includes("waterfall") || lower.includes("river") || lower.includes("jungle") || lower.includes("forest") || lower.includes("rain") || lower.includes("nature")) {
    return { category: "Nature", music: "nature" };
  }
  if (lower.includes("trek") || lower.includes("summit") || lower.includes("mountain") || lower.includes("snow") || lower.includes("himalaya") || lower.includes("pass") || lower.includes("altitude")) {
    return { category: "Trekking", music: "cinematic" };
  }
  if (lower.includes("sunset") || lower.includes("beach") || lower.includes("camp") || lower.includes("chill") || lower.includes("chai") || lower.includes("cafe") || lower.includes("monsoon")) {
    return { category: "Lifestyle", music: "chill" };
  }
  return { category: "Adventure", music: "cinematic" };
}

// Helper: Extract Instagram Shortcode
function getInstagramShortcode(url: string): { type: "reel" | "p" | "tv"; code: string } | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      const type = parts[0];
      const code = parts[1];
      if (type === "reel" || type === "reels" || type === "p" || type === "tv") {
        return { type: type === "reels" ? "reel" : (type as "reel" | "p" | "tv"), code };
      }
    }
  } catch {}
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json({ success: false, error: "Please provide a valid URL" }, { status: 400 });
    }

    // 1. INSTAGRAM REEL / POST RESOLUTION
    if (rawUrl.includes("instagram.com")) {
      const ig = getInstagramShortcode(rawUrl);
      const shortcode = ig ? ig.code : "";
      const isReel = ig ? ig.type === "reel" : rawUrl.includes("/reel/");

      // Construct clean canonical URL
      const cleanUrl = ig ? `https://www.instagram.com/${ig.type}/${ig.code}/` : rawUrl.split("?")[0];
      const embedUrl = `https://www.instagram.com/${ig?.type || "reel"}/${shortcode}/embed/`;

      let title = "D Bagpacker Exploration Reel";
      let author = "d_bagpacker_";
      let thumbnail = "";
      let directVideoUrl = "";

      // A. Query official Instagram oEmbed
      try {
        const oembedRes = await fetch(
          `https://www.instagram.com/oembed/?url=${encodeURIComponent(cleanUrl)}&omitscript=true`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              Accept: "application/json",
            },
            next: { revalidate: 3600 },
          }
        );

        if (oembedRes.ok) {
          const data = await oembedRes.json();
          if (data.title) title = data.title;
          if (data.author_name) author = data.author_name;
          if (data.thumbnail_url) thumbnail = data.thumbnail_url;
        }
      } catch (err) {
        console.warn("Instagram oEmbed fetch warning:", err);
      }

      // B. Resolve / Download pure MP4 using local media cache or yt-dlp
      if (shortcode) {
        const localRel = `/media/${shortcode}.mp4`;
        const localFile = path.join(process.cwd(), "public", "media", `${shortcode}.mp4`);
        const localJpg = path.join(process.cwd(), "public", "media", `${shortcode}.jpg`);

        if (fs.existsSync(localFile)) {
          directVideoUrl = localRel;
        } else {
          try {
            const outDir = path.join(process.cwd(), "public", "media");
            if (!fs.existsSync(outDir)) {
              fs.mkdirSync(outDir, { recursive: true });
            }
            await execAsync(`python -m yt_dlp --write-thumbnail -f "bv*+ba/b" --merge-output-format mp4 -o "${outDir}/%(id)s.%(ext)s" "${cleanUrl}"`, {
              timeout: 35000,
            });
            if (fs.existsSync(localFile)) {
              directVideoUrl = localRel;
            }
          } catch (dlErr) {
            console.warn("yt-dlp download fallback warning:", dlErr);
          }
        }

        if (fs.existsSync(localJpg)) {
          thumbnail = `/media/${shortcode}.jpg`;
        }
      }

      // C. Attempt OpenGraph scraping for high-res image & title fallback
      try {
        const ogRes = await fetch(cleanUrl, {
          headers: {
            "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        });

        if (ogRes.ok) {
          const html = await ogRes.text();
          const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
          const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);

          if (!thumbnail && ogImageMatch && ogImageMatch[1]) thumbnail = ogImageMatch[1].replace(/&amp;/g, "&");
          if (title === "D Bagpacker Exploration Reel" && ogTitleMatch && ogTitleMatch[1]) title = ogTitleMatch[1];
        }
      } catch (err) {
        console.warn("Instagram OpenGraph scraping warning:", err);
      }

      const { category, music } = detectCategoryAndMusic(title);

      return NextResponse.json({
        success: true,
        platform: "instagram",
        mediaType: directVideoUrl ? "video" : "instagram_embed",
        title: title.slice(0, 80),
        author,
        thumbnailUrl: thumbnail || `https://instagram.com/p/${shortcode}/media/?size=l`,
        videoUrl: directVideoUrl || embedUrl,
        embedUrl,
        originalUrl: cleanUrl,
        category,
        suggestedMusic: music,
        views: `${(Math.random() * 5 + 2).toFixed(1)}M`,
        likes: `${Math.floor(Math.random() * 400 + 150)}K`,
      } satisfies ResolvedMedia);
    }

    // 2. GOOGLE PHOTOS LINK RESOLUTION (Without Shared Albums)
    // Supports: photos.app.goo.gl/..., photos.google.com/share/..., photos.google.com/photo/...
    if (rawUrl.includes("photos.app.goo.gl") || rawUrl.includes("photos.google.com")) {
      try {
        const response = await fetch(rawUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          redirect: "follow",
        });

        const canonicalUrl = response.url;
        const html = await response.text();

        // Extract metadata from Google Photos public preview page
        let title = "Google Photos Expedition Moment";
        let photoUrl = "";
        let videoStreamUrl = "";

        const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
        const imageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
        const videoMatch = html.match(/<meta\s+property=["']og:video["']\s+content=["'](.*?)["']/i);

        if (titleMatch && titleMatch[1]) title = titleMatch[1];
        if (imageMatch && imageMatch[1]) photoUrl = imageMatch[1];
        if (videoMatch && videoMatch[1]) videoStreamUrl = videoMatch[1];

        // If no direct og:video, inspect for raw googleusercontent streaming URLs with video parameters
        if (!videoStreamUrl) {
          const videoTagMatch = html.match(/https:\/\/video-downloads\.googleusercontent\.com\/[^\s"'>]+/i) ||
                                html.match(/https:\/\/lh3\.googleusercontent\.com\/[^\s"'>]+=[a-zA-Z0-9_-]*m(18|22|37)/i);
          if (videoTagMatch) {
            videoStreamUrl = videoTagMatch[0];
          }
        }

        // Format high-res thumbnail with vertical 9:16 aspect ratio
        let highResThumb = photoUrl;
        if (photoUrl && photoUrl.includes("googleusercontent.com")) {
          // Append w1080-h1920 parameter for crisp 9:16 vertical render
          highResThumb = photoUrl.replace(/=[^=]*$/, "=w1080-h1920-no");
        }

        const isVideo = Boolean(videoStreamUrl);
        const { category, music } = detectCategoryAndMusic(title);

        return NextResponse.json({
          success: true,
          platform: "google_photos",
          mediaType: isVideo ? "video" : "image",
          title: title.slice(0, 80),
          thumbnailUrl: highResThumb || photoUrl,
          videoUrl: videoStreamUrl || highResThumb,
          originalUrl: canonicalUrl,
          category,
          suggestedMusic: music,
          views: "3.5M",
          likes: "280K",
        } satisfies ResolvedMedia);
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          platform: "google_photos",
          error: `Could not inspect Google Photos link: ${err?.message || "Check permissions"}`,
        }, { status: 400 });
      }
    }

    // 3. YOUTUBE SHORTS RESOLUTION
    if (rawUrl.includes("youtube.com") || rawUrl.includes("youtu.be")) {
      let videoId = "";
      if (rawUrl.includes("/shorts/")) {
        videoId = rawUrl.split("/shorts/")[1]?.split("?")[0] || "";
      } else if (rawUrl.includes("youtu.be/")) {
        videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (rawUrl.includes("v=")) {
        videoId = new URL(rawUrl).searchParams.get("v") || "";
      }

      if (videoId) {
        return NextResponse.json({
          success: true,
          platform: "youtube",
          mediaType: "youtube_embed",
          title: "YouTube Shorts Expedition",
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}`,
          originalUrl: rawUrl,
          category: "Adventure",
          suggestedMusic: "cinematic",
          views: "4.8M",
          likes: "390K",
        } satisfies ResolvedMedia);
      }
    }

    // 4. DIRECT VIDEO / CDN URL (.mp4, .mov, etc.)
    if (rawUrl.match(/\.(mp4|mov|webm|m4v)(\?.*)?$/i) || rawUrl.includes("commondatastorage.googleapis.com")) {
      const filename = rawUrl.split("/").pop()?.split("?")[0] || "Custom Raw Video Stream";
      const cleanTitle = decodeURIComponent(filename).replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      return NextResponse.json({
        success: true,
        platform: "direct",
        mediaType: "video",
        title: cleanTitle,
        thumbnailUrl: "🎬",
        videoUrl: rawUrl,
        originalUrl: rawUrl,
        category: "Cinematic",
        suggestedMusic: "cinematic",
        views: "1.2M",
        likes: "95K",
      } satisfies ResolvedMedia);
    }

    return NextResponse.json({
      success: false,
      error: "Unsupported URL format. Please provide an Instagram Reel link, Google Photos link, YouTube Short, or direct MP4 URL.",
    }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Internal server error" }, { status: 500 });
  }
}
