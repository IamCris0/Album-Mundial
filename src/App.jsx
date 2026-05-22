import { useEffect, useMemo, useState } from 'react';
import { BookHeart, Filter, Heart, RotateCcw, X } from 'lucide-react';
import { albumMetadata } from './data/albumMetadata';
import {
  getAlbumPages,
  getGeneralProgress,
  getProgressBySection,
  getStickers,
  setStickerOwned,
} from './services/stickerService';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import StickerFilters from './components/StickerFilters';
import PageSelector from './components/PageSelector';
import ProgressBySection from './components/ProgressBySection';
import StickerCard from './components/StickerCard';
import { isSupabaseConfigured } from './lib/supabaseClient';

const initialFilters = {
  query: '',
  country: 'all',
  page: 'all',
  section: 'all',
  type: 'all',
  status: 'all',
  verification: 'all',
};

function getUniqueOptions(stickers, key) {
  return [...new Set(stickers.map((sticker) => sticker[key]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function matchesOption(value, filterValue) {
  return filterValue === 'all' || normalizeText(value) === normalizeText(filterValue);
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(() => localStorage.getItem('ammycita-entered') === 'true');
  const [stickers, setStickers] = useState([]);
  const [pages, setPages] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedPage, setSelectedPage] = useState('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const [pageRows, stickerRows] = await Promise.all([getAlbumPages(), getStickers()]);
        setPages(pageRows);
        setStickers(stickerRows);
      } catch (loadError) {
        setError(`Supabase no pudo cargar los datos: ${loadError.message || 'error desconocido'}.`);
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filterOptions = useMemo(
    () => ({
      countries: getUniqueOptions(stickers, 'country'),
      sections: getUniqueOptions(stickers, 'section'),
      types: getUniqueOptions(stickers, 'type'),
      pages,
    }),
    [pages, stickers],
  );

  const selectedPageInfo = useMemo(
    () => pages.find((page) => String(page.page_number) === String(selectedPage)),
    [pages, selectedPage],
  );

  const activeFilters = useMemo(() => {
    const items = [];

    if (filters.query.trim()) items.push({ key: 'query', label: `Búsqueda: ${filters.query}` });
    if (filters.country !== 'all') items.push({ key: 'country', label: `País: ${filters.country}` });
    if (filters.page !== 'all') {
      const page = pages.find((item) => String(item.page_number) === String(filters.page));
      items.push({ key: 'page', label: `Pág. ${filters.page}${page?.title ? ` · ${page.title}` : ''}` });
    }
    if (filters.section !== 'all') items.push({ key: 'section', label: `Sección: ${filters.section}` });
    if (filters.type !== 'all') items.push({ key: 'type', label: `Tipo: ${filters.type}` });
    if (filters.status !== 'all') items.push({ key: 'status', label: filters.status === 'owned' ? 'Conseguidos' : 'Faltantes' });
    if (filters.verification !== 'all') {
      items.push({ key: 'verification', label: filters.verification === 'verified' ? 'Verificados' : 'Pendientes' });
    }
    if (selectedPage !== 'all') {
      items.push({
        key: 'selectedPage',
        label: `Página actual: ${selectedPageInfo?.title || `Pág. ${selectedPage}`}`,
      });
    }

    return items;
  }, [filters, pages, selectedPage, selectedPageInfo]);

  const filteredStickers = useMemo(() => {
    const normalizedQuery = normalizeText(filters.query);

    return stickers.filter((sticker) => {
      const searchText = [sticker.code, sticker.number, sticker.name, sticker.country, sticker.section]
        .filter(Boolean)
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const pageFilter = selectedPage !== 'all' ? selectedPage : filters.page;

      return (
        (!normalizedQuery || searchText.includes(normalizedQuery)) &&
        matchesOption(sticker.country, filters.country) &&
        matchesOption(sticker.section, filters.section) &&
        matchesOption(sticker.type, filters.type) &&
        (pageFilter === 'all' || String(sticker.album_page) === String(pageFilter)) &&
        (filters.status === 'all' ||
          (filters.status === 'owned' && sticker.owned) ||
          (filters.status === 'missing' && !sticker.owned)) &&
        (filters.verification === 'all' ||
          (filters.verification === 'verified' && sticker.verified) ||
          (filters.verification === 'pending' && !sticker.verified))
      );
    });
  }, [filters, selectedPage, stickers]);

  const progress = useMemo(() => getGeneralProgress(stickers), [stickers]);
  const progressBySection = useMemo(() => getProgressBySection(stickers), [stickers]);
  const officialCountLoaded = progress.total === albumMetadata.expectedStickerCount;

  function enterAlbum() {
    localStorage.setItem('ammycita-entered', 'true');
    setHasEntered(true);
  }

  function showWelcomeAgain() {
    localStorage.removeItem('ammycita-entered');
    setHasEntered(false);
  }

  async function toggleSticker(sticker) {
    try {
      setSavingId(sticker.id);
      const nextOwned = !sticker.owned;
      await setStickerOwned(sticker.id, nextOwned);
      setStickers((current) =>
        current.map((item) =>
          item.id === sticker.id ? { ...item, owned: nextOwned, obtained_at: nextOwned ? new Date().toISOString() : null } : item,
        ),
      );
    } catch (saveError) {
      setError('No se pudo guardar el cambio. Intenta otra vez en un momento.');
      console.error(saveError);
    } finally {
      setSavingId('');
    }
  }

  if (!hasEntered) {
    return <WelcomeScreen onEnter={enterAlbum} />;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Regalo especial para Ammy</p>
          <h1>
            Album Mundial Ammycita <span aria-hidden="true">❤️</span>
          </h1>
          <p className="subtitle">
            Un tablero coleccionable para cuidar cada cromo del Mundial 2026, con orden, brillo y cariño.
          </p>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button mobile-filter-button" type="button" onClick={() => setFiltersOpen(true)}>
            <Filter size={18} />
            Filtros
          </button>
          <button className="ghost-button" type="button" onClick={showWelcomeAgain}>
            <BookHeart size={18} />
            Ver portada
          </button>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <section className="notice">
          Supabase aun no esta configurado. La app funciona en modo demo local con datos pendientes, lista para conectar
          cuando agregues <strong>VITE_SUPABASE_URL</strong> y <strong>VITE_SUPABASE_ANON_KEY</strong>.
        </section>
      )}

      {error && <section className="error-box">{error}</section>}

      <Dashboard progress={progress} metadata={albumMetadata} loading={loading} />

      <section className="workspace-grid">
        <aside className={filtersOpen ? 'side-panel open' : 'side-panel'}>
          <div className="mobile-drawer-head">
            <strong>Filtros</strong>
            <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros">
              <X size={18} />
            </button>
          </div>
          <StickerFilters filters={filters} onChange={setFilters} options={filterOptions} activeCount={activeFilters.length} />
          <ProgressBySection items={progressBySection} />
        </aside>
        {filtersOpen && <button className="drawer-backdrop" type="button" aria-label="Cerrar filtros" onClick={() => setFiltersOpen(false)} />}

        <section className="content-panel">
          <PageSelector
            pages={pages}
            selectedPage={selectedPage}
            onSelect={(page) => {
              setSelectedPage(page);
              setFilters((current) => ({ ...current, page: 'all' }));
            }}
          />

          <div className="list-heading">
            <div>
              <p className="eyebrow">Cromos</p>
              <h2>
                {officialCountLoaded
                  ? `${albumMetadata.expectedStickerCount} cromos oficiales cargados`
                  : `${progress.total} cromos cargados`}
              </h2>
              <p className="result-count">
                Mostrando {filteredStickers.length} de {progress.total} cromos
                {selectedPageInfo ? ` · Página actual: ${selectedPageInfo.title}` : ''}
              </p>
            </div>
            <button
              className="icon-text-button"
              type="button"
              onClick={() => {
                setFilters(initialFilters);
                setSelectedPage('all');
              }}
            >
              <RotateCcw size={17} />
              Limpiar filtros
            </button>
          </div>

          {activeFilters.length > 0 && (
            <div className="active-filter-list" aria-label="Filtros activos">
              {activeFilters.map((filter) => (
                <button
                  className="active-filter-chip"
                  key={`${filter.key}-${filter.label}`}
                  type="button"
                  onClick={() => {
                    if (filter.key === 'selectedPage') {
                      setSelectedPage('all');
                    } else {
                      setFilters((current) => ({ ...current, [filter.key]: initialFilters[filter.key] }));
                    }
                  }}
                  title="Quitar filtro"
                >
                  {filter.label}
                  <X size={13} />
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <Heart size={24} />
              <strong>Cargando el álbum de Ammycita...</strong>
              <span>Estamos ordenando los cromos.</span>
            </div>
          ) : filteredStickers.length ? (
            <div className="sticker-grid">
              {filteredStickers.map((sticker) => (
                <StickerCard
                  key={sticker.id}
                  sticker={sticker}
                  disabled={savingId === sticker.id}
                  onToggle={() => toggleSticker(sticker)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={24} />
              <strong>No hay cromos con estos filtros</strong>
              <span>Prueba cambiando la página, la selección o el estado.</span>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
