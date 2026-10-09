"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bike, BookOpen, Camera, Droplets, Dumbbell, Lock, UtensilsCrossed, Wine } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { PHASES } from "@/lib/phases";
import { Lang, TOTAL_DAYS } from "@/lib/types";

const STORAGE_KEY = "ff75_onboarded";
const STEPS = 4;

const BG = { brass: "bg-brass", ember: "bg-ember", olive: "bg-olive" } as const;
const TEXT = { brass: "text-brass", ember: "text-ember", olive: "text-olive" } as const;

const COPY: Record<
  Lang,
  {
    skip: string;
    next: string;
    back: string;
    start: string;
    heroKicker: string;
    heroTitle: string;
    heroBody: string;
    rulesTitle: string;
    rulesBody: string;
    rules: { icon: typeof Dumbbell; title: string; detail: string }[];
    phasesTitle: string;
    phasesBody: string;
    days: string;
    readyTitle: string;
    readyBody: string;
    lockTitle: string;
    lockBody: string;
  }
> = {
  es: {
    skip: "Saltar",
    next: "Siguiente",
    back: "Atrás",
    start: "Empezar el día 1",
    heroKicker: "El reto",
    heroTitle: "75 días. Cero excusas.",
    heroBody: "Una lista corta de reglas que cumples todos los días, sin saltarte ninguno. No es una dieta: es demostrarte que cumples lo que dices.",
    rulesTitle: "Cada día, 7 reglas",
    rulesBody: "Un día solo cuenta si cumples todas.",
    rules: [
      { icon: Dumbbell, title: "Entreno interior", detail: "Una sesión de fuerza, cardio o lo que elijas." },
      { icon: Bike, title: "Entreno exterior", detail: "Otra sesión al aire libre, distinta de la primera." },
      { icon: Wine, title: "Dieta y sin alcohol", detail: "Comida limpia, sin trampas ni alcohol." },
      { icon: BookOpen, title: "Lee 10+ páginas", detail: "De un libro de no ficción o desarrollo personal." },
      { icon: Droplets, title: "3.8 L de agua", detail: "Súmalo durante el día desde la app." },
      { icon: UtensilsCrossed, title: "Foto de tus 3 comidas", detail: "Desayuno, comida y cena como evidencia." },
      { icon: Camera, title: "Foto de progreso", detail: "Una foto diaria para ver tu cambio real." },
    ],
    phasesTitle: "Tres fases, un sentido",
    phasesBody: "Los 75 días no pesan igual. Cada fase cambia lo que el reto te pide.",
    days: "Días",
    readyTitle: "Un día a la vez",
    readyBody: "La app te lleva de la mano y celebra cada logro. Solo tienes que abrirla y cumplir el día de hoy.",
    lockTitle: "El siguiente día se desbloquea al cumplir el actual",
    lockBody: "Así no hay atajos: la racha es real.",
  },
  en: {
    skip: "Skip",
    next: "Next",
    back: "Back",
    start: "Start day 1",
    heroKicker: "The challenge",
    heroTitle: "75 days. Zero excuses.",
    heroBody: "A short list of rules you hit every single day, no skipping. It's not a diet: it's proving to yourself that you do what you say.",
    rulesTitle: "7 rules, every day",
    rulesBody: "A day only counts when you hit them all.",
    rules: [
      { icon: Dumbbell, title: "Indoor workout", detail: "One session of strength, cardio or your pick." },
      { icon: Bike, title: "Outdoor workout", detail: "A second session outside, different from the first." },
      { icon: Wine, title: "Diet & no alcohol", detail: "Clean food, no cheats and no alcohol." },
      { icon: BookOpen, title: "Read 10+ pages", detail: "From a non-fiction or self-development book." },
      { icon: Droplets, title: "3.8 L of water", detail: "Add it up through the day from the app." },
      { icon: UtensilsCrossed, title: "Photo of your 3 meals", detail: "Breakfast, lunch and dinner as proof." },
      { icon: Camera, title: "Progress photo", detail: "One photo a day to see your real change." },
    ],
    phasesTitle: "Three phases, one meaning",
    phasesBody: "The 75 days don't weigh the same. Each phase changes what the challenge asks of you.",
    days: "Days",
    readyTitle: "One day at a time",
    readyBody: "The app guides you and celebrates every win. All you have to do is open it and nail today.",
    lockTitle: "The next day unlocks when you finish the current one",
    lockBody: "No shortcuts: your streak is real.",
  },
};

