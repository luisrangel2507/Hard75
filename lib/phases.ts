import { Lang, TOTAL_DAYS } from "./types";

export interface Phase {
  id: 1 | 2 | 3;
  start: number;
  end: number;
  color: "brass" | "ember" | "olive";
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
  meaning: Record<Lang, string>;
}

export const PHASES: Phase[] = [
  {
    id: 1,
    start: 1,
    end: 25,
    color: "brass",
    name: { es: "Fundación", en: "Foundation" },
    tagline: { es: "Haz que el día completo no se negocie", en: "Make the full day non-negotiable" },
    meaning: {
      es: "Lo difícil es empezar. Aquí armas la rutina: horarios, comidas, agua y entrenos hasta que dejen de costar decidir.",
      en: "Starting is the hard part. You build the routine: schedules, meals, water and workouts until deciding stops costing you.",
    },
  },
  {
    id: 2,
    start: 26,
    end: 50,
    color: "ember",
    name: { es: "Resistencia", en: "Endurance" },
    tagline: { es: "Sigue cuando la motivación se va", en: "Keep going when motivation leaves" },
    meaning: {
      es: "La novedad se acaba y aparece el cansancio. Gana quien cumple sin ganas: aquí se forma el carácter.",
      en: "The novelty wears off and fatigue shows up. Whoever delivers without the mood wins: this is where character is built.",
    },
  },
  {
    id: 3,
    start: 51,
    end: 75,
    color: "olive",
    name: { es: "Dominio", en: "Mastery" },
    tagline: { es: "Sube la vara y cierra fuerte", en: "Raise the bar and finish strong" },
    meaning: {
      es: "Ya eres otra persona. Entrenas con más intención, afinas la dieta y llegas al día 75 con evidencia de todo el camino.",
      en: "You're a different person now. Train with more intent, dial in your diet and reach day 75 with proof of the whole road.",
    },
  },
];

export function getPhase(day: number): Phase {
  const d = Math.min(Math.max(day, 1), TOTAL_DAYS);
  return PHASES.find((p) => d >= p.start && d <= p.end) ?? PHASES[PHASES.length - 1];
}

export function phaseProgress(day: number): { dayInPhase: number; phaseLength: number; pct: number } {
  const p = getPhase(day);
  const phaseLength = p.end - p.start + 1;
  const dayInPhase = Math.min(Math.max(day, p.start), p.end) - p.start + 1;
  return { dayInPhase, phaseLength, pct: Math.round((dayInPhase / phaseLength) * 100) };
}
