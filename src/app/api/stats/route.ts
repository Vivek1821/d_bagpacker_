import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const MOCK_STATS = {
    instagram: {
      followers: 284000,
      posts: 520,
      avg_engagement_rate: 8.4,
      total_reach: 18400000,
    },
    youtube: {
      subscribers: 52000,
      videos: 48,
      total_views: 4200000,
    },
    global: {
      total_views: 47000000,
      brand_deals: 120,
      years_active: 6,
    },
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.from("stats").select("*").single();
    if (!error && data) {
      return NextResponse.json(data);
    }
  } catch {
    // Fallback to default
  }

  return NextResponse.json(MOCK_STATS);
}