export function Onboarding() {
  const { lang } = useI18n();
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      /* storage unavailable: skip onboarding */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function finish() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  const last = step === STEPS - 1;

  return (
    <div className="fixed inset-0 z-40 bg-bg overflow-y-auto" role="dialog" aria-modal="true" aria-label="Onboarding">
      <div className="min-h-full max-w-md mx-auto px-5 pt-5 pb-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex gap-1.5" aria-hidden>
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full bg-brass transition-all duration-500 ${
                    i <= step ? "w-full" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>
          {!last && (
            <button
              type="button"
              onClick={finish}
              className="text-xs font-semibold text-muted hover:text-ink transition px-1 py-2"
            >
              {c.skip}
            </button>
          )}
        </div>

        <div key={step} className="flex-1 flex flex-col gap-5 animate-fade-in">
          {step === 0 && (
            <>
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
                <div className="relative">
                  <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-brass/25 to-ember/20 blur-2xl" />
                  <p className="relative num font-bold leading-none text-[9rem] bg-brass bg-clip-text text-transparent">
                    {TOTAL_DAYS}
                  </p>
                </div>
                <span className="label-caps">{c.heroKicker}</span>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold text-ink leading-tight">{c.heroTitle}</h1>
                <p className="text-sm text-ink/75 leading-relaxed">{c.heroBody}</p>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-3xl font-bold text-ink leading-tight">{c.rulesTitle}</h2>
                <p className="text-sm text-muted">{c.rulesBody}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {c.rules.map(({ icon: Icon, title, detail }, i) => (
                  <li key={title} className="card-base px-3.5 py-2.5 flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-brass/15 text-brass flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-ink leading-tight">{title}</span>
                      <span className="block text-xs text-muted leading-snug">{detail}</span>
                    </span>
                    <span className="num text-xs text-border font-bold">{i + 1}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-3xl font-bold text-ink leading-tight">{c.phasesTitle}</h2>
                <p className="text-sm text-muted">{c.phasesBody}</p>
              </div>
              <ol className="flex flex-col">
                {PHASES.map((p, i) => (
                  <li key={p.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`h-9 w-9 rounded-full ${BG[p.color]} text-white num font-bold flex items-center justify-center shrink-0`}
                      >
                        {p.id}
                      </span>
                      {i < PHASES.length - 1 && <span className="flex-1 w-px bg-border my-1" />}
                    </div>
                    <div className={`flex flex-col gap-1 ${i < PHASES.length - 1 ? "pb-5" : ""}`}>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className={`text-lg font-bold ${TEXT[p.color]}`}>{p.name[lang]}</h3>
                        <span className="num text-[11px] text-muted">
                          {c.days} {p.start}–{p.end}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-ink leading-snug">{p.tagline[lang]}</p>
                      <p className="text-xs text-ink/70 leading-relaxed">{p.meaning[lang]}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex-1 flex flex-col justify-center gap-5">
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl font-bold text-ink leading-tight">{c.readyTitle}</h2>
                  <p className="text-sm text-ink/75 leading-relaxed">{c.readyBody}</p>
                </div>
                <div className="card-base p-4 flex items-start gap-3 border-brass/40">
                  <span className="h-9 w-9 rounded-full bg-brass/15 text-brass flex items-center justify-center shrink-0">
                    <Lock className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-ink leading-snug">{c.lockTitle}</p>
                    <p className="text-xs text-muted">{c.lockBody}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-muted hover:text-ink active:scale-95 transition"
            >
              {c.back}
            </button>
          )}
          <button
            type="button"
            onClick={() => (last ? finish() : setStep((s) => s + 1))}
            className="flex-1 flex items-center justify-center gap-2 bg-brass text-white font-semibold text-sm rounded-xl py-3.5 hover:brightness-105 active:scale-[0.97] transition"
          >
            {last ? c.start : c.next}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
