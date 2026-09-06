import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { meta } from "@/content/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: `${meta.name} · ${meta.role}`,
  description: meta.description,
  openGraph: {
    type: "website",
    url: meta.siteUrl,
    title: `${meta.name} · ${meta.role}`,
    description: meta.description,
    siteName: meta.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${meta.name} · ${meta.role}`,
    description: meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f1012" },
    { media: "(prefers-color-scheme: light)", color: "#0f1012" },
  ],
};

const groundScript = `try{if(localStorage.getItem("ground")==="paper"){document.documentElement.setAttribute("data-ground","paper")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: groundScript }} />
      </head>
      <body>
        <SmoothScroll>
          <Preloader />
          <Nav />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
