import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petal & Cocoa — Owner Dashboard",
  description: "Owner-facing dashboard for Petal & Cocoa cake shop management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF6F0] text-[#3D2314] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
