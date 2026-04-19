# Frontend Academy

App Next.js (App Router) con lecciones MDX, ejercicios TypeScript con validación en servidor, auth por cookie y progreso persistido (JSON local o MongoDB).

## Requisitos

- Node.js 20+
- `npm ci`

## Scripts

| Comando        | Descripción                |
| -------------- | -------------------------- |
| `npm run dev`  | Servidor de desarrollo     |
| `npm run lint` | ESLint                     |
| `npm test`     | Jest                       |
| `npm run build`| Build de producción        |

## Learn e idioma (ES/EN)

- El contenido de lecciones depende del query **`?lang=en`**. Sin param, el idioma por defecto es **español**.
- En rutas bajo **`/learn`**, el conmutador **ES / EN** está en la barra superior; actualiza la URL y la preferencia guardada en el navegador (`localStorage` vía Zustand) para enlaces como “Learn” en el sidebar, chips del dashboard o “Volver a Learn” en referencia.
- Compartir una URL con `?lang=en` carga la lección en inglés y sincroniza la preferencia a inglés cuando corresponde.

## Variables de entorno

| Variable | Uso |
| -------- | --- |
| `AUTH_SECRET` | Firma de JWT (obligatorio en producción). |
| `MONGODB_URI` | Si está definida: usuarios y progreso en MongoDB; si no, archivos JSON bajo `data/`. |
| `MONGODB_DB`, `MONGODB_PROGRESS_COLLECTION`, `MONGODB_USERS_COLLECTION`, … | Opcionales; ver código en `src/lib/auth/` y `src/lib/progress/`. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limit distribuido para ejecutar ejercicios; sin ellos, límite en memoria por proceso. |
| `EXERCISE_RUN_RATE_LIMIT_PER_MIN` | Opcional; tope de ejecuciones por minuto (ver `src/lib/rate-limit/exercise-config.ts`). |
| `NEXT_PUBLIC_APP_URL` | URL canónica del sitio (metadata / Open Graph). Ej.: `https://tu-app.vercel.app`. |

Copiá `.env.example` a `.env.local` y completá valores. En Vercel u otro host, configurá las mismas keys en el panel del proyecto.

En rutas **Learn**, si la preferencia guardada es inglés y la URL no incluye `?lang=en`, el cliente normaliza la query automáticamente (`LearnLangUrlSync`).

## Open Graph / Twitter Card

- En build, Next genera **`/opengraph-image`** y **`/twitter-image`** (1200×630, PNG) a partir de `src/lib/og/brand-og.tsx`.
- Los meta tags se inyectan solos; la URL absoluta usa **`NEXT_PUBLIC_APP_URL`** (ver `layout.tsx`).

## Despliegue

1. Conectá el repositorio a [Vercel](https://vercel.com) (o build con `npm run build` + `npm start` en Node).
2. Definí las variables de entorno anteriores en el entorno de producción.
3. El workflow **CI** (`.github/workflows/ci.yml`) ejecuta lint, tests y build en cada push y PR a `main`.

## Estructura útil

- `src/app/(app)/learn/` — rutas Learn y lecciones.
- `src/lib/learn/lesson-code-exercises.ts` — registro de lecciones con bloque “ejercicio de código” enlazado.
- `src/lib/i18n/learn-lang.ts` — helpers de `lang` en URLs.
- `src/components/learn/LearnLangUrlSync.tsx` — alinear `?lang=en` con la preferencia en Learn.
- `content/` — lecciones MDX por módulo e idioma.
