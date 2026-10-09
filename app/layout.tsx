import type { Metadata } from "next";
import "./globals.css";
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
    <html lang={initialLang}>
      <body className="min-h-screen font-sans antialiased">
        <SplashScreen />
        <I18nProvider initialLang={initialLang}>{children}</I18nProvider>
      </body>
    </html>
  );
}
