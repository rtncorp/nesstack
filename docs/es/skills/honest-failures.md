# Fallas honestas

> Skill: `honest-failures` · [English](../../../plugins/nesstack/skills/honest-failures/SKILL.md)

Haz que las fallas sean visibles y distinguibles en lugar de verosímiles: falla
cerrado, nunca conviertas un error en un resultado vacío, separa "no pude
revisar" de "no hay nada", y haz que los mensajes de error digan lo que de
verdad respondió el otro lado. Úsala al escribir manejo de errores, un bloque
catch, un fallback, un valor por defecto, una integración con una API externa,
un health check o un estado vacío en la UI.

La falla más cara que puede tener un sistema es una respuesta incorrecta que
parece correcta: sin excepción, sin log, y con una lista vacía perfectamente
creíble.

## "No pude revisar" no es "no hay nada"

```js
// Mal: un error se vuelve una respuesta.
const networks = await db.query(sql).catch(() => []);
// La pantalla dice "no hay ninguna red encendida" mientras la red está encendida.

// Bien: el error sigue siendo un error hasta llegar a la persona.
let networks;
try {
  networks = await db.query(sql);
} catch (err) {
  log.error({ err, route: 'networks' }, 'networks query failed');
  networks = null;            // null = no se pudo revisar
}
// UI: null → "No se pudo revisar en este momento"; [] → "No hay ninguna red encendida"
```

- Una función que puede fallar regresa algo que quien la llama puede distinguir
  de un resultado vacío real: `null`, un error, un estado.
- **Un helper que se traga un error de parseo y regresa un acumulador vacío es
  peor que uno que truena**: nadie puede distinguir "no hay datos" de "no lo
  pude leer".
- Un estado vacío en la UI solo se muestra cuando los datos se leyeron y
  estaban vacíos.
- Un componente que puede volver a pedir los datos revisa si tiene datos en
  caché antes de mostrar un error, para que un refresco fallido no tire a la
  basura una página que estaba bien.

## Fallar cerrado

- Falta un secreto → la ruta está apagada (404/503), no abierta.
- La allowlist está vacía → la función no hace nada, no todo.
- Error de base de datos al leer un feature flag → el flag está apagado.
- Falta el contexto de tenant o de usuario → rechaza. Nunca caigas en un
  tenant por defecto escrito en el código.
- Un collector cuya fuente puede no estar **reporta** la ausencia ("absent",
  "installing", "no permissions", "active") en cada heartbeat. Una dependencia
  ausente es un estado, no un `return` silencioso.

## Los errores dicen lo que dijo el otro lado

Cuando falla una llamada externa, el error lleva lo que regresó:

```
vendor API: HTTP 403, content-type text/html,
body starts "<!DOCTYPE html><title>Just a moment...</title>",
trace id 7f3c...
```

No `Unexpected token '<' in JSON`. El status, el content type, los primeros
bytes del body y el trace id del propio proveedor le permiten a cualquiera,
incluido el soporte del proveedor, encontrar la misma petición. Nunca pongas
en el log la credencial ni el body completo.

## No inventes

- **Nunca inventes historia que falta.** Las filas creadas mientras un bug
  estaba activo se quedan con sus campos vacíos; llenar "quién confirmó" con
  una suposición es peor que el hueco.
- **Nunca inventes una razón.** El comentario de una constante enuncia una
  medición (con su fecha) o una decisión (con quién la tomó), no una historia
  verosímil.
- **No dupliques "por si acaso".** Una vez, dos mecanismos para invalidar caché
  configurados al mismo tiempo rompieron todas las llamadas a un proveedor. Usa
  el único mecanismo estándar y sabe por qué.

## Un error en el log no siempre es una escritura fallida

Antes de decir que una línea del log es un bug, lee a quien hace la llamada:
puede ser el primer paso de un fallback diseñado a propósito. Revisa lo que
dicen los datos, no solo lo que dice el log.
