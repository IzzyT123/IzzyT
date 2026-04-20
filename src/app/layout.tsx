import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const siteUrl = "https://izzyt.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Izzy Thomson — AI product engineer",
    template: "%s · Izzy Thomson",
  },
  description:
    "AI product engineer. Ships AI tools, agents, and enterprise AI systems—GPT Builder Pro (#1, 100K+ chats), ChangeAble.ai, and monthly public builds.",
  openGraph: {
    title: "Izzy Thomson — AI product engineer",
    description:
      "AI product engineer. Ships AI tools, agents, and enterprise AI systems—GPT Builder Pro (#1, 100K+ chats), ChangeAble.ai, and monthly public builds.",
    url: siteUrl,
    siteName: "Izzy Thomson",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Izzy Thomson — AI product engineer",
    description:
      "AI product engineer. Ships AI tools, agents, and enterprise AI systems—GPT Builder Pro (#1, 100K+ chats), ChangeAble.ai, and monthly public builds.",
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
      className={`${dmSans.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans text-foreground">{children}</body>
    </html>
  );
}
