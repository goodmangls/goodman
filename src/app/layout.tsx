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
  title: "GOODMAN GLS - Korea's Cargo GSSA | Airline Cargo Sales Agent",
  description: "Founded in 2014, Goodman GLS is a leading cargo GSSA in Korea. Strategic partner of ECS Group — the world's largest GSSA network spanning 59 countries.",
  keywords: "cargo GSSA, GSA, CSA, airline cargo sales agent, Korea GSSA, air cargo, ECS Group, MPL, EAN, WestJet Cargo, ShunFeng Airlines, Air Busan",
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
