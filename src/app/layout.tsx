import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { SiteAnalytics } from "@/components/site-analytics";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const siteUrl = "https://izzyt.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Izzy Thomson — Demo, don't memo.",
    template: "%s · Izzy Thomson",
  },
  description:
    "Building AI agents for big companies as Head of AI at Issoria. Shipping my own AI apps on the side and posting what I learn.",
  openGraph: {
    title: "Izzy Thomson — Demo, don't memo.",
    description:
      "Building AI agents for big companies as Head of AI at Issoria. Shipping my own AI apps on the side and posting what I learn.",
    url: siteUrl,
    siteName: "Izzy Thomson",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@IzzyT_com",
    creator: "@IzzyT_com",
    title: "Izzy Thomson — Demo, don't memo.",
    description:
      "Building AI agents for big companies as Head of AI at Issoria. Shipping my own AI apps on the side and posting what I learn.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${dmSans.variable} ${barlowCondensed.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans text-foreground">
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
