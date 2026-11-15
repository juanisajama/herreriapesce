# Herrería Pesce — Catálogo, reservas y panel de administración

## Estética
Industrial: fondo negro carbón, gris acero, acentos naranja fuego, texto blanco. Tipografía condensada y fuerte para títulos (ej. Bebas Neue / Barlow), texturas sutiles de metal, bordes rectos, detalles tipo chispa/soldadura. Fotos de producto generadas con estilo de taller.

## Páginas
- **/** Inicio: portada con el taller, propuesta de valor, acceso al catálogo, ubicación San Martín y contacto WhatsApp.
- **/catalogo** Tarjetas de producto: foto, medidas, capacidad de carga / material, precio, % de seña.
- **/producto/$id** Flujo de reserva del producto.
- **/admin** Panel oculto con contraseña.

## Productos (precios y medidas de ejemplo — a confirmar)
| Producto | Seña |
|---|---|
| Set x3 ganchos colgables | 10% |
| Parrilla tambor chulengo | 30% |
| Soporte bici pared | 10% |
| Soporte bolsa box pared | 10% |
| Barra ejercicio rack pared | 10% |

Voy a inventar precios, medidas y capacidades razonables; después me pasás los reales.

## Flujo de reserva
1. Calendario mensual desplazable (mes anterior/siguiente). Fechas pasadas y bloqueadas para ese producto aparecen en gris y no se pueden elegir.
2. Modalidad: "Retiro gratis en taller (San Martín)" o "Envío a domicilio (desde $15.000 ARS en AMBA)".
3. "Confirmar reserva" abre un modal resumen: producto, fecha, modalidad, precio, seña a transferir.
4. Botón "Enviar por WhatsApp" abre wa.me/5491165961753 con el mensaje pre-armado.

## Panel /admin
- Ingreso con contraseña simple (validada en el servidor, nunca visible en la web).
- Elegir producto (o "todos"), seleccionar rango de fechas en el calendario, agregar motivo opcional (sin stock / taller lleno).
- Lista de bloqueos activos con opción de eliminarlos.

## Almacenamiento
Uso Lovable Cloud (base de datos) en lugar de almacenamiento local: así los bloqueos que cargues desde tu celular o PC se ven para todos los clientes. Con almacenamiento local solo se verían en tu propio navegador.

## Detalles técnicos
- Tabla `blocked_ranges` (product_id nullable = todos, start_date, end_date, reason). Lectura pública (anon SELECT); escritura solo vía server functions que verifican la sesión de admin.
- Gate de admin: secret `ADMIN_PASSWORD` + `SESSION_SECRET`, comparación timing-safe, sesión cifrada (`useSession`).
- Productos en un módulo estático `src/data/products.ts`.
- Calendario shadcn con `disabled` combinando fechas pasadas + rangos bloqueados.
- Lógica de cálculo de seña y armado del mensaje en funciones puras con tests (seña 10%/30%, texto de WhatsApp).
- head() propio por ruta con títulos y descripciones en español.
