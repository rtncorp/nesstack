# Demuestra que falla

> Skill: `prove-it-fails` · [English](../../../plugins/nesstack/skills/prove-it-fails/SKILL.md)

Demuestra que una prueba de verdad protege lo que dice proteger quitando la
protección y viendo cómo falla la prueba, y prueba contra sistemas reales
(base de datos real, driver real, schema real) en lugar de dobles escritos a
mano. Úsala al agregar un check de seguridad, una validación, una protección o
una prueba de regresión, cuando una prueba pasa a la primera o cuando un
fixture o un mock define a mano un schema o una API.

Una prueba que nunca ha estado en rojo no demuestra nada. Puede estar probando
lo que no es, puede que no corra, o el mock puede responder lo que esperabas en
lugar de lo que responde el sistema real.

## La regla

**Una protección cuenta solo cuando se ha visto fallar su prueba sin ella.**

1. Escribe la protección y su prueba. Mírala en verde.
2. Quita la protección (o vuelve a meter el bug) una vez.
3. Corre la prueba. Tiene que fallar, y fallar por la razón correcta: lee el
   mensaje.
4. Restaura la protección. En verde otra vez.
5. Escribe en el PR qué quitaste y qué falló:

```
Quité el check de tenant en `loadInvoice`: fallan 3 pruebas
("expected 404, got 200"). Restaurado: todas pasan.
```

Para las protecciones que van a importar por mucho tiempo, deja la versión rota
**dentro de la prueba** como caso de mutación: la prueba corre el código de
antes del fix y verifica que se detecta. Así la demostración corre en cada
build, no solo el día que la escribiste.

## Después de un refactor, vuelve a apuntar las mutaciones

Una mutación que ya no toca el camino de código donde vive la regla reporta
"cubierto" sin probar nada. Después de mover la regla, vuelve a correr cada
mutación y revisa que cada una siga haciendo fallar algo. Una mutación que no
hace fallar nada está muerta o es redundante: di cuál de las dos, no la dejes
en la cuenta.

## Prueba contra lo real

Los dobles se van alejando de lo que imitan, y un doble desfasado pone en verde
una función rota.

- **Base de datos:** corre las pruebas contra una instancia real del motor que
  usas en producción (Postgres, SQLite, el que sea). En CI, que falte la base
  de datos es una falla, nunca un skip.
- **Schema:** construye la base de datos de prueba con las mismas migraciones
  que corre producción. Un fixture que escribe su propio `CREATE TABLE` es una
  segunda definición del schema, y dos definiciones se desfasan. Un caso real:
  un fixture tenía una columna que la tabla real no tenía. La consulta fallaba
  en producción cada vez, y un `catch` convertía el error en una lista vacía.
- **Permisos:** si producción revoca el acceso a una tabla, la prueba también
  debe revocarlo. Un fixture que otorga más que producción califica como
  aprobada una ruta rota.
- **Drivers:** una sentencia que hace cast de un parámetro se prueba a través
  del driver que lo enlaza, con los tipos de quien la llama. Dos drivers
  serializan el mismo valor de forma distinta.
- **APIs externas:** graba respuestas reales (con datos ficticios) y prueba
  contra ellas. Un fake que descarta cómo lo llamaron no puede atrapar una
  llamada hecha de forma incorrecta: graba también la petición, y verifica
  contra ella.

## Reproduce la forma, no una simplificación

Cuando revisas un fix sobre una versión recortada del código que falla,
asegúrate de que el recorte no haya quitado la propiedad que causaba el bug.
Una consulta simplificada para usar una subexpresión una vez puede optimizarse
distinto de la real, que la usa tres veces.

## En el PR

- Número de pruebas por paquete, y que corrieron contra la base de datos real.
- Qué se quitó para demostrar cada protección, y qué falló.
- Lo que **no** está cubierto, dicho claramente: "Todavía no se ha corrido
  contra la API real."
