import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

let MEMORY_PROFILE = {
  id: 1,
  name: "Vivek Creates",
  handle: "@vivek.creates",
  email: "hello@vivekcreates.in",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  bio: "Full-time cinematic storyteller creating high-retention commercial reels and UGC campaigns.",
  instagram: "https://instagram.com/vivek.creates",
  youtube: "https://youtube.com/@vivek.creates",
  primary_rate: "₹35,000 / Reel",
  retainer_rate: "₹1,50,000 / Month",
};

export async function GET() {
  try {
    const { data, error } = await supabase.from("business_profile").select("*").eq("id", 1).maybeSingle();
    if (!error && data) {
      return NextResponse.json({ success: true, source: "supabase", data });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, using memory store:", err);
  }
  return NextResponse.json({ success: true, source: "memory", data: MEMORY_PROFILE });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    try {
      const { data, error } = await supabase.from("business_profile").upsert({ id: 1, ...body, updated_at: new Date().toISOString() }).select();
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase upsert error, falling back to memory:", err);
    }

    MEMORY_PROFILE = { ...MEMORY_PROFILE, ...body };
    return NextResponse.json({ success: true, source: "memory", data: MEMORY_PROFILE });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 400 });
  }
}
