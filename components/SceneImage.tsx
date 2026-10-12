import { findImage } from "@/lib/images";
import { MountainScene } from "@/components/MountainScene";

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
