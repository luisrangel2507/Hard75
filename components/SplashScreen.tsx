"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SPLASH_MS = 4000;
const FADE_MS = 500;

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), SPLASH_MS);
    return () => clearTimeout(hide);
  }, []);

  useEffect(() => {
    if (visible) return;
    const unmount = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(unmount);
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Image src="/splash.png" alt="75 RISE — Every damn day." fill priority className="object-cover" />
    </div>
  );
}
