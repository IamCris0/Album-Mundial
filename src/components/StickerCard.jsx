import { Check, ExternalLink, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';

export default function StickerCard({ sticker, onToggle, disabled }) {
  const hasSourceUrl = /^https?:\/\//i.test(sticker.source || '');
  const isSpecial = ['Especial', 'Escudo'].includes(sticker.type) || sticker.rarity === 'Foil';
  const sectionText = [sticker.country, sticker.section].filter(Boolean).join(' · ') || 'Sección pendiente';
  const initials = (sticker.country || sticker.section || 'FWC').slice(0, 3).toUpperCase();

  return (
    <article className={`sticker-card ${sticker.owned ? 'owned' : ''} ${isSpecial ? 'special' : ''}`}>
      <div className="sticker-card-top">
        <span className="sticker-code">{sticker.code || 'Sin código'}</span>
        <span className={sticker.verified ? 'verified-pill' : 'pending-pill'}>
          {sticker.verified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
          {sticker.verified ? 'Verificado' : 'Pendiente'}
        </span>
      </div>

      <div className="sticker-art" aria-hidden="true">
        {sticker.image_url ? (
          <img src={sticker.image_url} alt="" />
        ) : (
          <div className="sticker-placeholder">
            {isSpecial && <Sparkles size={22} />}
            <span>{initials}</span>
            <small>{sticker.type || 'Cromo'}</small>
          </div>
        )}
      </div>

      <div className="sticker-body">
        <h3>{sticker.name}</h3>
        <p>{sectionText}</p>
      </div>

      <dl className="sticker-meta">
        <div>
          <dt>Página</dt>
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
        {hasSourceUrl ? (
          <a className="source-link" href={sticker.source} target="_blank" rel="noreferrer">
            Fuente
            <ExternalLink size={14} />
          </a>
        ) : sticker.source ? (
          <span className="source-link" title={sticker.source}>
            {sticker.source}
          </span>
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
