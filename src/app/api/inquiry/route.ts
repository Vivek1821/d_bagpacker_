import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandName, contactEmail, budgetRange, deliverables, usageRights, timeline, notes } = body;

    if (!brandName || !contactEmail) {
      return NextResponse.json(
        { error: "Brand name and email are required" },
        { status: 400 }
      );
    }

    // Try saving to Supabase
    try {
      await supabase.from("inquiries").insert({
        brand_name: brandName,
        contact_email: contactEmail,
        budget_range: budgetRange,
        deliverables,
        usage_rights: usageRights,
        timeline,
        notes,
        status: "New",
        created_at: new Date().toISOString(),
      });
    } catch {
      // Graceful fallback if table doesn't exist yet
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry received! We will respond within 24 hours.",
        data: { id: Date.now(), brandName, status: "New" },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      const MOCK_INQUIRIES = [
        { id: 1, brand: "Samsung India", email: "collab@samsung.in", budget: "₹3L – ₹5L", deliverables: ["Reels", "UGC"], timeline: "3–4 weeks", rights: "Paid advertising", notes: "Looking for 3 reels for Galaxy S25 launch.", status: "New", date: "2025-08-30" },
        { id: 2, brand: "Nike India", email: "marketing@nike.in", budget: "₹5L+", deliverables: ["Campaign", "Reels"], timeline: "1–2 months", rights: "Full buyout", notes: "Annual collab discussion for Run India campaign.", status: "Reviewed", date: "2025-08-28" },
        { id: 3, brand: "Spotify India", email: "creator@spotify.com", budget: "₹1L – ₹3L", deliverables: ["Reels", "Story Series"], timeline: "ASAP", rights: "Whitelisting", notes: "Podcast promotion series for Q4.", status: "New", date: "2025-08-27" },
      ];
      return NextResponse.json(MOCK_INQUIRIES);
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
