import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { CONTENT_LESSONS_DIR, lessonFilePath } from "@/lib/content/paths";

/** Shiki + temas Visual Studio (Light+ / Dark+) vía rehype-pretty-code. */
const lessonRehypePrettyCodeOptions = {
  theme: {
    light: "light-plus",
    dark: "dark-plus",
  },
  keepBackground: true,
  bypassInlineCode: true,
  defaultLang: {
    block: "tsx",
    inline: "ts",
  },
} satisfies RehypePrettyCodeOptions;

export type LessonLang = "es" | "en";

export type LessonFrontmatter = {
  title: string;
  description?: string;
  level?: string;
  order?: number;
};

export async function listLessonsForModule(moduleSlug: string): Promise<
  Array<{
    slug: string;
    titleEs: string;
    titleEn: string;
    order: number;
    level?: string;
  }>
> {
  const moduleDir = path.join(CONTENT_LESSONS_DIR, moduleSlug);
  let entries: string[];
  try {
    entries = await readdir(moduleDir, { withFileTypes: true }).then((d) =>
      d.filter((x) => x.isDirectory()).map((x) => x.name)
    );
  } catch {
    return [];
  }

  const rows: Array<{
    slug: string;
    titleEs: string;
    titleEn: string;
    order: number;
    level?: string;
  }> = [];

  for (const slug of entries) {
    const esPath = lessonFilePath(moduleSlug, slug, "es");
    const enPath = lessonFilePath(moduleSlug, slug, "en");
    try {
      const [esRaw, enRaw] = await Promise.all([
        readFile(esPath, "utf8"),
        readFile(enPath, "utf8"),
      ]);
      const esFm = matter(esRaw).data as LessonFrontmatter;
      const enFm = matter(enRaw).data as LessonFrontmatter;
      rows.push({
        slug,
        titleEs: esFm.title ?? slug,
        titleEn: enFm.title ?? slug,
        order: typeof esFm.order === "number" ? esFm.order : 999,
        level: esFm.level,
      });
    } catch {
      // skip incomplete lesson dirs
    }
  }

  return rows.sort((a, b) => a.order - b.order);
}

export async function loadLessonMdx(
  moduleSlug: string,
  lessonSlug: string,
  lang: LessonLang
) {
  const filePath = lessonFilePath(moduleSlug, lessonSlug, lang);
  const source = await readFile(filePath, "utf8");

  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, lessonRehypePrettyCodeOptions]],
      },
    },
  });

  return {
    content,
    frontmatter: frontmatter as LessonFrontmatter,
    filePath,
  };
}
