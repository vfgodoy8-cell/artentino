import type { Metadata } from "next";
import { Nunito, Dancing_Script } from "next/font/google";
import "./globals.css";
import Marquee from "./ui/marquee";
import Header from "./ui/header";
import Footer from "./ui/footer";
import InstagramFeed from "./ui/instagram-feed";
import Providers from "./providers"
import WhatsAppButton from "./ui/whatsapp-button";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://artentino.com'),
  title: "Artentino — Deco, hogar y regalos únicos",
  description:
    "Explorá nuestro catálogo de deco, hogar y regalos únicos. Cuotas sin interés, envíos a todo el país y showroom en Colegiales CABA.",
  openGraph: {
    title: "Artentino — Deco, hogar y regalos únicos",
    description:
      "Explorá nuestro catálogo de deco, hogar y regalos únicos. Cuotas sin interés, envíos a todo el país y showroom en Colegiales CABA.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Artentino" }],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artentino — Deco, hogar y regalos únicos",
    description:
      "Explorá nuestro catálogo de deco, hogar y regalos únicos. Cuotas sin interés, envíos a todo el país y showroom en Colegiales CABA.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-dark">
        <Providers>
          <Marquee />
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <InstagramFeed />
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
