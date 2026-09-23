export interface ChallengeDay {
  id: number;
  day_number: number;
  indoor_workout: boolean;
  indoor_type: string | null;
  indoor_type_custom: string | null;
  outdoor_workout: boolean;
  outdoor_type: string | null;
  outdoor_type_custom: string | null;
  diet: boolean;
  calories: number | null;
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
export const WORKOUT_TIMER_SECONDS = 45 * 60;
export const ACHIEVEMENT_DAYS = [7, 25, 50, 75] as const;

export const INDOOR_TYPES = ["strength", "cardio", "hiit", "yoga", "pilates", "other"] as const;
export const OUTDOOR_TYPES = ["running", "walking", "cycling", "soccer", "swimming", "other"] as const;
export type IndoorType = (typeof INDOOR_TYPES)[number];
export type OutdoorType = (typeof OUTDOOR_TYPES)[number];

export interface Book {
  id: string;
  title: string;
  author: string | null;
  total_pages: number | null;
  current_page: number;
  cover_url: string | null;
  status: "reading" | "finished";
  created_at: string;
}

export interface Quote {
  id: string;
  book_id: string;
  text: string;
  page: number | null;
  created_at: string;
}

export function defaultDay(dayNumber: number): ChallengeDay {
  return {
    id: 0,
    day_number: dayNumber,
    indoor_workout: false,
    indoor_type: null,
    indoor_type_custom: null,
    outdoor_workout: false,
    outdoor_type: null,
    outdoor_type_custom: null,
    diet: false,
    calories: null,
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
