import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

function formatCount(num: number | null | undefined): string {
  if (!num && num !== 0) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 10_000) return `${Math.round(num / 1_000)}K`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

export async function GET() {
  return await handleSync();
}

export async function POST() {
  return await handleSync();
}

async function handleSync() {
  try {
    const scriptPath = path.join(process.cwd(), "src", "lib", "instagram_feed.py");
    const { stdout } = await execAsync(`python "${scriptPath}" d_bagpacker_`, { timeout: 20000 });
    
    const parsed = JSON.parse(stdout);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 500 });
    }

    const items = parsed.items || [];
    const formattedReels = items.map((it: any) => ({
      shortcode: it.code,
      url: `https://www.instagram.com/reel/${it.code}/`,
      title: it.caption || "Instagram Exploration Reel",
      rawPlays: it.plays,
      views: formatCount(it.plays),
      likes: formatCount(it.likes),
      comments: formatCount(it.comments),
      thumbnailUrl: it.image,
      videoUrl: it.video,
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
