import { BadgeCheck, Flag, Layers, Search, Trophy } from 'lucide-react';

export default function StickerFilters({ filters, onChange, options, activeCount = 0 }) {
  function updateFilter(key, value) {
    onChange((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="filters-panel" aria-label="Filtros de cromos">
      <div className="panel-heading filters-heading">
        <div>
          <p className="eyebrow">Filtros</p>
          <h2>Encontrar cromos</h2>
        </div>
        <span className="filter-count">{activeCount} activos</span>
      </div>

      <label className="search-box">
        <Search size={17} />
        <input
          value={filters.query}
          onChange={(event) => updateFilter('query', event.target.value)}
          placeholder="Nombre, código o sección"
        />
      </label>

      <div className="filter-group">
        <span className="filter-group-title">
          <Flag size={15} />
          Selección
        </span>
        <label>
          País
          <select value={filters.country} onChange={(event) => updateFilter('country', event.target.value)}>
            <option value="all">Todas</option>
            {options.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-group">
        <span className="filter-group-title">
          <Layers size={15} />
          Ubicación
        </span>
        <label>
          Página
          <select value={filters.page} onChange={(event) => updateFilter('page', event.target.value)}>
            <option value="all">Todas</option>
            {options.pages.map((page) => (
              <option key={page.id} value={page.page_number}>
                Pág. {page.page_number} · {page.title || page.section || 'Sin título'}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sección
          <select value={filters.section} onChange={(event) => updateFilter('section', event.target.value)}>
            <option value="all">Todas</option>
            {options.sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-group">
        <span className="filter-group-title">
          <Trophy size={15} />
          Cromo
        </span>
        <label>
          Tipo
          <select value={filters.type} onChange={(event) => updateFilter('type', event.target.value)}>
            <option value="all">Todos</option>
            {options.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Estado
          <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
            <option value="all">Todos</option>
            <option value="owned">Conseguidos</option>
            <option value="missing">Faltantes</option>
          </select>
        </label>

        <label>
          Verificación
          <select value={filters.verification} onChange={(event) => updateFilter('verification', event.target.value)}>
            <option value="all">Todos</option>
            <option value="verified">Verificados</option>
            <option value="pending">Pendientes</option>
          </select>
        </label>
      </div>

      <div className="verified-note">
        <BadgeCheck size={16} />
        Datos cargados desde checklist verificada.
      </div>
    </section>
  );
}
