import { cookies, headers } from "next/headers";
import { detectLangFromAcceptLanguage } from "./i18n";
import { Lang } from "./types";

/** Cookie preference wins; otherwise falls back to the browser's Accept-Language. */
export function resolveLang(): Lang {
  const cookieLang = cookies().get("ff75_lang")?.value;
  if (cookieLang === "en" || cookieLang === "es") return cookieLang;
  return detectLangFromAcceptLanguage(headers().get("accept-language"));
}
