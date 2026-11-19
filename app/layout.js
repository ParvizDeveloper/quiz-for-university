import { Unbounded, Nunito } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["600", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Nunito({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Animation History Quiz",
  description: "8 questions about the history of animation, from the zoetrope to neural networks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
