import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

let MEMORY_STATS = [
  { id: 1, label: "Instagram Followers", value: 284, suffix: "K", desc: "Active community with 8.4% engagement", category: "Social" },
  { id: 2, label: "YouTube Subscribers", value: 52, suffix: "K", desc: "Cinematic long-form & Shorts audience", category: "Social" },
  { id: 3, label: "Total Content Views", value: 47, suffix: "M+", desc: "Organic lifetime video views", category: "Social" },
  { id: 4, label: "Brand Partnerships", value: 120, suffix: "+", desc: "Completed campaigns for global & Indian brands", category: "Collabs" },
  { id: 5, label: "Avg Engagement Rate", value: 8.4, suffix: "%", desc: "3.5x higher than industry standard average", category: "Collabs" },
  { id: 6, label: "5-Star Reviews", value: 50, suffix: "+", desc: "100% on-time delivery track record", category: "Collabs" },
];

export async function GET() {
  try {
    const { data, error } = await supabase.from("stats").select("*").order("id", { ascending: true });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, source: "supabase", data });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, using memory store:", err);
  }
  return NextResponse.json({ success: true, source: "memory", data: MEMORY_STATS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newStat = {
      label: body.label || "Metric",
      value: Number(body.value) || 0,
      suffix: body.suffix || "",
      desc: body.desc || "",
      category: body.category || "Metric",
    };

    try {
      const { data, error } = await supabase.from("stats").insert([newStat]).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] }, { status: 201 });
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to memory:", err);
    }

    const created = { id: Date.now(), ...newStat };
    MEMORY_STATS.push(created);
    return NextResponse.json({ success: true, source: "memory", data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to parse body" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, error: "Missing stat ID" }, { status: 400 });

    try {
      const { data, error } = await supabase.from("stats").update(updates).eq("id", id).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase update error, falling back to memory:", err);
    }

    MEMORY_STATS = MEMORY_STATS.map((s) => (s.id === Number(id) ? { ...s, ...updates } : s));
    const updated = MEMORY_STATS.find((s) => s.id === Number(id));
    return NextResponse.json({ success: true, source: "memory", data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 400 });
  }
}
