"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, LineChart, Mountain, User } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export function TabBar() {
  const { t } = useI18n();
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: t("dashboard"), Icon: Mountain, active: pathname === "/" },
    { href: "/today", label: t("today"), Icon: CalendarCheck, active: pathname === "/today" || pathname.startsWith("/day/") },
    { href: "/progress", label: t("progress"), Icon: LineChart, active: pathname === "/progress" },
    { href: "/profile", label: t("profile"), Icon: User, active: pathname === "/profile" },
  ];

  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-2 py-2"
    >
      <ul className="flex items-center justify-between">
        {tabs.map(({ href, label, Icon, active }) => (
          <li key={href} className="flex-1 flex justify-center">
            <Link
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-center gap-2 rounded-full h-12 transition-all active:scale-95 ${
                active
                  ? "bg-gradient-to-b from-[#FF8A47] to-[#E8590C] text-white px-5 shadow-[0_6px_24px_rgba(244,114,43,0.45)]"
                  : "w-12 text-white/60 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {active && <span className="text-sm font-semibold">{label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
