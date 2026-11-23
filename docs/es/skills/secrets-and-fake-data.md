# Secretos y datos ficticios

> Skill: `secrets-and-fake-data` · [English](../../../plugins/nesstack/skills/secrets-and-fake-data/SKILL.md)

Mantén los secretos y los datos reales fuera del repositorio, el chat, los logs
y el contexto de la IA: solo un gestor de secretos, un escáner de secretos y
saber qué se le escapa, datos ficticios en cada prueba y demo, una protección
contra filtraciones de nombres de clientes, y un registro de riesgos aceptados
y hallazgos abiertos. Úsala al manejar credenciales o API keys, al escribir
fixtures, seeds, demos o capturas de pantalla, al pegar logs o cuando un
hallazgo de revisión no se puede corregir de inmediato.

## Secretos

- **Los secretos viven solo en un gestor de secretos** (el almacén de secretos
  de tu nube, `wrangler secret put`, los secretos cifrados del CI). Nunca en el
  código, en archivos de configuración, en el archivo de memoria, en el chat,
  en el cuerpo de los PRs, en los logs ni en los fixtures.
- **Corre un escáner de secretos sobre toda la historia en CI** (por ejemplo
  gitleaks). Luego recuerda **lo que no puede ver**: atrapa formas `key=value`
  y no ve una contraseña suelta dentro de una oración. Una vez una contraseña
  de base de datos en texto plano quedó en un documento de traspaso commiteado
  y el escáner no dijo nada. Así que la regla "nunca un secreto en el texto" se
  cumple al escribir el texto, por la persona o el asistente que lo escribe.
- **En la base de datos guarda una referencia, no el valor**:
  `env:VENDOR_API_SECRET` en lugar del secreto mismo.
- **Los scripts leen las llaves del entorno**, pidiéndolas con `read -rs`,
  nunca como argumento de línea de comandos (termina en el historial del shell
  y en las listas de procesos).
- **Nunca pongas una llave en una URL** (`?key=...`): termina en logs, proxies
  y en el historial del navegador. Usa un header, y compara con una función de
  tiempo constante.
- **Una llave, un trabajo.** Una llave de cifrado nunca es también una
  contraseña, un token ni un secreto de firma.
- **Fallar cerrado:** si un secreto no está configurado, la función está
  apagada (404/503), no abierta.
- **Los placeholders se etiquetan** como que no son credenciales, para que
  nadie tenga dudas.

## Datos

- **Solo datos ficticios** en pruebas, fixtures, seeds, demos, evals y
  capturas de pantalla: "Acme Logistics", "Blue Harbor Cafe",
  `fan@example.com`, direcciones IP de los rangos de documentación
  (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`), direcciones MAC de
  `00:00:5E:00:53:00/24`.
- **Nada de nombres reales de clientes, hostnames, direcciones, ids de
  dispositivos ni datos personales en commits o en el cuerpo de los PRs.** La
  historia es permanente y se copia.
- **Una protección contra filtraciones de nombres.** Mantén la lista de nombres
  privados (clientes, sitios) fuera del repositorio, en los secretos del CI, y
  haz fallar el build cuando uno aparezca en la salida. Clasifica lo que
  encuentra en lugar de usar una allowlist silenciosa: una filtración falla; un
  valor guardado en el lugar que le corresponde, o una mención en un
  comentario, pasa **y se imprime**, para que nada se esconda en una lista que
  nadie vuelve a leer. La primera corrida de una protección así en una de
  nuestras apps encontró 20 filtraciones además de la que la motivó.
- **Lo que pegas en una IA llega a su proveedor.** Los logs, las tablas y las
  capturas de pantalla pasan por la misma redacción que aplicarías antes de
  mandarlos fuera de la empresa.

## El registro de riesgos

No todos los hallazgos se corrigen hoy. Los que no, se escriben, nunca se
olvidan:

```markdown
| Id | Hallazgo | Severidad | Origen | Responsable | Objetivo | Estado |
|----|----------|-----------|--------|-------------|----------|--------|
| O12 | Cookie de sesión configurada sin SameSite | Media | Revisión de seguridad de #NNN | Eng | siguiente sprint | Abierto |

| Id | Riesgo aceptado | Control compensatorio | Aceptado por | Fecha |
|----|-----------------|-----------------------|--------------|-------|
| R3 | Los archivos subidos no se escanean en busca de virus | Límites de tamaño y tipo, los archivos nunca se ejecutan ni se sirven inline | Owner | 2026-03-14 |
```

- Un PR que deja abierto un hallazgo de revisión, o que acepta un riesgo,
  agrega la fila en el mismo PR.
- Un punto cerrado nombra el PR que lo cerró y nunca se borra.
- Solo el owner acepta un riesgo. Un asistente propone la fila y pregunta.
