import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

/* Three families, three jobs — plus the serif's italic, which is the luxury
   voice reserved for single accented words (the rotating role, a hovered
   title). Loaded as CSS variables so globals.css owns the mapping and no
   component ever names a font directly. */

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.meta.title,
    template: `%s — ${site.name}`,
  },
  description: site.meta.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    title: site.meta.title,
    description: site.meta.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variables live on <html> so they are in scope for every element,
    // including portals and the 404.
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain antialiased">
        {/* First tab stop on the page — jumps past the navigation. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
