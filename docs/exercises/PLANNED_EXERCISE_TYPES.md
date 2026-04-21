# Tipos de ejercicios planificados (backlog)

Este documento resume **los tipos de ejercicios** que acordamos/planeamos para Frontend Academy.
No es implementación: es **inventario + estructura** para que el backlog sea explícito y no quede “en la charla”.

## 1) Matching (concepto ↔ definición / ejemplo ↔ resultado)

### Qué es
El usuario empareja elementos en dos columnas (o arrastrando) hasta completar el set.

### Variantes
- **Concepto ↔ definición** (glossary)
- **ES ↔ EN** (slang)
- **Snippet ↔ output**
- **Caso ↔ error / fix**

### Estado actual
- Ya existe (Reference): `GlossaryPracticeCard`, `SlangPracticeCard`.

### Extensión planificada
- Matching por **módulo** (no solo reference): React/Next/Testing/HTTP.
- Sets “por track” y “por tema”.

---

## 2) Multiple choice (quiz)

### Qué es
Pregunta con 4–6 opciones; una o varias correctas; feedback inmediato (por qué).

### Variantes
- **Single-choice** (una correcta)
- **Multi-select** (varias correctas)
- **Ordenar pasos** (ranking)

### Evaluación
- Local (sin servidor) para preguntas estáticas.
- O server-side si querés métricas antifraude / límites / persistencia estricta.

### Datos mínimos
- `id`
- `question` (ES/EN)
- `choices[]` (ES/EN)
- `correct` (índices o ids)
- `explanation` (ES/EN)
- `tags` (módulo, track, dificultad)

---

## 3) Completado de código (fill-in-the-blank)

### Qué es
Te damos un snippet con “huecos” (tokens) y el usuario completa.

### Variantes
- Huecos de **expresión** (`return ___`)
- Huecos de **tipo** (`type X = ___`)
- Huecos de **API** (`fetch(url, { ___ })`)

### Evaluación
- Puede ser server-tested (como los TS actuales) si el resultado final es código ejecutable.
- O validación local por regex/AST si el objetivo es sintáctico.

---

## 4) Encontrar el error (spot the bug)

### Qué es
Snippet con un bug realista; el usuario selecciona el problema o propone el fix.

### Variantes
- Elegir la **línea** o el **tipo de bug** (multiple choice)
- Escribir el **fix** (edición de código)
- Explicar el **riesgo** / **edge case** (respuesta corta)

### Evaluación
- “Fix” puede validarse con tests server-side (ideal).
- “Identificar” puede ser quiz con explicación.

---

## 5) Refactor guiado (mejorar sin romper)

### Qué es
Te damos código que funciona pero es frágil; objetivo: mejorar legibilidad/contrato/perf.

### Evaluación
- Tests + restricciones (p. ej. “no cambies la API pública”).

---

## 6) Diseño / arquitectura (decisión)

### Qué es
Escenario + constraints; el usuario elige un enfoque y justifica trade-offs.

### Evaluación
- Quiz con explicación (para “enfoque correcto” según constraints).
- O rubric simple (autoevaluación) si no hay “una respuesta”.

---

## 7) Debugging (diagnóstico)

### Qué es
Te damos logs/red/stack trace y el usuario elige hipótesis/acción siguiente.

### Variantes
- “Qué mirar en DevTools primero”
- “Qué header está mal”
- “Por qué este render se repite”

---

## 8) Ejercicios de código server-tested (los existentes)

### Qué es
Editor + “Run tests”; servidor compila/ejecuta y devuelve resultado.

### Estado actual
- Tipo `TsExercise` (`src/exercises/types.ts`)
- Runner API: `POST /api/exercises/run`

---

## Propuesta de “kinds” (para implementación)

Si queremos unificar, estos `kind` cubren lo planificado:
- `typescript` (server-tested)
- `matching`
- `multipleChoice`
- `fillBlank`
- `spotBug`
- `refactor`
- `debugScenario`
- `architectureDecision`

Cada kind tendría:
- `title` (ES/EN)
- `description` (ES/EN)
- `minTrack` / `level`
- `moduleSlug` (opcional, para ubicarlo en un módulo)

