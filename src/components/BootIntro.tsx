import { Cat } from "./Cat";

export function BootIntro() {
  return (
    <div className="relative h-full w-full bg-black">
      <Cat
        className="boot-mark absolute bottom-0 left-0 h-[clamp(72px,16vw,140px)] w-auto text-[var(--ink)]"
        style={{ transform: "translateX(-97%)" }}
      />
    </div>
  );
}
