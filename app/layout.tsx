import type { Metadata } from "next";
import { Chivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Chivo: body / UI text (Thin 100, Light 300)
const chivo = Chivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "300", "400"],
});

// Source Serif 4: display / headings (maps to "Source Serif Pro" in Figma)
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Guilded",
  description: "Your craft deserves a council.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chivo.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
