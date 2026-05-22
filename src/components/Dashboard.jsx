import { Album, CheckCircle2, CircleDashed, Percent, Sparkles } from 'lucide-react';

function StatCard({ icon: Icon, label, value, helper, tone }) {
  return (
    <article className={`stat-card ${tone || ''}`}>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {helper && <span>{helper}</span>}
      </div>
    </article>
  );
}

export default function Dashboard({ progress, metadata, loading }) {
  const percent = loading ? 0 : progress.percent;
  const loadedTotal = loading ? '...' : progress.total.toLocaleString('es-EC');

  return (
    <section className="dashboard">
      <div className="summary-card">
        <div>
          <p className="eyebrow">Resumen de Ammycita</p>
          <h2>{loadedTotal} cromos oficiales cargados</h2>
          <p>
            {loading
              ? 'Preparando el álbum...'
              : `${progress.owned} conseguidos, ${progress.missing} faltantes y ${percent}% completado.`}
          </p>
        </div>
        <div className="summary-medal" aria-hidden="true">
          <Sparkles size={28} />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Album}
          label="Cromos registrados"
          value={loadedTotal}
          helper={`Álbum esperado: ${metadata.expectedStickerCount}`}
          tone="navy"
        />
        <StatCard icon={CheckCircle2} label="Conseguidos" value={loading ? '...' : progress.owned} tone="green" />
        <StatCard icon={CircleDashed} label="Faltantes" value={loading ? '...' : progress.missing} tone="coral" />
        <StatCard icon={Percent} label="Completado" value={`${percent}%`} tone="gold" />
      </div>

      <div className="progress-card">
        <div>
          <p className="eyebrow">Progreso general</p>
          <h2>Llevas {percent}% completado</h2>
        </div>
        <div className="progress-track" aria-label={`Progreso general ${percent}%`}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <p className="source-note">
          Colección organizada en {metadata.expectedAlbumPages} páginas, {metadata.expectedStickerCount} cromos y{' '}
          {metadata.specialStickerCount} cromos especiales.
        </p>
      </div>
    </section>
  );
}
