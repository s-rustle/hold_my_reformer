import type { Metadata } from "next";
import { Oswald, Work_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hold My Reformer | Pilates Sessions",
  description:
    "Book and reserve your Pilates reformer sessions. Grounded vitality — movement stilled into elegant form.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${workSans.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
