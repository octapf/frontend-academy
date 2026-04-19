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
| `NEXT_PUBLIC_APP_URL` | URL canónica (metadata / Open Graph). Prod.: `https://frontendacademy.miralab.ar`. |

Copiá `.env.example` a `.env.local` y completá valores. En Vercel u otro host, configurá las mismas keys en el panel del proyecto.

En rutas **Learn**, si la preferencia guardada es inglés y la URL no incluye `?lang=en`, el cliente normaliza la query automáticamente (`LearnLangUrlSync`).

## Open Graph / Twitter Card

- En build, Next genera **`/opengraph-image`** y **`/twitter-image`** (1200×630, PNG) a partir de `src/lib/og/brand-og.tsx`.
- Los meta tags se inyectan solos; la URL absoluta usa **`NEXT_PUBLIC_APP_URL`** (ver `layout.tsx`).

## Despliegue (Vercel + GitHub)

### En Vercel (esto despliega la app)

1. **Importar el repo** desde GitHub (como ya hiciste): cada **push a `main`** dispara un deploy automático.
2. **Settings → Environment Variables** (Production): cargá lo de **`.env.example`** que uses en prod, como mínimo:
   - **`AUTH_SECRET`** (obligatorio para sesiones en producción).
   - **`NEXT_PUBLIC_APP_URL`** = `https://frontendacademy.miralab.ar` (sin barra final).
   - **`MONGODB_URI`** si usás Mongo; si no, queda JSON en el filesystem (en serverless conviene Mongo).
3. Tras cambiar variables: **Deployments → … → Redeploy** (o un push vacío).

### En GitHub (no hace falta secretos para deploy)

- **No necesitás** la pantalla *Actions secrets / New secret* para publicar en Vercel: el deploy lo hace la **integración Git de Vercel**.
- **Actions** solo corre **CI** (lint, test, build) en push/PR a `main`: sirve para ver que todo pase en verde; podés ignorar *Secrets* salvo que más adelante agregues otro workflow que sí los use.

### Dominio `frontendacademy.miralab.ar` (Vercel + DNS)

1. **Vercel** → proyecto **frontend-academy** → **Settings → Domains** → **Add** → escribí exactamente:
   - `frontendacademy.miralab.ar`  
   Vercel va a mostrar el registro DNS que espera (suele ser un **CNAME**).

2. **DNS del dominio `miralab.ar`** (donde gestionés las zonas: Cloudflare, DonWeb, NIC, etc.):
   - Tipo: **CNAME**
   - **Nombre / host:** `frontendacademy` (a veces la UI pide solo el subdominio, sin `.miralab.ar`).
   - **Valor / destino:** el que indique Vercel, habitualmente **`cname.vercel-dns.com.`** (con o sin punto final según el proveedor).
   - Si usás **Cloudflare** con proxy naranja, para el certificado SSL a veces hace falta dejar **DNS only** (nube gris) hasta que Vercel marque el dominio como válido; después podés volver a proxy si querés.

3. Esperá propagación DNS (minutos a unas horas). En Vercel el dominio pasa a **Valid** cuando resuelve bien.

4. En **Environment Variables** dejá **`NEXT_PUBLIC_APP_URL=https://frontendacademy.miralab.ar`** y redeploy.

5. **Producción:** en Vercel podés marcar `frontendacademy.miralab.ar` como **Primary** y dejar el `*.vercel.app` como redirect o secundario (**Settings → Domains**).

## Estructura útil

- `src/app/(app)/learn/` — rutas Learn y lecciones.
- `src/lib/learn/lesson-code-exercises.ts` — registro de lecciones con bloque “ejercicio de código” enlazado.
- `src/lib/i18n/learn-lang.ts` — helpers de `lang` en URLs.
- `src/components/learn/LearnLangUrlSync.tsx` — alinear `?lang=en` con la preferencia en Learn.
- `content/` — lecciones MDX por módulo e idioma.
