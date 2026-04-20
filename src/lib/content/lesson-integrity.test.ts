import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { CONTENT_LESSONS_DIR, lessonFilePath } from "@/lib/content/paths";
import { LEARN_MODULES } from "@/lib/learn/modules";

const LEVELS = new Set(["junior", "mid", "senior"]);

describe("lesson MDX integrity", () => {
  it("each lesson folder has ES/EN MDX with aligned frontmatter", async () => {
    for (const mod of LEARN_MODULES) {
      const modDir = path.join(CONTENT_LESSONS_DIR, mod.slug);
      const entries = await readdir(modDir, { withFileTypes: true });
      for (const ent of entries) {
        if (!ent.isDirectory()) continue;
        const slug = ent.name;
        const esRaw = await readFile(
          lessonFilePath(mod.slug, slug, "es"),
          "utf8",
        );
        const enRaw = await readFile(
          lessonFilePath(mod.slug, slug, "en"),
          "utf8",
        );
        const es = matter(esRaw).data as Record<string, unknown>;
        const en = matter(enRaw).data as Record<string, unknown>;

        expect(typeof es.title).toBe("string");
        expect((es.title as string).trim().length).toBeGreaterThan(0);
        expect(typeof en.title).toBe("string");
        expect((en.title as string).trim().length).toBeGreaterThan(0);

        expect(typeof es.description).toBe("string");
        expect((es.description as string).trim().length).toBeGreaterThan(0);
        expect(typeof en.description).toBe("string");
        expect((en.description as string).trim().length).toBeGreaterThan(0);

        expect(typeof es.level).toBe("string");
        expect(LEVELS.has(es.level as string)).toBe(true);
        expect(en.level).toBe(es.level);

        expect(typeof es.order).toBe("number");
        expect(Number.isFinite(es.order)).toBe(true);
        expect(en.order).toBe(es.order);

        expect(esRaw.length).toBeGreaterThan(50);
        expect(enRaw.length).toBeGreaterThan(50);
      }
    }
  });
});
