import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

let MEMORY_POSTS = [
  { id: 1, title: "Golden Hour Bali — FX3 + 24mm", type: "reel", category: "Cinematic", views: "5.2M", likes: "421K", published: true, date: "2025-08-20" },
  { id: 2, title: "OnePlus Open First Impressions Hook", type: "reel", category: "UGC", views: "3.8M", likes: "198K", published: true, date: "2025-08-18" },
  { id: 3, title: "Day in My Life — Full-Time Creator", type: "reel", category: "Lifestyle", views: "7.1M", likes: "562K", published: true, date: "2025-08-15" },
  { id: 4, title: "Mumbai Monsoon — 4K Cinematic Sequence", type: "reel", category: "Travel", views: "4.4M", likes: "334K", published: true, date: "2025-08-12" },
  { id: 5, title: "When WiFi Cuts Out Mid-Collab", type: "reel", category: "Skits", views: "8.3M", likes: "712K", published: true, date: "2025-08-08" },
  { id: 6, title: "Color Grading in DaVinci in 60s", type: "reel", category: "Tutorial", views: "6.4K", likes: "528", published: true, date: "2025-08-02", media_url: "https://www.instagram.com/reel/Dcla50ahuGq/" },
];

export async function GET() {
  try {
    const { data, error } = await supabase.from("posts").select("*").order("id", { ascending: false });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, source: "supabase", data });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, using memory store:", err);
  }
  return NextResponse.json({ success: true, source: "memory", data: MEMORY_POSTS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPost = {
      title: body.title || "Untitled Post",
      category: body.category || "Cinematic",
      type: body.type || "reel",
      views: body.views || "0",
      likes: body.likes || "0",
      published: body.published !== undefined ? body.published : true,
      media_url: body.media_url || body.url || null,
      date: body.date || new Date().toISOString().split("T")[0],
    };

    try {
      const { data, error } = await supabase.from("posts").insert([newPost]).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] }, { status: 201 });
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to memory:", err);
    }

    const created = { id: Date.now(), ...newPost };
    MEMORY_POSTS.unshift(created);
    return NextResponse.json({ success: true, source: "memory", data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to parse body" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, error: "Missing post ID" }, { status: 400 });

    try {
      const { data, error } = await supabase.from("posts").update(updates).eq("id", id).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase update error, falling back to memory:", err);
    }

    MEMORY_POSTS = MEMORY_POSTS.map((p) => (p.id === Number(id) ? { ...p, ...updates } : p));
    const updated = MEMORY_POSTS.find((p) => p.id === Number(id));
    return NextResponse.json({ success: true, source: "memory", data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing post ID" }, { status: 400 });

    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (!error) {
        return NextResponse.json({ success: true, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase delete error, falling back to memory:", err);
    }

    MEMORY_POSTS = MEMORY_POSTS.filter((p) => p.id !== Number(id));
    return NextResponse.json({ success: true, source: "memory" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 400 });
  }
}
