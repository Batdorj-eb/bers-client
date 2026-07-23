import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata = {
  title: "BERS.mn",
  description: "Өдөр тутмын мэдээллийн эх сурвалж",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn" className={`${manrope.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen font-body antialiased text-ink">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
