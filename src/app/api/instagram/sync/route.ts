import { NextResponse } from "next/server";
import { fetchInstagramProfileFeed } from "@/lib/instagram";

export async function GET() {
  return await handleSync();
}

export async function POST() {
  return await handleSync();
}

async function handleSync() {
  try {
    const items = await fetchInstagramProfileFeed("d_bagpacker_");
    
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Could not retrieve Instagram profile feed" }, { status: 502 });
    }

    const formattedReels = items.map((it) => ({
      shortcode: it.shortcode,
      url: `https://www.instagram.com/reel/${it.shortcode}/`,
      title: it.caption || "Instagram Exploration Reel",
      rawPlays: it.plays,
      views: it.views,
      likes: it.likes,
      comments: it.comments,
      thumbnailUrl: it.thumbnailUrl,
      videoUrl: it.videoUrl,
    }));

    return NextResponse.json({
      success: true,
      username: "d_bagpacker_",
      total: formattedReels.length,
      data: formattedReels,
    });
  } catch (err: any) {
    console.error("Instagram live feed sync error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to query Instagram live feed" }, { status: 500 });
  }
}
