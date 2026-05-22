import { BookOpen, LayoutGrid } from 'lucide-react';

export default function PageSelector({ pages, selectedPage, onSelect }) {
  return (
    <section className="page-selector" aria-label="Páginas del álbum">
      <div className="panel-heading horizontal">
        <div>
          <p className="eyebrow">Páginas</p>
          <h2>Navega el álbum</h2>
        </div>
        <button
          className={selectedPage === 'all' ? 'page-card all-pages active' : 'page-card all-pages'}
          type="button"
          onClick={() => onSelect('all')}
          title="Mostrar todos los cromos"
        >
          <LayoutGrid size={16} />
          <span>Todas</span>
        </button>
      </div>

      <div className="page-card-list">
        {pages.map((page) => (
          <button
            className={String(selectedPage) === String(page.page_number) ? 'page-card active' : 'page-card'}
            type="button"
            key={page.id}
            onClick={() => onSelect(page.page_number)}
            title={`Pág. ${page.page_number} · ${page.title || page.section || 'Sin título'}`}
          >
            <BookOpen size={16} />
            <span className="page-number">Pág. {page.page_number}</span>
            <span className="page-title">{page.title || page.section || 'Sin título'}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
