"use client";

import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Stack } from "@/components/Stack";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="has-anim">
        <Experience />
        <Education />
        <Projects />
        <Stack />
      </main>
      <Contact />
    </>
  );
}
