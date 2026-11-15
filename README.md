# Herreriapesce

Crea una aplicación web moderna, robusta y con estética industrial (tonos negro, gris acero, naranja fuego y blanco) para 'Herrería Pesce', un taller de herrería artesanal ubicado en San Martín, Buenos Aires.

La web debe tener: 1. Catálogo de productos con tarjetas que muestren foto, medidas, capacidad de carga/material, precio y porcentaje de seña requerida (ej. 10% para accesorios, 30% para parrillas):

Set x3 ganchos colgables

Parrilla tambor chulengo

Soporte Bici pared

Soporte Bolsa Box pared

Barra Ejercicio rack pared 2. Flujo de reserva inteligente: Al seleccionar un producto, el usuario debe elegir en un calendario mensual desplazable la fecha de entrega/retiro deseada (mostrando en gris/bloqueadas las fechas sin disponibilidad). Luego elige entre 'Retiro gratis en taller (San Martín)' o 'Envío a domicilio (Desde $15.000 ARS en AMBA)'. 3. Cierre por WhatsApp: Al confirmar la reserva, en lugar de cobrar con tarjeta, debe abrir un modal resumen y un botón que redirija a WhatsApp (+54 9 11 6596-1753) con un mensaje pre-armado detallando el producto, la fecha elegida, la modalidad de entrega y el monto de la seña a transferir. 4. Panel de Administración simple (ruta /admin): Una vista oculta con contraseña simple donde yo pueda seleccionar un producto y bloquear un rango de fechas en el calendario cuando me quede sin stock o tenga el taller lleno de pedidos, guardando el estado en almacenamiento local o base de datos."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ed4cef1-e4b0-43e2-b68a-0dbf829cb9da).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Deploy to Cloudflare

The app is built as a Cloudflare Worker with Nitro. In Cloudflare Workers Builds, connect this repository and use:

- Build command: `npm run build`
- Deploy command: `npx nitro deploy --prebuilt`

Nitro generates the Worker configuration at `.output/server/wrangler.json`. Configure these build variables for the browser bundle: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Add these runtime variables/secrets to the Worker: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `SESSION_SECRET`. Keep secret values in Cloudflare, not in Git.
