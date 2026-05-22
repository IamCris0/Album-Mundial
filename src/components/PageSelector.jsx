import { BookOpen } from 'lucide-react';

export default function PageSelector({ pages, selectedPage, onSelect }) {
  return (
    <section className="page-selector" aria-label="Paginas del album">
      <div className="panel-heading horizontal">
        <div>
          <p className="eyebrow">Paginas</p>
          <h2>Secciones del album</h2>
        </div>
        <button
          className={selectedPage === 'all' ? 'page-chip active' : 'page-chip'}
          type="button"
          onClick={() => onSelect('all')}
        >
          Todas
        </button>
      </div>

      <div className="page-chip-list">
        {pages.map((page) => (
          <button
            className={String(selectedPage) === String(page.page_number) ? 'page-chip active' : 'page-chip'}
            type="button"
            key={page.id}
            onClick={() => onSelect(page.page_number)}
            title={page.description}
          >
            <BookOpen size={15} />
            <span>{page.page_number}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
