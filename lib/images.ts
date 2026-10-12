import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export function findImage(name: string): string | null {
  for (const ext of EXTENSIONS) {
    const file = `${name}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", "images", file))) return `/images/${file}`;
  }
  return null;
}

export const TASK_IMAGE_NAMES = ["indoor", "outdoor", "reading", "diet", "water"] as const;
export type TaskImageName = (typeof TASK_IMAGE_NAMES)[number];

export function findTaskImages(): Record<TaskImageName, string | null> {
  return Object.fromEntries(TASK_IMAGE_NAMES.map((n) => [n, findImage(`task-${n}`)])) as Record<TaskImageName, string | null>;
}
