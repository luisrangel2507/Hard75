import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { Lang } from "@/lib/types";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-label",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Fit for 75",
  description: "Tracker del reto de 75 días de disciplina.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLang = cookies().get("ff75_lang")?.value;
  const initialLang: Lang = cookieLang === "en" ? "en" : "es";

  return (
    <html lang={initialLang} className={`${oswald.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <I18nProvider initialLang={initialLang}>{children}</I18nProvider>
      </body>
    </html>
  );
}
