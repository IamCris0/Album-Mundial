import { Album, CheckCircle2, CircleDashed, Percent } from 'lucide-react';

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <article className="stat-card">
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

  return (
    <section className="dashboard">
      <div className="stats-grid">
        <StatCard
          icon={Album}
          label="Cromos registrados"
          value={loading ? '...' : progress.total}
          helper={`Album oficial esperado: ${metadata.expectedStickerCount}`}
        />
        <StatCard icon={CheckCircle2} label="Conseguidos" value={loading ? '...' : progress.owned} />
        <StatCard icon={CircleDashed} label="Faltantes" value={loading ? '...' : progress.missing} />
        <StatCard icon={Percent} label="Completado" value={`${percent}%`} />
      </div>

      <div className="progress-card">
        <div>
          <p className="eyebrow">Progreso general</p>
          <h2>{percent}% del album registrado</h2>
        </div>
        <div className="progress-track" aria-label={`Progreso general ${percent}%`}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <p className="source-note">
          Referencia verificada: {metadata.expectedAlbumPages} paginas, {metadata.expectedStickerCount} cromos y{' '}
          {metadata.specialStickerCount} cromos especiales reportados por tiendas oficiales Panini.
        </p>
      </div>
    </section>
  );
}
