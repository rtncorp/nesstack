# Del error a la protección

> Skill: `mistake-to-guard` · [English](../../../plugins/nesstack/skills/mistake-to-guard/SKILL.md)

Convierte cada bug, incidente o hallazgo de revisión en una regla escrita y un
check automático que lo habría atrapado. Úsala después de corregir un bug que
llegó a producción, después de un postmortem, cuando el mismo tipo de error
pasa dos veces o cuando alguien propone una regla que nada hace cumplir
("siempre deberíamos...").

> Un comentario en el archivo de memoria no es una protección. Un check que
> rompe el build sí lo es.

Cada error se paga una vez. Si solo produce un fix, lo vuelves a pagar la
siguiente vez que alguien, o algún modelo, lo cometa. El ciclo es:

1. **Corrige el caso.**
2. **Encuentra la clase.** Busca con grep cada pariente del bug, no solo la
   línea que nombró el revisor. "Tenía razón sobre el caso y estaba mal sobre
   la clase" es la forma más común en que falla un fix.
3. **Escribe la regla** en el archivo de memoria con su razón (ve
   `project-memory`).
4. **Construye la protección** (el guard): una prueba, un lint o un step de CI
   que falla con el código viejo.
5. **Demuestra la protección**: vuelve a meter el bug y mira cómo falla (ve
   `prove-it-fails`).

## Cómo elegir la protección

| El error | Una protección que funciona |
|---|---|
| Un valor olvidado en uno de N lugares | Una prueba que enumera los lugares y revisa cada uno |
| Un archivo sobrescrito desde una rama vieja | Un registro de símbolos críticos que deben seguir existiendo después del cambio |
| Una versión que no se subió junto con un cambio | Un check en CI: cambió algo bajo `agent/` → `VERSION` mayor que la de main |
| Una dependencia descargada sin fijar | Un lint que rechaza un clone o una imagen sin tag o digest |
| Una consulta sin el filtro de tenant | Un lint sobre cada consulta, con una allowlist indexada por el hash del contenido de la consulta |
| Un nombre de cliente filtrado en la UI | Un check de build sobre la salida contra una lista de nombres privados |
| Un archivo de workflow roto sin que nadie se diera cuenta | Un step de CI que parsea cada archivo de workflow |

Indexa una allowlist **por contenido, no por número de línea**. Los números de
línea se mueven con cada edición; un hash de contenido expira justo cuando
cambia el código exento, que es cuando necesita revisarse otra vez.

## La protección tiene que ser honesta sobre lo que demuestra

- Un check estático demuestra que el texto concuerda, nunca lo que hace el
  código en tiempo de ejecución. Di cuál de los dos es tu protección.
- Una protección que busca una palabra con grep prueba la palabra. Un check que
  busca un patrón puede engañarse con un comentario, con backticks, con un
  salto de línea. Córrelo contra el código roto y míralo fallar antes de
  confiar en su "OK".
- "El lint está limpio" es una afirmación más débil que "ningún código tiene
  este bug". No reportes una como si fuera la otra.

## Escribe el incidente donde se va a leer

El commit y el PR que corrigen un bug de producción dicen, en este orden:

1. el síntoma, como lo vio el usuario;
2. la causa;
3. **por qué las pruebas estaban en verde de todos modos**;
4. el fix y la protección;
5. cómo se verificó.

Titula el commit con el bug enunciado como un hecho, no como "fix X":

```
The reconnect waited a sixth of what registration waits
```

Así la historia funciona como un log consultable de todo lo que alguna vez se
rompió.

## Antipatrones

- Una regla en el archivo de memoria sin ningún check detrás, para un error que
  ya pasó dos veces.
- Un fix sin prueba, seguido de un segundo fix para lo mismo.
- Una cadena de commits de "fix" de una línea adivinando cómo funciona una API
  externa. Detente, escribe una prueba contra una respuesta real grabada, y
  luego corrige una sola vez.
- Borrar una regla porque estorbó una vez. Si la regla está mal, cámbiala;
  registra por qué.
