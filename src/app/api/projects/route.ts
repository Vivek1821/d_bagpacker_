import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

let MEMORY_PROJECTS = [
  { id: 1, title: "Galaxy S25 Launch Series", client: "Samsung India", deliverables: "3 Reels, 5 Story Sets, Raw B-roll", results: "8.3M views, 340% sales lift", budget: "₹4,50,000", emoji: "📱", status: "Completed" },
  { id: 2, title: "Air Max Day Campaign", client: "Nike India", deliverables: "1 Hero Reel, 2 UGC Cutdowns", results: "5.2M views, 18K link clicks", budget: "₹3,20,000", emoji: "👟", status: "Completed" },
  { id: 3, title: "Monsoon Audio Series", client: "Spotify India", deliverables: "4 Podcast Teasers + Story Ads", results: "3.8M views, 24K new listeners", budget: "₹2,80,000", emoji: "🎵", status: "Active" },
];

export async function GET() {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, source: "supabase", data });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, using memory store:", err);
  }
  return NextResponse.json({ success: true, source: "memory", data: MEMORY_PROJECTS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProject = {
      title: body.title || "Untitled Project",
      client: body.client || "Client",
      deliverables: body.deliverables || "",
      results: body.results || "",
      budget: body.budget || "₹0",
      emoji: body.emoji || "🗂️",
      status: body.status || "Active",
    };

    try {
      const { data, error } = await supabase.from("projects").insert([newProject]).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] }, { status: 201 });
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to memory:", err);
    }

    const created = { id: Date.now(), ...newProject };
    MEMORY_PROJECTS.unshift(created);
    return NextResponse.json({ success: true, source: "memory", data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to parse body" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, error: "Missing project ID" }, { status: 400 });

    try {
      const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase update error, falling back to memory:", err);
    }

    MEMORY_PROJECTS = MEMORY_PROJECTS.map((p) => (p.id === Number(id) ? { ...p, ...updates } : p));
    const updated = MEMORY_PROJECTS.find((p) => p.id === Number(id));
    return NextResponse.json({ success: true, source: "memory", data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing project ID" }, { status: 400 });

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) {
        return NextResponse.json({ success: true, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase delete error, falling back to memory:", err);
    }

    MEMORY_PROJECTS = MEMORY_PROJECTS.filter((p) => p.id !== Number(id));
    return NextResponse.json({ success: true, source: "memory" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 400 });
  }
}
