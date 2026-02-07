import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GOODMAN GLS - Your Strategic Partner in Korea & Beyond",
  description: "As members of MPL and EAN networks, GOODMAN GLS delivers time-critical logistics solutions with unmatched reliability across air, ocean, and project cargo.",
  keywords: "logistics, air freight, ocean freight, Korea forwarder, GSA, CSA, MPL, EAN, cargo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
