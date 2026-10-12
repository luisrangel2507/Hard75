"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, House, LineChart, User } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export function TabBar() {
  const { t } = useI18n();
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: t("dashboard"), Icon: House, active: pathname === "/" },
    {
      href: "/today",
      label: t("today"),
      Icon: CalendarCheck,
      active: pathname === "/today" || pathname.startsWith("/day/"),
    },
    { href: "/progress", label: t("progress"), Icon: LineChart, active: pathname === "/progress" },
    { href: "/profile", label: t("profile"), Icon: User, active: pathname === "/profile" },
  ];

  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 bg-panel/95 backdrop-blur-md border border-border rounded-3xl"
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-4 px-2 py-1.5">
        {tabs.map(({ href, label, Icon, active }) => (
          <li key={href} className="relative">
            {active && <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-0.5 w-10 rounded-full bg-brass" />}
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[11px] font-semibold transition active:scale-95 ${
                active ? "text-brass" : "text-muted hover:text-ink"
              }`}
            >
              <span className="h-7 w-12 flex items-center justify-center">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
