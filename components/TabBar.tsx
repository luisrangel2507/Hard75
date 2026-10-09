"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, LayoutGrid, LineChart, User } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export function TabBar() {
  const { t } = useI18n();
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: t("dashboard"), Icon: LayoutGrid, active: pathname === "/" },
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
      className="fixed bottom-0 inset-x-0 z-30 bg-bg/90 backdrop-blur-md border-t border-border/70 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-4 px-2 py-1.5">
        {tabs.map(({ href, label, Icon, active }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wide font-semibold transition active:scale-95 ${
                active ? "text-brass" : "text-muted hover:text-ink"
              }`}
            >
              <span
                className={`h-7 w-12 rounded-full flex items-center justify-center transition-colors ${
                  active ? "bg-brass/15" : ""
                }`}
              >
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
