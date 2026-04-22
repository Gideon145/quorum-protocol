import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Quorum Protocol — Don't Build Blind",
  description:
    "Before you waste 3 months building the wrong thing, stress-test your idea against 20 synthetic user archetypes first.",
  openGraph: {
    title: "Quorum Protocol",
    description: "Don't build blind. Run a quorum.",
    siteName: "Quorum Protocol",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${inter.className}`}>{children}</body>
    </html>
  );
}
