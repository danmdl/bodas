import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./redesign.css";
import "./refinements.css";
import "./hero-refresh.css";
import { wedding } from "@/config/wedding";

const serif = localFont({
  src: [
    {
      path: "../public/fonts/cormorant-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/cormorant-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/cormorant-medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
const sans = localFont({
  src: [
    {
      path: "../public/fonts/manrope-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope-semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  title: `${wedding.names.first} & ${wedding.names.second} | ${wedding.dateLabel}`,
  description:
    "Una historia, un sí y un viaje por descubrir. Acompañanos en nuestra próxima gran aventura.",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
