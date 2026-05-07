import type { Metadata } from "next";
import { Nunito, Dancing_Script } from "next/font/google";
import "./globals.css";
import Marquee from "./ui/marquee";
import Header from "./ui/header";
import Footer from "./ui/footer";
import { CartProvider } from "./context/cart-context";

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
  title: "Artentino — Deco, hogar y regalos únicos",
  description:
    "Explorá nuestro catálogo de deco, hogar y regalos únicos. Cuotas sin interés, envíos a todo el país y showroom en Colegiales CABA.",
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
        <CartProvider>
          <Marquee />
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
