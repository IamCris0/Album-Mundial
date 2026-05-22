import { Search } from 'lucide-react';

export default function StickerFilters({ filters, onChange, options }) {
  function updateFilter(key, value) {
    onChange((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="filters-panel" aria-label="Filtros de cromos">
      <div className="panel-heading">
        <p className="eyebrow">Filtros</p>
        <h2>Encontrar cromos</h2>
      </div>

      <label className="search-box">
        <Search size={17} />
        <input
          value={filters.query}
          onChange={(event) => updateFilter('query', event.target.value)}
          placeholder="Nombre, codigo o seccion"
        />
      </label>

      <label>
        Seleccion o pais
        <select value={filters.country} onChange={(event) => updateFilter('country', event.target.value)}>
          <option value="all">Todas</option>
          {options.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>

      <label>
        Pagina
        <select value={filters.page} onChange={(event) => updateFilter('page', event.target.value)}>
          <option value="all">Todas</option>
          {options.pages.map((page) => (
            <option key={page.id} value={page.page_number}>
              Pagina {page.page_number}
            </option>
          ))}
        </select>
      </label>

      <label>
        Seccion
        <select value={filters.section} onChange={(event) => updateFilter('section', event.target.value)}>
          <option value="all">Todas</option>
          {options.sections.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </label>

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
        Verificacion
        <select value={filters.verification} onChange={(event) => updateFilter('verification', event.target.value)}>
          <option value="all">Todos</option>
          <option value="verified">Verificados</option>
          <option value="pending">Pendientes</option>
        </select>
      </label>
    </section>
  );
}
