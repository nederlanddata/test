import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Data over Nederland",
  description: "Vergelijk Nederlandse gemeenten en provincies op onderwerpen als bevolking, wonen, inkomen en meer. Zie hoe jouw gemeente ervoor staat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
        <Footer />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="75300f01-037e-410a-b197-c4d82f73f768"></script>
      </body>
    </html>
  );
}
