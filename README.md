# Fit for 75

Tracker de un reto tipo "75 Hard" a 75 días, bilingüe (ES/EN), con fotos, agua, peso, dieta,
lectura y respaldo.

## Stack

- Next.js 14 (App Router) + TypeScript
- Neon (PostgreSQL) para persistencia — datos y fotos en un solo lugar
- Tailwind CSS
- lucide-react
- recharts
- Deploy en Railway

## Configuración local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env.local` y rellena las variables (ver abajo).

3. Aplica el esquema de base de datos:

   ```bash
   npm run migrate
   ```

4. Arranca en desarrollo:

   ```bash
   npm run dev
   ```

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión de Neon (Postgres). Requiere `sslmode=require`. |
| `APP_PASSCODE` | Código de acceso simple. Si se deja vacío, la app queda sin autenticación (útil solo en local). |

## Configurar Neon

1. Crea un proyecto en [neon.tech](https://neon.tech).
2. Copia la cadena de conexión (`DATABASE_URL`) desde el dashboard.
3. Crea las tablas `challenge_days` y `app_settings` corriendo `db/schema.sql` — ya sea con `npm run migrate` (local, o vía `railway run npm run migrate` una vez desplegado) o pegando el contenido de `db/schema.sql` en el **SQL Editor** de Neon.

## Fotos

Las fotos se comprimen en el navegador (máx. ~800px de ancho, JPEG calidad 0.7) y se guardan directamente en Neon como texto base64 en las columnas `*_photo_url` — no se usa ningún servicio de almacenamiento externo. Con la compresión, cada foto pesa entre 50 y 200 KB, así que los 75 días completos (4 fotos/día) ocupan unos pocos MB, muy por debajo del límite gratuito de Neon.

## Deploy en Railway

1. Crea un nuevo proyecto en Railway y conéctalo a este repositorio.
2. Railway detecta Next.js automáticamente (Nixpacks) — no se necesita configuración adicional.
3. Configura `DATABASE_URL` y `APP_PASSCODE` en las variables del servicio de Railway.
4. Después del primer deploy, corre la migración una vez (o ya la habrás corrido manualmente en el SQL Editor de Neon):

   ```bash
   railway run npm run migrate
   ```

5. Listo — la app queda disponible en la URL pública de Railway, protegida por `APP_PASSCODE`.

## Reglas de negocio

- Un día se marca **cumplido** cuando: entrenamiento interior + exterior, dieta, lectura, agua ≥ 3.8 L, las 3 fotos de comida y la foto de progreso están completos.
- La **racha** cuenta días consecutivos cumplidos desde el día 1.
- El usuario no puede navegar a un día futuro más allá de `racha + 1`; los días bloqueados muestran un candado. Sí se puede regresar y editar días anteriores libremente.
- El peso es informativo (no cuenta para "día cumplido") y muestra tendencia contra el registro anterior más reciente.
- Los cambios se guardan con debounce (~400ms) para no saturar la base de datos.

## Respaldo

Desde la pantalla de Progreso puedes exportar todo el progreso como JSON descargable (incluye las fotos en base64), o importar un JSON para restaurar (esto reemplaza los datos actuales).
