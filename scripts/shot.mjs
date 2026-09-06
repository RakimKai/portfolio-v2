import { mkdir, rm } from "node:fs/promises";
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const BASE = args.base ?? "http://localhost:3000";
const OUT = ".screenshots";

const PAGES = [
  { name: "home", url: "/" },
  { name: "gdje-ides", url: "/projects/gdje-ides" },
  { name: "stagledas", url: "/projects/stagledas" },
  { name: "worknet", url: "/projects/worknet" },
  { name: "kimbo", url: "/projects/kimbo" },
];

const SIZES = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 375, height: 812 },
];

const targets = args.url
  ? [{ name: args.url.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "root", url: args.url }]
  : args.only
    ? PAGES.filter((page) => page.name === args.only)
    : PAGES;

const sizes = args.width
  ? SIZES.filter((size) => String(size.width) === args.width)
  : SIZES;

const grounds = args.ground ? [args.ground] : ["ink", "paper"];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const written = [];

for (const size of sizes) {
  for (const ground of grounds) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 2,
      reducedMotion: args.motion ? "no-preference" : "reduce",
    });

    await context.addInitScript((value) => {
      try {
        window.localStorage.setItem("ground", value);
      } catch {}
    }, ground);

    const page = await context.newPage();

    for (const target of targets) {
      await page.goto(`${BASE}${target.url}`, {
        waitUntil: args.motion ? "commit" : "networkidle",
      });
      if (args.delay) await page.waitForTimeout(Number(args.delay));
      else await page.evaluate(() => document.fonts.ready);
      if (args.scroll) {
        await page.evaluate((y) => window.scrollTo(0, Number(y)), args.scroll);
        await page.waitForTimeout(250);
      }
      const file = `${OUT}/${target.name}-${size.name}-${ground}.png`;
      await page.screenshot({ path: file, fullPage: Boolean(args.full) });
      written.push(file);
    }

    await context.close();
  }
}

await browser.close();
console.log(written.join("\n"));
