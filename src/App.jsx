import { useEffect, useMemo, useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';
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
          <h1>Album Mundial Ammycita <span aria-hidden="true">❤️</span></h1>
          <p className="subtitle">Controla los cromos reales del Mundial 2026, sin perder la ternura ni el orden.</p>
        </div>
        <button className="ghost-button" type="button" onClick={showWelcomeAgain}>
          <Heart size={18} />
          Ver bienvenida
        </button>
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
        <aside className="side-panel">
          <StickerFilters filters={filters} onChange={setFilters} options={filterOptions} />
          <ProgressBySection items={progressBySection} />
        </aside>

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

          {loading ? (
            <div className="empty-state">Cargando el album de Ammycita...</div>
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
            <div className="empty-state">No hay cromos con estos filtros</div>
          )}
        </section>
      </section>
    </main>
  );
}
