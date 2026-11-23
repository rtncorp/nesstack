# Primero mide

> Skill: `measure-first` · [English](../../../plugins/nesstack/skills/measure-first/SKILL.md)

Mide antes de creer: sondea el sistema real antes de construir sobre una
especificación, di qué resultado refutaría una hipótesis y revisa que el
instrumento pueda mostrarlo, usa un grupo de control, ponle fecha a cada número
y revisa qué sistema y qué versión del código respondió de verdad. Úsala al
depurar, al diagnosticar una función lenta o rota, al integrar una API o un
hardware de terceros, al leer métricas o cuando estés a punto de decir "no
soporta X" o "ya quedó".

La mayoría de las respuestas equivocadas al depurar no vienen de un mal
razonamiento. Son una conclusión segura leída de un instrumento que no podía
mostrar lo que se estaba preguntando.

## Antes de un sondeo

1. **Enuncia la hipótesis.**
2. **Enuncia qué resultado la refutaría.**
3. **Revisa que el instrumento pueda producir ese resultado.** Una consulta
   limitada a 5,000 filas no puede mostrar un evento raro; un conteo de
   nombres distintos no puede contar interfaces cuando 73 dispositivos llaman a
   la suya `eth0`.
4. **Agrega un control**: algo que sabes que está ahí, en la misma consulta. Si
   el control también regresa vacío, el ciego es el instrumento, no el sistema.

## Instrumentos que mienten

- Una **muestra** leída como total (la primera página, un facet con tope, una
  ventana de 5 minutos sobre un evento raro).
- Un **denominador tomado del resultado**: si los dos lados de una proporción
  salen de la salida ya filtrada, la proporción es una identidad y no demuestra
  nada.
- Una **ventana que no coincide con el periodo de los datos** (dividir 130
  segundos de datos entre 5 minutos).
- Un **check de truthiness** sobre un valor que puede ser el string
  `"Unknown"`. Califica el valor, no si es truthy.
- Un **exit status** que no distingue "no hizo nada" de "tuvo éxito".
- **La máquina equivocada**: una variable de shell perdida que hizo que el
  comando corriera en local. Cuando una lectura es físicamente imposible,
  pregúntate qué sistema respondió.

## Sondea lo real antes de construir sobre la especificación

- Antes de escribir una integración, corre **scripts de sondeo de solo
  lectura** contra la API o el hardware real y responde preguntas concretas.
  Registra lo que mediste, con la fecha y la versión, en un archivo de notas
  por proveedor.
- **Una medición pesa más que una especificación.** Las especificaciones omiten
  rutas que sí funcionan y listan campos que son configuración, no telemetría.
  Califica a partir de los payloads, nunca de los nombres de los campos, y
  recuerda que el nombre del campo no es la palabra en inglés para eso.
- **Un negativo necesita más evidencia que un positivo.** "La API no tiene X" a
  partir de una sola superficie, un dispositivo inactivo o un `200` vacío es
  una afirmación sobre esa superficie, ese dispositivo y ese momento. Un `200`
  vacío demuestra que la ruta es alcanzable y nada más.
- Un endpoint no documentado sale detrás de un camino de falla que solo lo
  degrada a él, y se mide en más de un cliente antes de confiar en él.

## Los números llevan su fecha

- **Un número en un comentario es una medición con fecha.** "8 GB alcanzan de
  sobra para el sort" era cierto cuando se escribió, nunca se volvió a medir, y
  se volvió la causa de la siguiente caída cuando crecieron los datos. Escribe
  la fecha y contra qué se dimensionó, para que el siguiente lector sepa cuándo
  caducó.
- **Una medición lleva el estado del sistema en el que se tomó.** Antes de
  citar un número de producción, pregúntate qué más era cierto ese día (un
  incidente, una migración, un disco lleno).

## Revisa que lo que leíste esté al día

- `git log -1` sobre el archivo que acabas de leer, y `git fetch` antes de
  confiar en un clon. Una vez un checkout de hace dieciocho días "demostró" que
  una función no existía.
- Una nota que dice "verificado como abierto el <fecha>" vale lo que vale su
  fecha. Vuelve a revisar el código antes de actuar con base en ella.

## Cuando un panel está vacío junto a uno lleno

Compara lo que **leen** los dos (tabla, permisos, consulta) antes de hacer
teorías sobre el productor de los datos. La respuesta muchas veces está en la
misma captura de pantalla.
