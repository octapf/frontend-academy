import { LearnEntryLink } from "@/components/learn/LearnEntryLink";
import { SlangInfoCard } from "@/components/reference/SlangInfoCard";
import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";

export default async function SlangPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = parseLearnLang(sp.lang);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(lang, { es: "Jerga (ES/EN)", en: "Slang (ES/EN)" })}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Jerga de equipos. Filtrado por track.",
            en: "Team slang. Filtered by track.",
          })}
        </p>
      </div>

      <SlangInfoCard />

      <div>
        <LearnEntryLink
          href="/learn"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          {t(lang, { es: "Volver a Aprender", en: "Back to Learn" })}
        </LearnEntryLink>
      </div>
    </div>
  );
}

