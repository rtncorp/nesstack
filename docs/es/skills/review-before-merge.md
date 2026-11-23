# Revisa antes del merge

> Skill: `review-before-merge` · [English](../../../plugins/nesstack/skills/review-before-merge/SKILL.md)

Antes de hacer merge de cualquier PR, lee todos los lugares donde puede caer
una revisión (comentarios del PR, reviews e hilos de revisión en línea),
responde cada hallazgo según sus méritos, usa más de un revisor y detente si
algo queda sin respuesta. También cómo pedirle a un asistente de IA que
corrija hallazgos de revisión de forma segura. Úsala antes de un merge, cuando
un bot de revisión o una persona publica hallazgos, cuando dos revisores no
están de acuerdo o al escribir una solicitud de corrección en un PR.

El error más repetido en todos nuestros proyectos: **hacer merge con CI en
verde mientras seguían abiertos hallazgos de revisión.** Un PR se mergeó un
minuto después de que un revisor publicara dos hallazgos. Otro se mergeó tres
minutos antes de que llegara el hallazgo de severidad alta del revisor. Otro
entró con cuatro hallazgos sin leer, uno de ellos le daba a cualquier rama las
credenciales de deploy. Cada uno necesitó un PR de seguimiento, y un bug llegó
primero a los usuarios.

## Lee las tres superficies, justo antes del merge

Las revisiones caen en tres lugares distintos, y cada herramienta muestra solo
algunos:

1. **Comentarios del PR** (de nivel superior). Algunos bots de revisión
   publican aquí su revisión completa, bajo el propio login del owner.
2. **Reviews** (los resúmenes y estados de las revisiones).
3. **Hilos de revisión** (comentarios en línea sobre el código).

Lee los tres **inmediatamente antes del merge**, aunque CI esté en verde y el
owner haya escrito "merge" en el chat. Los revisores automáticos muchas veces
llegan minutos después de que se abre el PR o después de un push. Si algo
queda sin respuesta, o contradice lo que se dijo en el chat, **detente y
pregunta**.

## Usa más de un revisor

- La herramienta que escribe el código no es la que lo revisa.
- Corre al menos un revisor de código y un revisor de seguridad. Una buena
  revisión de seguridad da hallazgos ordenados por severidad, con archivo y
  línea, por qué importa y una corrección sugerida.

## Responde cada hallazgo según sus méritos

Ni un bot ni una mayoría tienen la autoridad. Para cada hallazgo:

| El hallazgo es | Haz |
|---|---|
| Correcto | Corrígelo en el mismo PR, con una prueba construida a partir de la entrada exacta del revisor. Responde con el commit. |
| Incorrecto (le faltó contexto, malinterpretó el diseño) | Responde con el razonamiento. No lo corrijas, y no hagas merge en silencio. |
| Ambiguo | Pregúntale al owner. |
| Ya resuelto | Di dónde. |
| Dos revisores no están de acuerdo | Verifica contra el código, córrelo si puedes, y registra quién tenía razón y por qué. Nunca decidas por mayoría. |

Responde por hallazgo: **Corregido** (commit), **Parcial** (qué falta), **No
hecho** (por qué). Al corregir, busca con grep todos los demás lugares con el
mismo bug: el revisor nombra un caso, y la clase casi siempre es más grande.

## Cuando la decisión no es del asistente

Algunos hallazgos solo se cierran con la decisión del owner (aceptar un
riesgo, cambiar una regla). El asistente escribe "No me toca cerrarlo: le
pregunté al owner" y lo deja abierto, registrado en el registro de riesgos (ve
`secrets-and-fake-data` para el registro).

## Pedirle a un asistente que corrija hallazgos

Publica un solo comentario numerado con límites firmes:

```markdown
@assistant por favor corrige los hallazgos de abajo en este PR.

Reglas:
- NO hagas merge y NO hagas deploy.
- Solo commits normales: nada de force-push, nada de rebase.
- Agrega una prueba para cada corrección y muéstrala fallando sin la corrección.
- Deja abierto el punto 4: cerrarlo es decisión del owner.
- Responde por punto: Corregido / Parcial / No hecho, con la razón.

1. (Alta) ...
2. (Media) ...
```

## Presupuesto de revisión

Declara cuántas rondas de revisión tiene un PR. Un hallazgo que llega después
de cerrar el presupuesto se corrige igual; las rondas siguientes van a un PR de
seguimiento, para que un PR no crezca para siempre.
