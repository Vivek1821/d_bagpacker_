import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

let MEMORY_INQUIRIES = [
  { id: 1, brand_name: "Samsung India", contact_email: "marketing@samsung.in", budget_range: "₹2,50,000 – ₹5,00,000", deliverables: ["Instagram Reel (9:16)", "Paid Performance UGC"], timeline: "Urgent (Within 7–14 days)", notes: "Launch campaign for Galaxy S25 series", status: "New", created_at: "2025-08-28T10:00:00Z" },
  { id: 2, brand_name: "Nike India", contact_email: "collabs@nike.co.in", budget_range: "₹5,00,000 – ₹10,00,000", deliverables: ["Full Brand Campaign", "Multi-Day Story Series"], timeline: "Standard (2–4 weeks)", notes: "Air Max Day 2025 celebration video", status: "In Discussion", created_at: "2025-08-27T14:30:00Z" },
  { id: 3, brand_name: "Spotify India", contact_email: "partnerships@spotify.com", budget_range: "₹1,00,000 – ₹2,50,000", deliverables: ["YouTube Shorts", "Instagram Reel (9:16)"], timeline: "Standard (2–4 weeks)", notes: "Creator podcast launch campaign", status: "Accepted", created_at: "2025-08-25T09:15:00Z" },
  { id: 4, brand_name: "OnePlus", contact_email: "social@oneplus.in", budget_range: "₹2,50,000 – ₹5,00,000", deliverables: ["Instagram Reel (9:16)"], timeline: "Planned (1–2 months)", notes: "Next gen flagship phone unboxing", status: "New", created_at: "2025-08-24T16:45:00Z" },
];

export async function GET() {
  try {
    const { data, error } = await supabase.from("inquiries").select("*").order("id", { ascending: false });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, source: "supabase", data });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, using memory store:", err);
  }
  return NextResponse.json({ success: true, source: "memory", data: MEMORY_INQUIRIES });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newInquiry = {
      brand_name: body.brandName || body.brand_name || "Anonymous Brand",
      contact_email: body.contactEmail || body.contact_email || "contact@brand.com",
      budget_range: body.budgetRange || body.budget_range || "Not specified",
      deliverables: body.deliverables || [],
      timeline: body.timeline || "Flexible",
      notes: body.notes || "",
      status: "New",
    };

    try {
      const { data, error } = await supabase.from("inquiries").insert([newInquiry]).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] }, { status: 201 });
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to memory:", err);
    }

    const created = { id: Date.now(), created_at: new Date().toISOString(), ...newInquiry };
    MEMORY_INQUIRIES.unshift(created);
    return NextResponse.json({ success: true, source: "memory", data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to parse body" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, error: "Missing inquiry ID" }, { status: 400 });

    try {
      const { data, error } = await supabase.from("inquiries").update(updates).eq("id", id).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase update error, falling back to memory:", err);
    }

    MEMORY_INQUIRIES = MEMORY_INQUIRIES.map((i) => (i.id === Number(id) ? { ...i, ...updates } : i));
    const updated = MEMORY_INQUIRIES.find((i) => i.id === Number(id));
    return NextResponse.json({ success: true, source: "memory", data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing inquiry ID" }, { status: 400 });

    try {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (!error) {
        return NextResponse.json({ success: true, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase delete error, falling back to memory:", err);
    }

    MEMORY_INQUIRIES = MEMORY_INQUIRIES.filter((i) => i.id !== Number(id));
    return NextResponse.json({ success: true, source: "memory" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 400 });
  }
}
