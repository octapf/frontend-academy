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

### Opción A — GitHub Actions → Vercel (tras cada push a `main`)

1. En [Vercel](https://vercel.com): creá el proyecto (import desde GitHub o vacío) y **una vez** linkeá el repo si hace falta.
2. Obtené en el proyecto **Settings → General**:
   - **Project ID** → secreto `VERCEL_PROJECT_ID`
   - **Team ID** (también llamado *Organization ID* / `team_…`) → secreto `VERCEL_ORG_ID` (misma pantalla, arriba del Project ID en proyectos recientes).
3. En [Tokens](https://vercel.com/account/tokens) creá un token → secreto **`VERCEL_TOKEN`**.
4. En GitHub: **repo → Settings → Secrets and variables → Actions** → *New repository secret* y cargá los tres.

El workflow **`.github/workflows/ci.yml`** corre lint, tests y build en **push y PR** a `main`. Si todo pasa y el evento es **push** a `main`, el job **`deploy-vercel`** ejecuta **`vercel deploy --prod`** (el build corre en la infra de Vercel).

> Si los secretos no están definidos, el job de deploy fallará hasta configurarlos. Los PR no despliegan producción.

### Opción B — Solo integración Git de Vercel

Conectá el repo en el dashboard de Vercel y desactivá o borrá el job `deploy-vercel` si preferís que **Vercel** construya y despliegue solo con su integración (sin duplicar deploy con Actions).

### Variables en Vercel

Definí en el proyecto de Vercel (**Settings → Environment Variables**) las mismas keys que en `.env.example` para **Production** (`AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `MONGODB_URI`, etc.).

## Estructura útil

- `src/app/(app)/learn/` — rutas Learn y lecciones.
- `src/lib/learn/lesson-code-exercises.ts` — registro de lecciones con bloque “ejercicio de código” enlazado.
- `src/lib/i18n/learn-lang.ts` — helpers de `lang` en URLs.
- `src/components/learn/LearnLangUrlSync.tsx` — alinear `?lang=en` con la preferencia en Learn.
- `content/` — lecciones MDX por módulo e idioma.
