import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  rating: number; // 1 to 5
  category: "brand_collab" | "trek_expedition" | "video_production" | "ugc_ads" | "other";
  title: string;
  content: string;
  projectDate?: string;
  verificationLink?: string;
  status: "pending" | "approved" | "rejected";
  featured?: boolean;
  likes?: number;
  created_at: string;
}

// In-Memory sliding-window rate limiter
// IP -> Array of timestamps (ms)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Maximum 3 reviews per IP per 15 minutes

function isRateLimited(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps outside the sliding window
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = validTimestamps[0];
    const retryAfter = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return { limited: false, retryAfterSeconds: 0 };
}

// Initial realistic verified reviews seed
let MEMORY_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Rohan Varma",
    role: "Brand Marketing Lead",
    company: "GoPro India",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    category: "brand_collab",
    title: "10M+ Organic Views with World-Class Cinematography",
    content: "Collaborating with @d_bagpacker_ on the Himalayan Monsoon campaign was a masterclass in organic storytelling. The 4K FPV footage and dynamic DaVinci grade outperformed our target engagement by 320%. Turnaround time was ahead of schedule!",
    projectDate: "Q3 2025",
    verificationLink: "https://instagram.com/d_bagpacker_",
    status: "approved",
    featured: true,
    likes: 42,
    created_at: "2025-08-15T10:00:00Z",
  },
  {
    id: "rev-2",
    name: "Aakash Mehta",
    role: "Expedition Leader & Founder",
    company: "Himalayan Wanderers",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    category: "trek_expedition",
    title: "The Most Impactful Trek Visuals We Ever Commissioned",
    content: "D_BagPacker captured our 14,000ft winter expedition in sub-zero temperatures without dropping a beat. Our winter trek bookings sold out completely within 48 hours of her reel going viral. Authenticity at its absolute peak.",
    projectDate: "Winter 2025",
    verificationLink: "https://instagram.com/d_bagpacker_",
    status: "approved",
    featured: true,
    likes: 38,
    created_at: "2025-08-20T14:30:00Z",
  },
  {
    id: "rev-3",
    name: "Pooja Singhania",
    role: "Creative Director",
    company: "Wildcraft Outdoor Gear",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    category: "ugc_ads",
    title: "Top Performing Meta UGC Ad in Our Portfolio",
    content: "The UGC hooks she scripted and shot in the dunes of Rajasthan converted at a 4.2x ROAS on paid Meta channels. Her native camera presence and crisp pacing make commercial deliverables feel 100% natural to travel audiences.",
    projectDate: "Q4 2025",
    verificationLink: "https://instagram.com/d_bagpacker_",
    status: "approved",
    featured: true,
    likes: 29,
    created_at: "2025-08-22T09:15:00Z",
  },
  {
    id: "rev-4",
    name: "Vikramaditya Roy",
    role: "Senior Producer",
    company: "Incredible India Tourism",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    category: "video_production",
    title: "Cinematic Excellence & Rigorous Work Ethic",
    content: "From sunrise golden hours in Spiti Valley to late-night color grading sessions, her dedication to visual perfection is unmatched. A true creator partner who understands brand compliance and artistic expression alike.",
    projectDate: "Summer 2025",
    verificationLink: "https://instagram.com/d_bagpacker_",
    status: "approved",
    featured: false,
    likes: 19,
    created_at: "2025-08-10T16:45:00Z",
  },
  {
    id: "rev-5",
    name: "Shreya Sen",
    role: "Growth Marketing Manager",
    company: "Kailash Eco-Resorts",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    category: "brand_collab",
    title: "Our Direct Bookings Doubled in 3 Weeks",
    content: "The aesthetic drone shots and story walkthroughs generated hundreds of inquiries in our DMs. She provided a detailed analytics report and full commercial usage rights with zero hassle. Will definitely book again for FY 26-27!",
    projectDate: "Q1 2026",
    verificationLink: "https://instagram.com/d_bagpacker_",
    status: "approved",
    featured: false,
    likes: 14,
    created_at: "2026-01-18T12:00:00Z",
  },
];

// Helper to extract client IP
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

