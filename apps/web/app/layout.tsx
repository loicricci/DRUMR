import type { Metadata } from "next";
import { DM_Sans, Inter, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DrumR, the agentic operating system for innovation",
  description:
    "Autonomous CEO agent guiding teams from ideation through product-solution fit to product-market fit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} ${dmSans.variable} font-sans`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
