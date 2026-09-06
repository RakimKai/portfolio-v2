import { stackGroups } from "@/content/site";
import { Reveal, SectionRule } from "./Reveal";

/** Four columns that say where each thing sits, rather than one flat list. */
export function Stack() {
  return (
    <section id="stack" className="section">
      <SectionRule />
      <div className="wrap">
        <Reveal as="h2" className="label rail">
          /stack
        </Reveal>

        <div className="col grid grid-cols-2 gap-x-6 gap-y-[clamp(22px,3vw,32px)] md:grid-cols-4 md:gap-[clamp(24px,3vw,40px)]">
          {stackGroups.map((group, index) => (
            <Reveal key={group.label} delay={index} className="grid content-start gap-2">
              <h3 className="label border-t-2 border-[var(--accent)] pt-[9px]">{group.label}</h3>
              <ul className="m-0 grid list-none gap-[3px] p-0">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="font-display text-[clamp(1.0625rem,2.6vw,1.25rem)] font-medium leading-[1.35] tracking-[-0.01em]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
