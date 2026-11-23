# Memoria del proyecto

> Skill: `project-memory` · [English](../../../plugins/nesstack/skills/project-memory/SKILL.md)

Escribe y mantiene el archivo de memoria del proyecto para un asistente de IA
de programación (CLAUDE.md o AGENTS.md): reglas cortas con su razón,
invariantes del producto, decisiones con fecha y lo que nunca debe ir en él.
Úsala al empezar un proyecto con un asistente de IA, cuando el usuario diga
"recuerda esto" o "guárdalo en memoria", cuando se tome una decisión en el chat
o cuando el archivo de memoria esté creciendo demasiado.

Un asistente de IA olvida todo entre sesiones. El archivo de memoria es lo
único que lee cada vez, así que ahí vive tu forma de trabajar: las reglas, las
decisiones y las trampas. Trátalo como código: revisado, versionado y corto.

## Qué va en él

1. **Reglas que siempre aplican.** Numeradas, en imperativo, de una o dos
   líneas cada una. Quién aprueba los merges, en qué idioma se escribe el
   repositorio, dónde viven los secretos, cómo se corren el build y las
   pruebas.
2. **Invariantes del producto.** Lo que debe cumplirse sea cual sea la función
   ("cada tabla lleva el tenant id", "un agente nunca envía sin un check en el
   servidor"). Son las líneas que ningún PR puede cruzar.
3. **Guías cortas para las áreas riesgosas.** "Antes de tocar la base de
   datos", "antes de agregar una ruta", "antes de cambiar lo que la IA puede
   hacer". Una checklist, no un ensayo.
4. **Decisiones registradas**, con fecha, con quién decidió y por qué (ve
   abajo).
5. **Un mapa del código**: qué carpeta tiene qué, y qué documento lo explica.

## Cada regla lleva su razón

Una regla sin razón se rompe la primera vez que estorba, ya sea una persona o
el asistente. Escribe el incidente que la originó:

```markdown
- Haz rebase sobre main justo antes de cada push al archivo de rutas compartido.
  Un PR cortado de una base vieja lo sobrescribió y revirtió en silencio tres
  fixes ya mergeados (PR #NNN). Lo hace cumplir `lint/no-clobbered-symbols`.
```

La forma es **regla → por qué (incidente, PR, números) → qué la hace
cumplir**. Si todavía nada la hace cumplir, dilo; esa es la siguiente
protección por construir (ve `mistake-to-guard`).

## Decisiones registradas

```markdown
## Decisiones registradas (2026-03-14, retención)

- El audit log se guarda 90 días (owner). Cinco años era demasiado para lo
  que se usa.
- Abierto: si un job corregido cuenta una vez o dos. Propuesto, sin respuesta.
```

- Fecha y tema en el encabezado, quién decidió entre paréntesis, y sus propias
  palabras cuando importan.
- **Las preguntas abiertas se escriben como abiertas.** "Propuesto, sin
  respuesta" evita que el asistente tome una suposición como decisión.
- Cuando una decisión cambia, conserva la línea vieja y apunta hacia adelante:
  "(reemplazada el 2026-03-20, ve ese día)". La historia del porqué vale más
  que un archivo ordenado.

## Lo que nunca va en él

- **Nunca credenciales.** Ni "solo para el lab". Los escáneres de secretos
  atrapan formas `key=value` y no ven una contraseña suelta dentro de una
  oración, así que esta regla se cumple al escribir la línea o no se cumple.
- **Nada de datos personales** de personas reales.
- **Recuerda que el archivo se envía al proveedor de la IA** en cada corrida.
  Todo lo que contiene sale de tu red. Los nombres de clientes, los hosts
  internos y las direcciones van en tu gestor de secretos o en tus runbooks
  privados, no aquí.

## Mantenlo corto

Un archivo de memoria que se vuelve diario de incidentes deja de leerse, por
las personas y por el modelo. Cuando una sección pasa de una pantalla:

- deja la regla y una línea del porqué en el archivo de memoria;
- mueve la historia completa a un runbook o a un ADR y enlázala.

## Cómo trabajar con él

- Cuando el usuario diga "recuerda esto", escríbelo en el archivo en el mismo
  turno, en la sección correcta, con la fecha, y muestra el diff.
- Cuando se tome una decisión en el chat, propón la entrada; no esperes a que
  te la pidan.
- Antes de actuar sobre una línea vieja ("verificado como abierto el
  <fecha>"), revisa el código. Una nota vale lo que vale su fecha.
- El archivo de memoria cambia en el mismo PR que el código que describe.

## Plantilla inicial

```markdown
# Memoria del proyecto

<Un párrafo: qué es esto, de quién es, quién aprueba los cambios.>

## Reglas que siempre aplican
1. Una fase, un PR. Nada se mergea sin el "merge" explícito del owner,
   y solo con CI en verde.
2. Nunca un secreto en el código, el chat, los logs, los PRs ni este archivo.
3. Solo datos ficticios en pruebas, demos y capturas de pantalla.
4. Una protección se demuestra con una prueba que falla sin ella.
5. Build antes del typecheck, typecheck antes de las pruebas: `<command>`.

## Invariantes
- ...

## Antes de tocar <área riesgosa>
- ...

## Decisiones registradas (YYYY-MM-DD)
- ...

## Estructura
- `apps/` ...
```
