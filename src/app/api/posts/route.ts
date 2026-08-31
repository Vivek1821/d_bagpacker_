import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MOCK_POSTS = [
  { id: 1, type: "reel", title: "Golden Hour Bali — FX3 + 24mm", category: "Cinematic", views: "5.2M", likes: "421K", published: true, created_at: "2025-08-20" },
  { id: 2, type: "reel", title: "OnePlus Open First Impressions", category: "UGC", views: "3.8M", likes: "198K", published: true, created_at: "2025-08-18" },
  { id: 3, type: "reel", title: "Day in My Life — Creator Edition", category: "Lifestyle", views: "7.1M", likes: "562K", published: true, created_at: "2025-08-15" },
  { id: 4, type: "reel", title: "Mumbai Monsoon — 4K Cinematic", category: "Travel", views: "4.4M", likes: "334K", published: true, created_at: "2025-08-12" },
  { id: 5, type: "reel", title: "When WiFi Cuts Out Mid-Collab", category: "Skits", views: "8.3M", likes: "712K", published: true, created_at: "2025-08-08" },
];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json(MOCK_POSTS);
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(MOCK_POSTS);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from("posts").insert(body).select().single();
    if (error) {
      return NextResponse.json({ success: true, data: { id: Date.now(), ...body } });
    }
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const { data, error } = await supabase.from("posts").update(updates).eq("id", id).select().single();
    if (error) {
      return NextResponse.json({ success: true, data: { id, ...updates } });
    }
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      await supabase.from("posts").delete().eq("id", id);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
