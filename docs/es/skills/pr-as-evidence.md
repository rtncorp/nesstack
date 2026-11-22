# El PR es la evidencia

> Skill: `pr-as-evidence` · [English](../../../plugins/nesstack/skills/pr-as-evidence/SKILL.md)

Trabaja en fases pequeñas, un PR por fase, donde el PR mismo es la prueba: los
criterios de aceptación se muestran con la salida de las pruebas, logs o
capturas de pantalla, lo que no está demostrado se dice claramente, el rollout
y el rollback se deciden antes de programar, y los commits enuncian el bug como
un hecho. Úsala al planear una función, al abrir o describir un pull request,
al escribir un mensaje de commit o al decidir cómo llega a los usuarios un
cambio riesgoso.

Los asistentes de IA escriben código rápido. Lo que frena un proyecto no es
eso, sino no saber si ese código funciona. Por eso la unidad de trabajo es un
PR pequeño que **demuestra** lo que afirma, y nada avanza hasta que lo haga.

## Una fase, un PR

- Divide el trabajo en fases, cada una con criterios de aceptación escritos
  antes del código.
- Un buen orden: la especificación (un documento), luego el motor, luego las
  vistas de solo lectura, luego las escrituras. Cada pieza se prueba en uso
  antes de empezar la siguiente.
- Un PR por fase. Un PR que hace dos cosas termina revisado como ninguna.
- **Solo el owner hace merge**, después de escribir "merge" para ese PR, con
  CI en verde y cada revisión leída (ve `review-before-merge`). Un asistente
  nunca hace merge por su propio criterio.

## Decide el rollout antes de escribir código

Hazte tres preguntas y escribe la respuesta en una línea antes de empezar:

1. ¿Cambia un contrato (la forma de una API, lo que envía un cliente, un
   schema)?
2. ¿Puede romper o corromper datos, o tumbar algo que hoy funciona?
3. ¿Cambia de forma notable lo que un usuario hace en una pantalla?

- Si 1 o 2 es sí → detrás de un flag, por cliente, apagado por defecto.
- Si solo 3 es sí → una ruta o página canary.
- Si todas son no → un PR normal.
- Si no estás seguro → pregúntale al owner.

"Encendido para todos" significa un PR que **quita** el flag, nunca un script
que lo enciende para cada cliente: un ciclo se salta a uno, y los clientes que
se creen mañana no tienen fila.

## El cuerpo del PR

```markdown
## Resumen
Qué cambia y por qué. Nombra el modo de falla que corrige y cómo se
reprodujo.

## Alcance
Qué entra. Qué queda fuera a propósito.

## Evidencia de aceptación
- `pnpm test`: core 214 passed, runtime 98 passed, contra un Postgres real.
- Quité el check de propiedad: fallan 4 pruebas. Restaurado: en verde.
- Captura de pantalla de la nueva página (datos ficticios).

## No demostrado
- Todavía no se ha corrido contra el proveedor de pagos real.

## Rollout
ninguno / flag `<name>` / ruta canary — porque ...
Rollback: revert, o apagar el flag.

## Riesgos
...
```

**Di lo que no está demostrado.** "Ningún modelo real ha pasado todavía por
esta versión" vale más que un resumen lleno de confianza. Un lector que confía
en tu PR porque nunca exagera lo va a leer más rápido.

## Commits que cuentan la historia

- El título enuncia el comportamiento o el bug como un hecho, en imperativo o
  como un hallazgo:
  `fix(runtime): a correction withdraws the proposal it corrects`
- El cuerpo dice **por qué**, no qué (el diff dice qué). Para un bug: síntoma,
  causa, por qué las pruebas estaban en verde, el fix y cómo se verificó.
- Nunca pongas nombres reales de clientes, direcciones, ids de dispositivos ni
  datos personales en un commit o en el cuerpo de un PR. La historia es para
  siempre, y es lo primero que se termina pegando en algún lugar público.

## Antipatrones

- Un PR con una checklist de "Test plan" que nadie marcó.
- "En mi máquina funciona" sin ninguna salida.
- Una sola rama de larga vida que carga muchos PRs sin relación entre sí.
- Una ruta de diagnóstico marcada como "temporal" que sigue ahí meses después.
  Ponle fecha de eliminación en el PR que la agrega.
