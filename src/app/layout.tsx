import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
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

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GOODMAN GLS',
  legalName: 'GOODMAN Global Logistics Service',
  url: 'https://goodmangls.com',
  foundingDate: '2014',
  description:
    'Korea-based integrated logistics company providing air, ocean, road, customs brokerage, warehousing, 3PL, and project cargo services.',
  areaServed: ['KR', 'Global'],
  knowsAbout: [
    'Air freight',
    'Ocean freight',
    'Road transport',
    'Customs brokerage',
    'Warehousing',
    '3PL',
    'Project cargo',
  ],
  memberOf: [
    { '@type': 'Organization', name: 'MarcoPoloLine Group' },
    { '@type': 'Organization', name: 'EAN Networks', identifier: 'Member No. 4952' },
    { '@type': 'Organization', name: 'International Air Transport Association', identifier: '17-3 7233 0010' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://goodmangls.com"),
  title: "GOODMAN GLS — Integrated Logistics in Korea | Air, Ocean, Road, Customs & Warehousing",
  description: "Founded in 2014, GOODMAN GLS is an integrated logistics company in Korea — air, ocean, and road freight, customs brokerage, and warehousing/3PL. Backed by ECS Group's 59-country network, MPL, EAN, and IATA membership.",
  keywords: "integrated logistics, freight forwarding Korea, air freight, ocean freight, land transport, customs brokerage, warehousing, 3PL, project cargo, Korea logistics, ECS Group, MPL, EAN, IATA",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ko: "/ko",
      "x-default": "/",
    },
  },
  openGraph: {
    url: "https://goodmangls.com/",
    siteName: "GOODMAN GLS",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${mono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Suspense>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
