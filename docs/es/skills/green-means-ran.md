# Verde significa que corrió

> Skill: `green-means-ran` · [English](../../../plugins/nesstack/skills/green-means-ran/SKILL.md)

Asegúrate de que un CI en verde signifique que las pruebas de verdad corrieron:
cada suite de pruebas conectada a CI, skips que fallan con ruido, un step con
nombre por cada invariante, y un análisis de "¿por qué estaba verde la suite?"
después de cada bug que llegó a producción. Úsala al configurar o cambiar CI,
al agregar un script de pruebas, cuando un bug salió a pesar de que las pruebas
pasaban o cuando una corrida de CI es sospechosamente rápida o silenciosa.

El verde más caro es aquel en el que no se revisó nada. Pasa de tres formas:
existe una suite y CI nunca la llama; una suite hace skip porque falta una
dependencia; o un resumen esconde qué check falló.

## Cada suite está en CI

- Cada script de pruebas del proyecto (`test:*`, cada `*_test.go`, cada
  carpeta de pruebas) lo llama CI. Agrega un check en CI que liste los scripts
  y falle si alguno no está conectado. Casos reales: un servicio crítico no
  tenía CI en absoluto ("solo corrían si alguien se acordaba"), y después se
  encontraron en `package.json` otras dos suites que nadie corría.
- Prueba también ese check: dale un fixture con un script que no esté
  conectado y mira cómo falla.

## Un skip es una falla en CI

- Si falta la base de datos de prueba, una credencial o un servicio, la prueba
  **falla** en CI. En local un skip está bien; en CI es una mentira que se lee
  como éxito.

```js
if (!process.env.TEST_DATABASE_URL) {
  if (process.env.CI) throw new Error('TEST_DATABASE_URL missing in CI');
  test.skip('no database locally');
}
```

## Un step por invariante, con nombre en palabras

Corre cada suite como su propio step de CI, con el nombre de lo que protege:

```yaml
- name: A pass is delivered by email, never on the screen
  run: node scripts/test-pass-delivery.mjs
- name: A tenant never reads another tenant's rows
  run: npm run test:isolation
```

Con `a && b && c` el resumen solo dice "failed". Con steps con nombre, la línea
en rojo te dice qué regla se rompió antes de que abras un log.

## CI se revisa a sí mismo

- Parsea cada archivo de workflow en CI. Un job definido dos veces, o un typo
  en un trigger, puede detener los deploys en silencio: en un caso real nada se
  desplegó durante días porque un archivo de workflow estaba roto y nada lo
  leía.
- Un smoke test del contenedor: el servicio se niega a arrancar sin
  configuración, responde su health check y rechaza una petición sin firma.
- Un step de build que compile todo (deploy con `--dry-run`, typecheck
  completo) atrapa el import roto que ninguna prueba unitaria importa.

## "¿Por qué estaba verde la suite?"

Cada bug que llegó a producción responde esto en su PR, y la respuesta cambia
una prueba, no solo el código:

- la prueba usaba un doble que no se comportaba como lo real;
- la prueba existía y CI nunca la corrió;
- la aserción revisaba que hubiera un valor, no cuál era el valor;
- el fixture tenía un schema distinto al de producción;
- nada probaba ese camino.

## Antipatrones

- Hacer merge sin mirar una corrida fallida en la rama.
- "Es flaky, vuélvelo a correr" sin averiguar por qué.
- Desactivar, hacer skip o poner en cuarentena una prueba para que quede en
  verde. Nunca.