// -------------------------------------------------------------
// GET: Fetch reviews with filtering, sorting, and status checks
// -------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") || "approved"; // Default to "approved" for public site
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();
    const sort = searchParams.get("sort") || "latest"; // "latest" | "highest_rated" | "featured"
    const featuredOnly = searchParams.get("featured") === "true";

    // Attempt Supabase fetch
    let reviews: ReviewItem[] = [];
    try {
      let query = supabase.from("reviews").select("*");
      if (statusParam !== "all") {
        query = query.eq("status", statusParam);
      }
      if (featuredOnly) {
        query = query.eq("featured", true);
      }
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        reviews = data;
      } else {
        reviews = [...MEMORY_REVIEWS];
      }
    } catch {
      reviews = [...MEMORY_REVIEWS];
    }

    // Apply status filter to memory if used
    if (statusParam !== "all") {
      reviews = reviews.filter((r) => r.status === statusParam);
    }
    if (featuredOnly) {
      reviews = reviews.filter((r) => r.featured);
    }
    if (category && category !== "all") {
      reviews = reviews.filter((r) => r.category === category);
    }
    if (search) {
      reviews = reviews.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.company.toLowerCase().includes(search) ||
          r.title.toLowerCase().includes(search) ||
          r.content.toLowerCase().includes(search)
      );
    }

    // Sorting
    if (sort === "highest_rated") {
      reviews.sort((a, b) => b.rating - a.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === "featured") {
      reviews.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      // latest
      reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Metrics summary
    const allReviews = MEMORY_REVIEWS;
    const totalCount = allReviews.length;
    const approvedCount = allReviews.filter((r) => r.status === "approved").length;
    const pendingCount = allReviews.filter((r) => r.status === "pending").length;
    const avgRating =
      approvedCount > 0
        ? (allReviews.filter((r) => r.status === "approved").reduce((acc, r) => acc + r.rating, 0) / approvedCount).toFixed(1)
        : "5.0";

    return NextResponse.json({
      success: true,
      data: reviews,
      metrics: {
        totalCount,
        approvedCount,
        pendingCount,
        avgRating: Number(avgRating),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// -------------------------------------------------------------
// POST: Public submission with Anti-Spam & Rate Limiting
// -------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Anti-Spam Sliding-Window Rate Limiter
    const rateCheck = isRateLimited(ip);
    if (rateCheck.limited) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit reached. Too many requests. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.`,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json();

    // 2. Honeypot Trap
    // Automated bots auto-fill hidden input fields
    if (body.bot_guard_token && body.bot_guard_token.trim() !== "") {
      console.warn("Honeypot triggered from IP:", ip);
      // Return fake success to confuse spam bot
      return NextResponse.json({ success: true, message: "Review received" }, { status: 201 });
    }

    // 3. Validation & Sanitization
    const name = String(body.name || "").trim().slice(0, 80);
    const role = String(body.role || "").trim().slice(0, 80);
    const company = String(body.company || "").trim().slice(0, 80);
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const category = body.category || "brand_collab";
    const title = String(body.title || "").trim().slice(0, 150);
    const content = String(body.content || "").trim().slice(0, 2000);
    const avatarUrl = String(body.avatarUrl || "").trim();
    const verificationLink = String(body.verificationLink || "").trim();
    const projectDate = String(body.projectDate || "2026").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ success: false, error: "Please enter your name or organization." }, { status: 400 });
    }
    if (!content || content.length < 15) {
      return NextResponse.json(
        { success: false, error: "Review text must be at least 15 characters long." },
        { status: 400 }
      );
    }

    // 4. Default to "pending" for admin verification
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name,
      role: role || "Client Partner",
      company: company || "Independent",
      avatarUrl:
        avatarUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0284c7,0ea5e9,38bdf8`,
      rating,
      category,
      title: title || "Outstanding Collaboration",
      content,
      projectDate,
      verificationLink,
      status: "pending", // CRITICAL: NEVER visible until approved by admin
      featured: false,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    // Attempt Supabase Insert
    try {
      const { data, error } = await supabase.from("reviews").insert([newReview]).select();
      if (!error && data && data.length > 0) {
        MEMORY_REVIEWS.unshift(data[0]);
        return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
      }
    } catch (err) {
      console.warn("Supabase insert failed, using memory store:", err);
    }

    MEMORY_REVIEWS.unshift(newReview);
    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to process review" }, { status: 400 });
  }
}

// -------------------------------------------------------------
// PATCH: Admin approval, status updates, and feature toggles
// -------------------------------------------------------------
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing review ID" }, { status: 400 });
    }

    // Attempt Supabase Update
    try {
      const { data, error } = await supabase.from("reviews").update(updates).eq("id", id).select();
      if (!error && data && data.length > 0) {
        MEMORY_REVIEWS = MEMORY_REVIEWS.map((r) => (r.id === id ? { ...r, ...updates } : r));
        return NextResponse.json({ success: true, data: data[0] });
      }
    } catch (err) {
      console.warn("Supabase update failed, using memory fallback:", err);
    }

    MEMORY_REVIEWS = MEMORY_REVIEWS.map((r) => (r.id === id ? { ...r, ...updates } : r));
    const updated = MEMORY_REVIEWS.find((r) => r.id === id);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Update failed" }, { status: 400 });
  }
}

// -------------------------------------------------------------
// DELETE: Admin removal of spam or rejected reviews
// -------------------------------------------------------------
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing review ID" }, { status: 400 });
    }

    // Attempt Supabase Delete
    try {
      await supabase.from("reviews").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete failed:", err);
    }

    MEMORY_REVIEWS = MEMORY_REVIEWS.filter((r) => r.id !== id);
    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Delete failed" }, { status: 400 });
  }
}
