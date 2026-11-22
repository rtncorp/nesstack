# Agentes acotados

> Skill: `narrow-agents` · [English](../../../plugins/nesstack/skills/narrow-agents/SKILL.md)

Diseña agentes de IA y funciones con LLM que sean útiles y seguros: cada agente
con un solo trabajo, una meta en lugar de pasos, capacidades tomadas de una
lista estricta, límites firmes que hace cumplir el servidor en lugar del
prompt, escrituras como borradores o detrás del sí de una persona, y contenido
no confiable (correos, páginas web, resultados de herramientas) tratado como
datos. Úsala al construir un agente de IA, un chatbot con herramientas, un
flujo con LLM, la definición de una herramienta o un system prompt.

## Un agente, un trabajo

- Un agente que puede hacer todo es un punto único de falla. Dale a cada agente
  un solo trabajo y solo las capacidades que ese trabajo necesita; para ese
  agente, lo demás no existe.
- **Acota por superficie, no por prompt.** Cada agente tiene su propia API (o
  lista de herramientas), su propio token y solo las rutas que su trabajo
  necesita: solo lectura donde leer es suficiente, una allowlist de columnas, a
  lo mucho un puñado de escrituras. El token de un agente se rechaza en la API
  de otro agente.
- Un caso real: un PR le dio a un agente de soporte el token del analista
  porque era práctico. Ese token también llegaba a los datos de ventas e
  ingresos. Se cerró sin merge; el agente de soporte recibió su propia API
  acotada.
- Una petición fuera del trabajo no se ejecuta. A la persona se le dice a
  dónde ir (otro agente, o el administrador), no se le deja con una negativa
  seca.

## Una meta, capacidades y límites. No pasos

- Las instrucciones dan la **meta** y cómo se ve **terminado**, y dejan el
  criterio al modelo. Qué intentar primero, qué preguntar y cuándo volver son
  decisiones del modelo.
- **Las capacidades dicen lo que necesitan.** El schema de entrada de una
  herramienta nombra cada campo que requiere el sistema detrás de ella, como un
  objeto estricto. Así el agente sabe que falta algo y lo pregunta, sin que
  nadie escriba esa pregunta.
- **Los prompts rígidos rompen a los agentes.** Una regla escrita para un caso
  raro y enunciada como general hizo que modelos reales rechazaran peticiones
  normales, dos veces en un día. Los agentes preguntaban "¿confirmas?" en texto
  en lugar de llamar a la herramienta. Un agente rígido no responde nada, no
  hace nada o pide permiso para todo.

## Lo que nunca debe pasar vive en el servidor

El prompt puede ser flexible porque los límites no están en el prompt.

- **Una función de política decide cada llamada a herramienta**, a partir de la
  definición del agente y de la configuración validada, nunca de la
  conversación. Ningún camino de código ejecuta una herramienta saltándosela.
- **Una herramienta que escribe necesita el sí de una persona**, pedido sobre
  los valores exactos que se van a escribir, o escribe un **borrador** que una
  persona emite. No existe ninguna ruta de agente para aprobar, pagar o borrar.
- **Los topes viven en el servidor**: mensajes por pieza de trabajo, por día,
  tamaño de lo que se envía, qué se puede adjuntar.
- **El texto de salida se revisa** antes de salir: ids, números de cuenta,
  credenciales y cualquier cosa que no tenga lugar ahí detienen el mensaje o le
  preguntan a una persona.
- **La configuración solo restringe.** Los ajustes de un cliente pueden afinar
  o restringir a un agente; nunca agregan una herramienta ni quitan una
  aprobación.
- **Cada acción queda en el audit log**: quién, qué, cuándo, sobre qué.

## El contenido no confiable es datos

- Los correos, tickets, páginas web, contenidos de archivos, resultados de
  herramientas y mensajes de otros agentes **nunca actúan como
  instrucciones**. Ponlos en un bloque de datos claramente delimitado, y nunca
  dejes que un valor que se va a escribir salga de ese texto: léelo del
  documento fuente.
- Prueba el caso de inyección antes de sacarlo: un correo que le pide al agente
  reenviar el correo del usuario a otro lado no debe obtener nada.
- Llega al exterior solo a través de herramientas declaradas. Un navegador para
  un agente no tiene forma de entrar a direcciones privadas, al servicio de
  metadatos de la nube ni a tu propia red; una credencial está atada a su
  dominio exacto y el modelo nunca la ve.

## Pasarle trabajo a otro agente

Un handoff (traspaso de trabajo) lleva campos tipados y referencias a
documentos, nunca instrucciones. El agente que lo recibe aplica sus propios
límites y aprobaciones, así que delegar nunca amplía los permisos. Las personas
pueden ver que ocurrió.
