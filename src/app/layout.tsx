import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Resume — Your achievements. Your evidence. Your story.",
  description:
    "Don't just list what you can do. Show what you've done. Capture your achievements, prove your experiences, and build a trusted professional identity that grows with you.",
  keywords: [
    "life resume",
    "achievement verification",
    "digital portfolio",
    "verified resume",
    "student credentials",
    "career portfolio",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-ivory text-brand-dark flex flex-col antialiased selection:bg-brand-yellow/30 selection:text-brand-dark">
        {children}
      </body>
    </html>
  );
}
