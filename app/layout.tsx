import type { Metadata, Viewport } from "next";
import { Newsreader, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";
import SkipLink from "@/components/layout/SkipLink";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import OpeningSequence from "@/components/motion/OpeningSequence";
import ReadingProgress from "@/components/motion/ReadingProgress";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}, ${siteConfig.brand}`,
    template: `%s, ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brand,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  keywords: [
    "Hari Kancharla",
    "Hari Krishna Kancharla",
    "AI Systems Engineer",
    "LLM evaluation",
    "AI agents",
    "retrieval",
    "Boston",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.brand,
    title: `${siteConfig.name}, ${siteConfig.brand}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}, ${siteConfig.brand}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f2eee5",
  colorScheme: "light",
};

// Arms the reveal start-state before paint, only when JS works AND motion is
// allowed, so there is never a flash and content is fully visible otherwise.
// Fail-open: arm the reveal start-state before paint (only when motion is
// allowed), but if the motion system does not confirm readiness within a short
// window, remove it so no animation failure can leave content hidden. The
// motion provider sets window.__tsjMotionReady and clears the timer once live.
const revealScript = `try{if(window.matchMedia&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.setAttribute('data-reveal-ready','');window.__tsjRevealFailsafe=setTimeout(function(){if(!window.__tsjMotionReady){d.removeAttribute('data-reveal-ready')}},2200)}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <SkipLink />
        <MotionProvider>
          <ReadingProgress />
          <SiteHeader />
          <main id="main">{children}</main>
          <Footer />
          <OpeningSequence />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </body>
    </html>
  );
}
