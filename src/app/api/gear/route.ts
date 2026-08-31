import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

let MEMORY_GEAR = [
  { id: 1, name: "Sony FX3 Cinema Line", category: "Camera", desc: "Full-frame 4K 120fps 10-bit 4:2:2 cinema camera", emoji: "📷", badge: "A-Cam Cinema", in_rig: true },
  { id: 2, name: "Sony FE 24-70mm f/2.8 GM II", category: "Camera", desc: "Flagship standard zoom G-Master lens", emoji: "🔭", badge: "Hero Lens", in_rig: true },
  { id: 3, name: "Rode Wireless PRO", category: "Audio", desc: "32-bit float dual wireless recording kit", emoji: "🎙️", badge: "Wireless Audio", in_rig: true },
  { id: 4, name: "DaVinci Resolve Studio 19", category: "Editing", desc: "ACES color grading suite and NLE workstation", emoji: "🎨", badge: "Color & NLE", in_rig: true },
];

export async function GET() {
  try {
    const { data, error } = await supabase.from("gear").select("*").order("id", { ascending: false });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, source: "supabase", data });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, using memory store:", err);
  }
  return NextResponse.json({ success: true, source: "memory", data: MEMORY_GEAR });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newGear = {
      name: body.name || "Untitled Gear",
      category: body.category || "Camera",
      desc: body.desc || "",
      emoji: body.emoji || "📷",
      badge: body.badge || "In Studio",
      in_rig: body.in_rig !== undefined ? body.in_rig : true,
    };

    try {
      const { data, error } = await supabase.from("gear").insert([newGear]).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] }, { status: 201 });
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to memory:", err);
    }

    const created = { id: Date.now(), ...newGear };
    MEMORY_GEAR.unshift(created);
    return NextResponse.json({ success: true, source: "memory", data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to parse body" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, error: "Missing gear ID" }, { status: 400 });

    try {
      const { data, error } = await supabase.from("gear").update(updates).eq("id", id).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase update error, falling back to memory:", err);
    }

    MEMORY_GEAR = MEMORY_GEAR.map((g) => (g.id === Number(id) ? { ...g, ...updates } : g));
    const updated = MEMORY_GEAR.find((g) => g.id === Number(id));
    return NextResponse.json({ success: true, source: "memory", data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing gear ID" }, { status: 400 });

    try {
      const { error } = await supabase.from("gear").delete().eq("id", id);
      if (!error) {
        return NextResponse.json({ success: true, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase delete error, falling back to memory:", err);
    }

    MEMORY_GEAR = MEMORY_GEAR.filter((g) => g.id !== Number(id));
    return NextResponse.json({ success: true, source: "memory" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 400 });
  }
}
