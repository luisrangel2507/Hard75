import fs from "node:fs";
import path from "node:path";
import { MountainScene } from "@/components/MountainScene";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function findImage(name: string): string | null {
  for (const ext of EXTENSIONS) {
    const file = `${name}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", "images", file))) return `/images/${file}`;
  }
  return null;
}

export function SceneImage({
  name,
  variant,
  position = "center",
}: {
  name: string;
  variant: "hero" | "climb";
  position?: string;
}) {
  const src = findImage(name);
  if (!src) return <MountainScene variant={variant} className="absolute inset-0 h-full w-full" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
  );
}
