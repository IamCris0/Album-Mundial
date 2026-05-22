# Album Mundial Ammycita ❤️

Aplicacion responsive hecha con React, Vite y Supabase para controlar los cromos del album Panini FIFA World Cup 2026. El proyecto esta pensado como un regalo para Ammy: bonito, futbolero, romantico y listo para desplegar en Vercel.

## Estado de los datos

La app prioriza exactitud sobre cantidad. No incluye una checklist inventada. La semilla crea 112 paginas pendientes y un cromo pendiente de verificacion para validar el flujo.

Fuentes publicas revisadas para los metadatos generales:

- Panini Alemania: album oficial con 112 paginas y espacio para 980 cromos.
  https://www.panini.de/shp_deu_de/offizielle-fifa-world-cup-2026-stickerkollektion-album-005460ad-de01.html
- Panini Espana: producto oficial que reporta 980 cromos, 112 paginas y 68 cromos especiales.
  https://www.panini.es/shp_esp_es/fifa-world-cup-2026-official-sticker-collection-treasure-box-colecci-n-oficial-panini-005460cofecw-es01.html
- FIFA: referencia publica de la coleccion digital Panini para FIFA World Cup 2026.
  https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-panini-collection-app

No agregues jugadores, selecciones, codigos o secciones sin una fuente verificable.

## Tecnologias

- React + Vite
- Supabase
- CSS responsive mobile-first
- Vercel
- GitHub

## Instalacion local

```bash
npm install
npm run dev
```

Luego abre la URL que muestre Vite.

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor.
3. Ejecuta `supabase/schema.sql`.
4. Ejecuta `supabase/seed.sql`.
5. Copia la URL del proyecto y la anon public key.
6. Crea `.env.local` usando `.env.example`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_publica
```

La app usa esas variables desde `src/lib/supabaseClient.js`.

## Ejecutar sin Supabase

Si no existen variables de entorno, la app entra en modo demo local. En ese modo usa datos pendientes desde `src/data/albumMetadata.js` y guarda marcados en `localStorage`.

## Agregar cromos reales

Agrega filas en la tabla `stickers` solo cuando tengas una fuente publica o autorizada:

```sql
insert into public.stickers
  (code, number, album_page, section, country, name, type, rarity, verified, source)
values
  ('CODIGO_REAL', 'CODIGO_REAL', 10, 'Seccion verificada', 'Pais verificado', 'Nombre verificado', 'Jugador', 'Base', true, 'https://fuente-verificable');
```

Si el dato no esta confirmado, usa `verified = false` y deja claro que esta pendiente.

## Seguridad Supabase

El esquema activa RLS. La version inicial funciona como album personal con `profile_key = 'ammycita-single-user'`. Para multiples usuarios, agrega autenticacion, relaciona `user_stickers` con `auth.users` y cambia las politicas para usar `auth.uid()`.

## Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. Entra a Vercel y elige **Add New Project**.
3. Conecta el repositorio.
4. Usa el framework preset **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. En **Environment Variables**, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
8. Despliega.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Nota importante

Este repositorio esta preparado para crecer conforme se publique o confirme la checklist real del album Panini FIFA World Cup 2026. Mantener la base incompleta pero verificada es mejor que completar 980 cromos con datos inventados.
