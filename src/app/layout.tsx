import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const metadata: Metadata = {
  title: "Creator Portfolio — Content Creator & Visual Storyteller",
  description:
    "Award-winning content creator specializing in cinematic reels, brand collaborations, and high-retention video storytelling. Available for partnerships.",
  keywords: ["content creator", "instagram reels", "brand collaboration", "video production", "visual storytelling"],
  openGraph: {
    title: "Creator Portfolio",
    description: "Cinematic content creator. Available for brand collaborations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#020202] text-white font-grotesk antialiased">
        <CustomCursor />
        <ScrollProgress />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(2,2,2,0.95)",
              color: "#f0f0f0",
              border: "1px solid rgba(0,255,127,0.2)",
              borderRadius: "12px",
              fontFamily: "Space Grotesk, sans-serif",
              backdropFilter: "blur(16px)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
