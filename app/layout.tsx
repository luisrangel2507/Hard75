import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel" });
import { I18nProvider } from "@/components/I18nProvider";
import { SplashScreen } from "@/components/SplashScreen";
import { resolveLang } from "@/lib/langServer";

export const metadata: Metadata = {
  title: "75 RISE",
  description: "Tracker del reto de 75 días de disciplina.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLang = resolveLang();

  return (
    <html lang={initialLang} className={pixel.variable}>
      <body className="min-h-screen font-sans antialiased">
        <SplashScreen />
        <I18nProvider initialLang={initialLang}>{children}</I18nProvider>
      </body>
    </html>
  );
}
