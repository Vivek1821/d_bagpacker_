import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

let MEMORY_REELS = [
  { id: 1, title: "Golden Hour Bali — FX3 + 24mm", url: "https://instagram.com/reel/1", thumbnail: "🌅", views: "5.2M", likes: "421K", category: "Cinematic", published: true, date: "2025-08-20" },
  { id: 2, title: "OnePlus Open First Impressions", url: "https://instagram.com/reel/2", thumbnail: "📱", views: "3.8M", likes: "198K", category: "UGC", published: true, date: "2025-08-18" },
  { id: 3, title: "Day in My Life — Creator Edition", url: "https://instagram.com/reel/3", thumbnail: "🎬", views: "7.1M", likes: "562K", category: "Lifestyle", published: true, date: "2025-08-15" },
  { id: 4, title: "Mumbai Monsoon — 4K Cinematic", url: "https://instagram.com/reel/4", thumbnail: "🌧️", views: "4.4M", likes: "334K", category: "Travel", published: true, date: "2025-08-12" },
  { id: 5, title: "When WiFi Cuts Out Mid-Collab", url: "https://instagram.com/reel/5", thumbnail: "😂", views: "8.3M", likes: "712K", category: "Skits", published: true, date: "2025-08-08" },
  { id: 6, title: "Color Grading in DaVinci in 60s", url: "https://www.instagram.com/reel/Dcla50ahuGq/", thumbnail: "🎨", views: "6.4K", likes: "528", category: "Tutorial", published: true, date: "2025-08-02" },
];

export async function GET() {
  try {
    const { data, error } = await supabase.from("reels").select("*").order("id", { ascending: false });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, source: "supabase", data });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, using memory store:", err);
  }
  return NextResponse.json({ success: true, source: "memory", data: MEMORY_REELS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newReel = {
      title: body.title || "Untitled Reel",
      url: body.url || "",
      thumbnail: body.thumbnail || "🎬",
      thumbnailUrl: body.thumbnailUrl || "",
      mediaType: body.mediaType || "video",
      embedUrl: body.embedUrl || "",
      suggestedMusic: body.suggestedMusic || "cinematic",
      views: body.views || "0",
      likes: body.likes || "0",
      category: body.category || "Cinematic",
      published: body.published !== undefined ? body.published : true,
      date: body.date || new Date().toISOString().split("T")[0],
    };

    try {
      const { data, error } = await supabase.from("reels").insert([newReel]).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] }, { status: 201 });
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to memory:", err);
    }

    const created = { id: Date.now(), ...newReel };
    MEMORY_REELS.unshift(created);
    return NextResponse.json({ success: true, source: "memory", data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to parse body" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, error: "Missing reel ID" }, { status: 400 });

    try {
      const { data, error } = await supabase.from("reels").update(updates).eq("id", id).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase update error, falling back to memory:", err);
    }

    MEMORY_REELS = MEMORY_REELS.map((r) => (r.id === Number(id) ? { ...r, ...updates } : r));
    const updated = MEMORY_REELS.find((r) => r.id === Number(id));
    return NextResponse.json({ success: true, source: "memory", data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing reel ID" }, { status: 400 });

    try {
      const { error } = await supabase.from("reels").delete().eq("id", id);
      if (!error) {
        return NextResponse.json({ success: true, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase delete error, falling back to memory:", err);
    }

    MEMORY_REELS = MEMORY_REELS.filter((r) => r.id !== Number(id));
    return NextResponse.json({ success: true, source: "memory" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 400 });
  }
}
