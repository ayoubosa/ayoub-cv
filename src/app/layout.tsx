import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/react"; // <-- Add this line
export const metadata: Metadata = {
  title: "Ayoub Osama Ayoub | Software Engineer · AI Enthusiast · Entrepreneur",
  description:
    "Software Engineer graduated from Üsküdar University, focused on building practical software and AI-powered applications.",
  openGraph: {
    title: "Ayoub Osama Ayoub",
    description:
      "Software Engineer · AI Enthusiast · Entrepreneur",
    type: "website",
  },
  other: {
    "og:image": "/assets/og-image.png",
    "twitter:card": "summary_large_image",
    "twitter:title": "Ayoub Osama Ayoub",
    "twitter:description": "Software Engineer · AI Enthusiast · Entrepreneur",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className="antialiased">
      <Providers>{children}</Providers>
      <Analytics />
    </body>
    </html>
  );
}
