# nesstack

**Cómo construye software RTN con asistentes de IA.** Doce skills para Claude
Code (y cualquier asistente que lea archivos `SKILL.md`) que enseñan una forma
de trabajar, no un framework: recordar las reglas, demostrar lo que afirmas,
leer cada revisión, mantener los secretos fuera y dejar que los agentes de IA
actúen solo dentro de límites que sostiene el servidor.

[English](README.md)

Viene de cuatro apps en producción construidas en RTN con asistentes de IA: una
plataforma de observabilidad multi-tenant, un CRM con agentes de IA, un portal
de Wi-Fi multi-tenant y una plataforma de agentes como servicio. En este
repositorio no hay nada de su código, sus datos ni su infraestructura. Lo que
hay es el método, y los errores que le dieron forma.

## La idea en una línea

> Un comentario en el archivo de memoria no es una protección. Un check que
> rompe el build sí lo es.

Los buenos instintos primero aparecen como hábitos. Luego algo se rompe. Solo
cuando el hábito se vuelve una regla escrita, con su razón, **y** un check que
falla sin ella, se vuelve confiable. Cada skill aquí es uno de esos ciclos.

## Las skills

Apréndelas más o menos en este orden.

| # | Skill | Qué enseña |
|---|---|---|
| 1 | [`project-memory`](docs/es/skills/project-memory.md) | El archivo de memoria (CLAUDE.md): reglas cortas con su razón, decisiones con fecha, lo que nunca va en él |
| 2 | [`pr-as-evidence`](docs/es/skills/pr-as-evidence.md) | Una fase, un PR; el PR demuestra lo que afirma; el rollout se decide antes del código |
| 3 | [`review-before-merge`](docs/es/skills/review-before-merge.md) | Leer comentarios, reviews e hilos justo antes del merge; responder cada hallazgo según sus méritos |
| 4 | [`prove-it-fails`](docs/es/skills/prove-it-fails.md) | Quita la protección y mira cómo falla la prueba; prueba contra el sistema real |
| 5 | [`green-means-ran`](docs/es/skills/green-means-ran.md) | Cada suite en CI, los skips fallan en CI, "¿por qué estaba verde la suite?" |
| 6 | [`mistake-to-guard`](docs/es/skills/mistake-to-guard.md) | Cada bug deja una regla y un check que lo habría atrapado |
| 7 | [`secrets-and-fake-data`](docs/es/skills/secrets-and-fake-data.md) | Solo gestor de secretos, lo que los escáneres no ven, datos ficticios, el registro de riesgos |
| 8 | [`honest-failures`](docs/es/skills/honest-failures.md) | Fallar cerrado; "no pude revisar" no es "no hay nada" |
| 9 | [`measure-first`](docs/es/skills/measure-first.md) | Sondear el sistema real; instrumentos que mienten; números con fecha |
| 10 | [`narrow-agents`](docs/es/skills/narrow-agents.md) | Agentes de IA con un solo trabajo, una meta en lugar de pasos, límites en el servidor |
| 11 | [`eval-ai-features`](docs/es/skills/eval-ai-features.md) | Evals calificadas por acciones, corridas repetidas, los modelos entran por revisión |
| 12 | [`legacy-ratchet`](docs/es/skills/legacy-ratchet.md) | Código nuevo estricto, deuda que nunca crece, dependencias fijadas |

Cada skill tiene también una versión en español para leer en
[`docs/es/skills/`](docs/es/skills/). El asistente usa el `SKILL.md` en inglés
y te responde en el idioma en que le escribas.

## Instalación

En Claude Code:

```bash
/plugin marketplace add rtncorp/nesstack
```

```bash
/plugin install nesstack@nesstack
```

Las skills se cargan solas cuando una tarea las necesita (abrir un PR, corregir
un bug, agregar una prueba, construir un agente). También puedes pedir una por
nombre: "usa la skill review-before-merge en este PR".

Sin el sistema de plugins, copia cualquier carpeta
`plugins/nesstack/skills/<name>/` al `.claude/skills/` de tu proyecto.

## Las skills y tu CLAUDE.md trabajan juntos

- **El archivo de memoria de tu proyecto** guarda los hechos de ese proyecto:
  sus invariantes, sus decisiones, su mapa, sus trampas. Se carga en cada
  turno.
- **Estas skills** guardan el método, el mismo para todos los proyectos. Se
  cargan solo cuando la tarea las necesita.

Deja las reglas que deben aplicar en cada turno (quién hace merge, nada de
secretos, solo datos ficticios) como una línea cada una en tu archivo de
memoria, aunque una skill las explique a fondo: una skill se carga cuando el
modelo juzga que es relevante, y una regla de seguridad no puede depender de
eso.

## Para quién es

Para quienes empiezan a construir software real con un asistente de IA,
"vibe coding" incluido, y quieren la velocidad sin sacar a producción lo que
nadie revisó. Nada de esto requiere un equipo grande: requiere el hábito de
pedir pruebas.

## Cómo contribuir

Un cambio, un PR, con la razón. Una regla nueva dice de qué error viene. Los
ejemplos usan nombres ficticios y los rangos de documentación para direcciones
(`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`, `00:00:5E:00:53:xx`).
CI rechaza cualquier otra cosa (`scripts/check-no-leaks.mjs`).

## Licencia

MIT. Consulta [LICENSE](LICENSE).
