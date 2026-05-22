import { ArrowDownAZ, ListFilter, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

const sortOptions = {
  alpha: { label: 'A-Z', icon: ArrowDownAZ },
  most: { label: 'Más completas', icon: TrendingUp },
  least: { label: 'Menos completas', icon: TrendingDown },
};

export default function ProgressBySection({ items }) {
  const [sortMode, setSortMode] = useState('alpha');

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortMode === 'most') return b.percent - a.percent || a.section.localeCompare(b.section);
      if (sortMode === 'least') return a.percent - b.percent || a.section.localeCompare(b.section);
      return a.section.localeCompare(b.section);
    });
  }, [items, sortMode]);

  return (
    <section className="progress-section-panel">
      <div className="panel-heading">
        <p className="eyebrow">Selecciones</p>
        <h2>Progreso por sección</h2>
      </div>

      <div className="sort-control" aria-label="Ordenar progreso">
        <ListFilter size={15} />
        {Object.entries(sortOptions).map(([key, option]) => {
          const Icon = option.icon;

          return (
            <button
              className={sortMode === key ? 'sort-chip active' : 'sort-chip'}
              key={key}
              type="button"
              onClick={() => setSortMode(key)}
            >
              <Icon size={14} />
              {option.label}
            </button>
          );
        })}
      </div>

      {sortedItems.length ? (
        <div className="section-progress-list">
          {sortedItems.map((item) => (
            <article className="section-progress" key={item.section}>
              <div className="section-progress-copy">
                <span className="section-avatar">{item.section.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{item.section}</strong>
                  <span>
                    {item.owned}/{item.total} conseguidos
                  </span>
                </div>
                <em>{item.percent}%</em>
              </div>
              <div className="mini-progress" aria-label={`${item.section} ${item.percent}%`}>
                <span style={{ width: `${item.percent}%` }} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="muted-text">Aún no hay cromos cargados para agrupar.</p>
      )}
    </section>
  );
}
