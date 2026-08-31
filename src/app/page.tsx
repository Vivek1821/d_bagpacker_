"use client";

import { useState } from "react";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ReelPlayer from "@/components/sections/ReelPlayer";
import ContentGrid from "@/components/sections/ContentGrid";
import RoiCalculator from "@/components/sections/RoiCalculator";
import BehindTheCut from "@/components/sections/BehindTheCut";
import VideoHotspots from "@/components/sections/VideoHotspots";
import StatsSection from "@/components/sections/StatsSection";
import GearGrid from "@/components/sections/GearGrid";
import AboutSection from "@/components/sections/AboutSection";
import InquiryForm from "@/components/sections/InquiryForm";
import Footer from "@/components/sections/Footer";
import VideoModal, { PostItem } from "@/components/ui/VideoModal";
import TravelAudioPlayer from "@/components/ui/TravelAudioPlayer";

export default function HomePage() {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ReelPlayer />
      <ContentGrid onSelectPost={(post) => setSelectedPost(post)} />
      
      {/* Interactive Campaign Reach & ROI Estimator */}
      <div id="calculator">
        <RoiCalculator />
      </div>

      <BehindTheCut />
      <VideoHotspots />
      <GearGrid />
      <AboutSection />
      <InquiryForm />
      <Footer />

      {/* Ambient Alpine Adventure Sound Player */}
      <TravelAudioPlayer />

      {/* Cinematic Video Lightbox Modal */}
      <VideoModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </main>
  );
}
