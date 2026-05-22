# Album Mundial Ammycita ❤️

Aplicacion responsive hecha con React, Vite y Supabase para controlar el progreso del album Panini FIFA World Cup 2026. Incluye bienvenida especial para Ammy, dashboard, filtros, paginas del album y marcado persistente de cromos.

## Estado de la checklist

La app esta preparada para 980 cromos, 48 selecciones, 112 paginas y 68 cromos especiales. El seed actual carga 980 registros estructurados:

- 1 cromo Panini.
- 19 cromos FWC / World Cup History.
- 48 selecciones con 20 cromos cada una.

Nota de verificacion: el PDF indicado como referencia oficial publica de Panini (`005461_FIFA_WC_2026_Checklist_all_1-1-2.pdf`) muestra una checklist de 630 items tipo Adrenalyn XL/cartas. Para no mezclar cartas con stickers, el seed de 980 se genero con una checklist publica de stickers y se deja documentada la fuente para futuras actualizaciones.

Fuentes:

- Panini checklist PDF: https://www.panini.es/media/paniniFiles/005461_FIFA_WC_2026_Checklist_all_1-1-2.pdf
- Checklist publica 980 stickers: https://scanini.app/albums/world-cup-2026
- FIFA Panini Collection App: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-panini-collection-app

## Tecnologias

- React + Vite
- Supabase
- CSS responsive mobile-first
- Vercel

## Ejecutar localmente

```bash
npm install
npm run dev
```

Para validar produccion:

```bash
npm run build
npm run preview
```

## Variables de entorno

Crea `.env.local` a partir de `.env.example`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_publica
```

No subas `.env.local` al repositorio.

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor.
3. Ejecuta `supabase/schema.sql`.
4. Ejecuta `supabase/seed.sql` o `supabase/stickers_seed.sql`.
5. Verifica que `stickers` tenga 980 filas y que `PENDING001` no exista.

Consultas utiles:

```sql
select count(*) from public.stickers;
select code, name from public.stickers where code in ('FWC001', 'MEX007');
```

## RLS y progreso

La app funciona como album personal publico sin login usando:

```text
profile_key = 'ammycita'
```

Las politicas RLS permiten al rol anon:

- Leer `album_pages`.
- Leer `stickers`.
- Leer, insertar y actualizar `user_stickers` solo para `profile_key = 'ammycita'`.

El marcado usa `upsert` con `unique(profile_key, sticker_id)`, por lo que el mismo cromo se marca y desmarca sin duplicados.

## Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. En Vercel, crea un nuevo proyecto desde ese repositorio.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Agrega estas variables en Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Despliega.

## Actualizar la checklist

Si Panini publica cambios:

1. Descarga la nueva checklist oficial.
2. Compara cantidad total, codigos y nombres contra `supabase/seed.sql`.
3. Regenera los inserts manteniendo `code` unico.
4. Ejecuta de nuevo el seed. Usa `on conflict (code) do update` para conservar IDs cuando sea posible.
5. Revisa que el conteo siga siendo correcto:

```sql
select count(*) from public.stickers;
select section, count(*) from public.stickers group by section order by section;
```

No agregues cromos inventados. Si un dato no esta confirmado, dejalo fuera del seed oficial o marcalo como `verified = false` en un seed separado de revision.
