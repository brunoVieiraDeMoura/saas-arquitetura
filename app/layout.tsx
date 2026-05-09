import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Geist,
  Playfair_Display,
  Cormorant_Garamond,
  Montserrat,
  Josefin_Sans,
  Libre_Baskerville,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const josefin = Josefin_Sans({ variable: "--font-josefin", subsets: ["latin"] });
const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Arquitetura Organizada",
    template: "%s | Arquitetura Organizada",
  },
  description: "O CMS completo para estúdios de arquitetura e design de interiores.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [
    geistSans.variable,
    playfair.variable,
    cormorant.variable,
    montserrat.variable,
    josefin.variable,
    baskerville.variable,
  ].join(" ");

  return (
    <html lang="pt-BR" className={`${fontVars} antialiased`}>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18142224131"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18142224131');
          `}
        </Script>
      </head>
      <body className="min-h-full">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
