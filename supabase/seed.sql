-- Semilla minima y honesta.
-- No incluye una checklist completa porque debe cargarse solo con cromos reales verificados.

insert into public.album_pages (page_number, title, section, description)
select
  page_number,
  'Pagina ' || page_number,
  'Pendiente de cargar',
  'Pagina reservada para completar con la checklist real verificada del album Panini FIFA World Cup 2026.'
from generate_series(1, 112) as page_number
on conflict (page_number) do nothing;

insert into public.stickers
  (code, number, album_page, section, country, name, type, rarity, verified, source)
values
  (
    'PENDING001',
    '',
    null,
    'Pendiente',
    '',
    'Cromo pendiente de verificacion',
    'Pendiente',
    '',
    false,
    ''
  )
on conflict (code) do nothing;

-- Cuando tengas un cromo real confirmado, usa un insert como este:
-- insert into public.stickers
--   (code, number, album_page, section, country, name, type, rarity, verified, source)
-- values
--   ('CODIGO_REAL', 'CODIGO_REAL', 10, 'Seleccion verificada', 'Pais verificado', 'Nombre verificado', 'Jugador', 'Base', true, 'https://fuente-publica-verificable');
