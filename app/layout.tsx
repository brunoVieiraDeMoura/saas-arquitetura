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
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D849B2RC77U70JIQMHPG');
              ttq.page();
            }(window, document, 'ttq');
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
