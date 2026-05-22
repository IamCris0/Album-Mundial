import { Check, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function StickerCard({ sticker, onToggle, disabled }) {
  return (
    <article className={sticker.owned ? 'sticker-card owned' : 'sticker-card'}>
      <div className="sticker-card-top">
        <span className="sticker-code">{sticker.code || 'Sin codigo'}</span>
        <span className={sticker.verified ? 'verified-pill' : 'pending-pill'}>
          {sticker.verified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
          {sticker.verified ? 'Verificado' : 'Pendiente'}
        </span>
      </div>

      <div className="sticker-art" aria-hidden="true">
        {sticker.image_url ? <img src={sticker.image_url} alt="" /> : <span>{sticker.country?.slice(0, 3) || 'FWC'}</span>}
      </div>

      <div className="sticker-body">
        <h3>{sticker.name}</h3>
        <p>{[sticker.country, sticker.section].filter(Boolean).join(' • ') || 'Seccion pendiente'}</p>
      </div>

      <dl className="sticker-meta">
        <div>
          <dt>Pagina</dt>
          <dd>{sticker.album_page || 'Pendiente'}</dd>
        </div>
        <div>
          <dt>Tipo</dt>
          <dd>{sticker.type || 'Pendiente'}</dd>
        </div>
        <div>
          <dt>Rareza</dt>
          <dd>{sticker.rarity || 'Sin dato'}</dd>
        </div>
      </dl>

      <div className="sticker-actions">
        {sticker.source ? (
          <a className="source-link" href={sticker.source} target="_blank" rel="noreferrer">
            Fuente
            <ExternalLink size={14} />
          </a>
        ) : (
          <span className="source-link disabled">Sin fuente</span>
        )}

        <button className={sticker.owned ? 'owned-button active' : 'owned-button'} type="button" onClick={onToggle} disabled={disabled}>
          <Check size={16} />
          {sticker.owned ? 'Conseguido' : 'Marcar'}
        </button>
      </div>
    </article>
  );
}
