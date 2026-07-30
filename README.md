# Fit for 75

Tracker de un reto tipo "75 Hard" a 75 días, bilingüe (ES/EN), con fotos, agua, peso, dieta,
lectura y respaldo.

## Stack

- Next.js 14 (App Router) + TypeScript
- Neon (PostgreSQL) para persistencia
- Cloudflare R2 (S3-compatible) para almacenamiento de fotos
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
| `R2_ACCOUNT_ID` | ID de cuenta de Cloudflare. |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Credenciales del token API R2 (con permisos de lectura/escritura sobre el bucket). |
| `R2_BUCKET_NAME` | Nombre del bucket R2 donde se guardan las fotos. |
| `R2_PUBLIC_URL` | URL pública del bucket (dominio `r2.dev` o dominio personalizado conectado al bucket), sin `/` al final. |
| `APP_PASSCODE` | Código de acceso simple. Si se deja vacío, la app queda sin autenticación (útil solo en local). |

## Configurar Neon

1. Crea un proyecto en [neon.tech](https://neon.tech).
2. Copia la cadena de conexión (`DATABASE_URL`) desde el dashboard.
3. Corre `npm run migrate` (local o vía `railway run npm run migrate` una vez desplegado) para crear las tablas `challenge_days` y `app_settings`.

## Configurar Cloudflare R2

1. Crea un bucket R2 en el dashboard de Cloudflare.
2. Habilita acceso público (dominio `r2.dev` o conecta un dominio propio) y copia esa URL como `R2_PUBLIC_URL`.
3. Crea un token de API R2 con permiso de lectura/escritura sobre el bucket → usa el Access Key ID / Secret como `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`.
4. El `R2_ACCOUNT_ID` está en la URL del dashboard de Cloudflare o en la sección R2 → Overview.

Las fotos se comprimen en el cliente (máx. ~800px de ancho, JPEG calidad 0.7) antes de subirse directamente al bucket mediante URLs firmadas (presigned), sin pasar por el servidor de Next.js.

## Deploy en Railway

1. Crea un nuevo proyecto en Railway y conéctalo a este repositorio.
2. Railway detecta Next.js automáticamente (Nixpacks) — no se necesita configuración adicional.
3. Configura las variables de entorno de la tabla de arriba en el servicio de Railway.
4. Después del primer deploy, corre la migración una vez:

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

Desde la pantalla de Progreso puedes exportar todo el progreso como JSON descargable, o importar un JSON para restaurar (esto reemplaza los datos actuales).
