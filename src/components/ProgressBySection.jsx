export default function ProgressBySection({ items }) {
  return (
    <section className="progress-section-panel">
      <div className="panel-heading">
        <p className="eyebrow">Selecciones</p>
        <h2>Progreso por seccion</h2>
      </div>

      {items.length ? (
        <div className="section-progress-list">
          {items.map((item) => (
            <article className="section-progress" key={item.section}>
              <div>
                <strong>{item.section}</strong>
                <span>
                  {item.owned}/{item.total} conseguidos
                </span>
              </div>
              <div className="mini-progress" aria-label={`${item.section} ${item.percent}%`}>
                <span style={{ width: `${item.percent}%` }} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="muted-text">Aun no hay cromos cargados para agrupar.</p>
      )}
    </section>
  );
}
