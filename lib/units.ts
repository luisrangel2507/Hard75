export type UnitSystem = "metric" | "imperial";

const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

export function kgToLbs(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_IN;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_IN;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cmToInches(cm));
  return { feet: Math.floor(totalInches / 12), inches: totalInches % 12 };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm(feet * 12 + inches);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
