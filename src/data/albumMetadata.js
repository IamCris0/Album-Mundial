export const albumMetadata = {
  title: 'Album Mundial Ammycita',
  officialCollection: 'Panini FIFA World Cup 2026 Official Sticker Collection',
  expectedStickerCount: 980,
  expectedAlbumPages: 112,
  expectedTeams: 48,
  specialStickerCount: 68,
  sources: [
    {
      label: 'Panini Alemania - album oficial',
      url: 'https://www.panini.de/shp_deu_de/offizielle-fifa-world-cup-2026-stickerkollektion-album-005460ad-de01.html',
      note: 'Producto oficial: 112 paginas y espacio para 980 cromos.',
    },
    {
      label: 'Panini Espana - Treasure Box',
      url: 'https://www.panini.es/shp_esp_es/fifa-world-cup-2026-official-sticker-collection-treasure-box-colecci-n-oficial-panini-005460cofecw-es01.html',
      note: 'Producto oficial: 980 cromos, 112 paginas y 68 cromos especiales.',
    },
    {
      label: 'FIFA - Panini Collection App',
      url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-panini-collection-app',
      note: 'FIFA confirma la coleccion digital vinculada al Mundial 2026.',
    },
  ],
};

export const fallbackAlbumPages = Array.from({ length: albumMetadata.expectedAlbumPages }, (_, index) => {
  const pageNumber = index + 1;

  return {
    id: `fallback-page-${pageNumber}`,
    page_number: pageNumber,
    title: `Pagina ${pageNumber}`,
    section: 'Pendiente de cargar',
    description:
      'Pagina reservada para completar con la checklist real verificada del album Panini FIFA World Cup 2026.',
    is_pending: true,
  };
});

export const fallbackStickers = [
  {
    id: 'pending-sticker-001',
    code: 'PENDING001',
    number: '',
    album_page: null,
    section: 'Pendiente',
    country: '',
    name: 'Cromo pendiente de verificacion',
    type: 'Pendiente',
    rarity: '',
    verified: false,
    source: '',
    image_url: '',
  },
];
