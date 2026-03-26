import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Enclecta — Premium IT Solutions",
  description:
    "Enclecta delivers enterprise-grade technology solutions — from cloud infrastructure to custom software engineering — crafted with precision and purpose.",
  keywords: ["IT company", "software development", "cloud solutions", "enterprise technology"],
  openGraph: {
    title: "Enclecta — Premium IT Solutions",
    description: "Enterprise technology, engineered with precision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable}`}
      style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
    >
      <body className="min-h-screen bg-[var(--color-void)] text-[var(--color-white)] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
