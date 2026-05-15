import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: "../public/fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800"
});

export const metadata: Metadata = {
  title: "AduraMart | Trusted Spiritual Marketplace",
  description:
    "A calm, premium faith-based marketplace for verified spiritual vendors, worship communities, and customers across Nigeria and beyond."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
