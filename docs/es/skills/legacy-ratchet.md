# El trinquete del código heredado

> Skill: `legacy-ratchet` · [English](../../../plugins/nesstack/skills/legacy-ratchet/SKILL.md)

Mejora un código existente sin detenerlo: un trinquete (ratchet) donde el
código nuevo es estricto y la deuda vieja nunca crece, advertencias donde una
IA podría editar el archivo equivocado de dos que se parecen, migraciones en
lugar de cambios de schema en tiempo de ejecución, dependencias fijadas y un
argumento por escrito para cada CVE ignorado. Úsala al trabajar en un código
grande o viejo, en un archivo de miles de líneas, en un proyecto con errores de
tipos o sin pruebas, al agregar dependencias o cuando un escáner de
vulnerabilidades hace fallar el build.

Rara vez vas a empezar de cero. La regla para el código existente: **cada PR lo
deja no peor, y el código nuevo es estricto.**

## Islas de rigor

- Si todo el proyecto no puede pasar un typecheck hoy, dale a cada módulo nuevo
  su propia configuración estricta (`tsconfig.<module>.json`, su propio script
  `check:<module>`) que debe mantenerse en cero errores.
- Para lo demás, un trinquete: "11 errores antes, 11 después, salida idéntica".
  El PR no arregla la deuda vieja y no agrega deuda nueva.
- Lo mismo para los warnings del lint, la cobertura de pruebas y el tamaño de
  los archivos: registra el número y haz fallar CI si sube.

## Dos lugares que se parecen

Cuando hay dos archivos que una IA podría confundir (un entry point viejo que
ya no se despliega, una copia de un módulo), pon la advertencia **donde el
asistente la va a leer**: hasta arriba del archivo muerto y en el archivo de
memoria. Luego borra el camino muerto en cuanto puedas. Un caso real: una ruta
nueva se agregó en el archivo viejo que no se desplegaba, y una sincronización
no mandó nada, en silencio, durante un mes.

En un archivo compartido muy concurrido (uno que tocan muchos PRs), haz rebase
sobre main justo antes de cada push, y mantén un registro de símbolos críticos
que CI revisa que sigan existiendo después del cambio.

## El schema vive en las migraciones

- Cada cambio de schema es una migración numerada, con su rollback. Las
  migraciones ya aplicadas nunca se editan: agrega una nueva.
- Nada de `CREATE TABLE IF NOT EXISTS` regado por el código en tiempo de
  ejecución "como red de seguridad". Eso esconde el desfase hasta que falta una
  columna en un ambiente y un job vuelve a notificar cada cinco minutos.
- "Registrada como aplicada" es una afirmación sobre el registro de
  migraciones, no sobre la base de datos. Una migración que se salta en una
  base de datos nueva no es lo mismo que una que no era necesaria: prueba
  también las migraciones en una base de datos nueva.
- Mantén las migraciones solo de expansión (expand-only) cuando puedas, para
  que el código viejo y el nuevo corran los dos durante un deploy.

## Dependencias

- **Fija todo**: las acciones de CI por SHA de commit, las imágenes por digest,
  los clones por tag o commit. Nunca metas en un build la punta de una rama que
  se mueve.
- Un escáner de vulnerabilidades hace fallar el build con hallazgos críticos.
- Si existe un fix upstream, actualiza. Si no existe, una entrada para
  ignorarlo necesita: el paquete, el estado upstream, un argumento razonado de
  que tu código no lo alcanza, un control compensatorio, una referencia al
  registro de riesgos y una fecha de revisión. Cada una en su propio PR.
- Espera antes de adoptar una versión recién salida (por ejemplo, una
  antigüedad mínima de 14 días), para que otros tengan tiempo de detectar una
  versión comprometida.

## Archivos grandes

Un archivo de 15,000 o 30,000 líneas es donde las ediciones de la IA salen
mal: se pierde el contexto, los conflictos se resuelven conservando una copia
vieja, desaparece un símbolo. No lo reescribas de una vez. Extrae un módulo por
PR, con sus pruebas, y mueve a quienes lo llaman.
