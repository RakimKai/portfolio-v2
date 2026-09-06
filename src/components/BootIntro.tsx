import { Cat } from "./Cat";

/**
 * The black curtain the cat drags off the screen. The cat stands entirely on
 * the revealed side with its nose against the black, so it reads as pushing
 * the curtain along rather than trailing it. It takes the page's own ink
 * colour, since the page is what it is standing on.
 */
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
