export interface ChallengeDay {
  id: number;
  day_number: number;
  indoor_workout: boolean;
  outdoor_workout: boolean;
  diet: boolean;
  book: boolean;
  water_ml: number;
  weight_kg: number | null;
  notes: string;
  progress_photo_url: string | null;
  breakfast_photo_url: string | null;
  lunch_photo_url: string | null;
  dinner_photo_url: string | null;
  updated_at: string;
}

export type PhotoSlotKey =
  | "progress_photo_url"
  | "breakfast_photo_url"
  | "lunch_photo_url"
  | "dinner_photo_url";

export type Lang = "es" | "en";

export const TOTAL_DAYS = 75;
export const WATER_GOAL_ML = 3800;

export function defaultDay(dayNumber: number): ChallengeDay {
  return {
    id: 0,
    day_number: dayNumber,
    indoor_workout: false,
    outdoor_workout: false,
    diet: false,
    book: false,
    water_ml: 0,
    weight_kg: null,
    notes: "",
    progress_photo_url: null,
    breakfast_photo_url: null,
    lunch_photo_url: null,
    dinner_photo_url: null,
    updated_at: new Date(0).toISOString(),
  };
}
