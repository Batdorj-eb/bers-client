import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";

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
  description: "АНУ дахь Монголчуудад зориулсан мэдээллийн эх сурвалж",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn" className={`${manrope.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen font-body antialiased text-ink">
        {children}
      </body>
    </html>
  );
}
