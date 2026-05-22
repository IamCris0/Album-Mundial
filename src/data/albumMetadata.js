export const albumMetadata = {
  title: 'Album Mundial Ammycita',
  officialCollection: 'Panini FIFA World Cup 2026 Official Sticker Collection',
  expectedStickerCount: 980,
  expectedAlbumPages: 112,
  expectedTeams: 48,
  specialStickerCount: 68,
  sources: [
    {
      label: 'Panini official checklist 2026',
      url: 'https://www.panini.es/media/paniniFiles/005461_FIFA_WC_2026_Checklist_all_1-1-2.pdf',
      note: 'Checklist publica indicada como referencia oficial del proyecto.',
    },
    {
      label: 'Scanini - checklist publica de stickers',
      url: 'https://scanini.app/albums/world-cup-2026',
      note: 'Referencia estructurada para 980 stickers: PANINI, FWC y 48 selecciones.',
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
