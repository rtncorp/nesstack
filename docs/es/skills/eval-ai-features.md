# Evalúa las funciones de IA

> Skill: `eval-ai-features` · [English](../../../plugins/nesstack/skills/eval-ai-features/SKILL.md)

Evalúa las funciones y los modelos de IA con el mismo cuidado que el código:
calificados por acciones, no por redacción, casos ficticios con una razón cada
uno, dev y holdout separados, corridas repetidas antes de creer en una
diferencia, casos de inyección, un harness depurado y una lista revisada de
modelos permitidos. Úsala al elegir o cambiar un modelo, al cambiar un prompt o
una herramienta, al construir un set de evals, al comparar dos corridas o al
afirmar que una función de IA "funciona".

"Lo probé y funcionó" es una sola observación. Un cambio de modelo, de prompt o
de herramienta es un cambio de código y lleva su propia prueba.

## El set de evals

- **Casos escritos a mano con empresas y personas ficticias.** Nunca datos de
  un cliente. El README lo dice en su primera línea.
- **Cada caso tiene un `why`**: qué protege, qué falla reproduce.
- **Califica acciones, no redacción.** ¿Llamó a la herramienta correcta con los
  valores correctos? ¿Preguntó antes de escribir? ¿Se negó a reenviar los
  documentos? La redacción cambia en cada corrida; las acciones son lo que
  importa.
- **Primero calificadores deterministas**: herramientas usadas, valores
  pasados, idioma de la respuesta, números en la respuesta que también aparecen
  en los resultados de las herramientas ("números respaldados"). Marca cada
  check como duro o suave.
- **Incluye casos de inyección** (un correo o una página que le dice al agente
  que haga otra cosa) y repítelos varias veces: una sola pasada demuestra poco.
- Un caso puede describir un comportamiento deseado que hoy falla. Márcalo,
  consérvalo.

## Cómo correrlo

- **Cada corrida cuesta dinero.** Dilo en el README, y da un comando de smoke
  test que corra un solo caso antes del set completo.
- **Guarda las corridas crudas** y vuelve a calificarlas cuando cambie el
  calificador, sin volver a gastar.
- **Compara baseline y candidato caso por caso** (corregido / con regresión /
  sin cambio), no por un solo total.
- **Corre cada lado dos o tres veces antes de creer en una diferencia.** Una
  corrida de dieciséis situaciones son dieciséis observaciones, no una tasa.
- **Mantén separados dev y holdout.** Cuando ajustaste algo sobre un caso, di
  que la mejora en ese caso está en parte ajustada a él.

## Depura también el harness

Lee las transcripciones línea por línea. Una revisión real encontró que tres de
dieciséis situaciones "medían más este harness que el modelo": una herramienta
faltante, una instrucción ambigua, un calificador que aceptaba la respuesta
incorrecta. Una aserción que acepta la respuesta incorrecta es peor que no
tener ninguna: la certifica.

## Los modelos entran por revisión

- Mantén una **lista de modelos permitidos en el código**; el servidor rechaza
  cualquier otro.
- Un modelo entra a la lista **por un PR revisado, después de que se corrió la
  eval sobre él**, con los resultados por escrito. Una corrida de cada uno no
  es una tasa: dilo.
- Haz que el modelo sea un ajuste por agente, para que se pueda probar otro en
  uso sin un cambio de código, y registra cada cambio en el log.
- Registra el costo por job (tokens de entrada y de salida), no solo la
  precisión. Los agentes que trabajan durante días cargan toda la historia en
  cada llamada; cachear lo que se repite es el primer ahorro.

## En el PR

Qué se corrió, cuántas veces, la tabla por caso, el costo, y lo que **no** se
corrió.
