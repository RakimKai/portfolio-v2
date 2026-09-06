import { education } from "@/content/site";
import { Reveal, SectionRule } from "./Reveal";

export function Education() {
  return (
    <section id="education" className="section">
      <SectionRule />
      <div className="wrap">
        <Reveal as="h2" className="label rail">
          /education
        </Reveal>

        <div className="col grid max-w-[62ch] gap-3.5">
          <Reveal as="h3" className="text-[length:var(--d3)] leading-[0.98] tracking-[-0.02em]">
            {education.degree}
          </Reveal>
          <Reveal delay={1} className="flex flex-wrap gap-x-[22px] gap-y-1.5 border-t border-[var(--rule)] pt-[11px]">
            <p className="label">{education.school}</p>
            <p className="label">{education.period}</p>
          </Reveal>
          <Reveal delay={2} as="p" className="font-light">
            {education.note}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
