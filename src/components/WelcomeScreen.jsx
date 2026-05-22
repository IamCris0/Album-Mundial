import { BookOpen, Heart, Sparkles, Trophy } from 'lucide-react';

export default function WelcomeScreen({ onEnter }) {
  return (
    <main className="welcome-screen">
      <section className="welcome-stage" aria-labelledby="welcome-title">
        <div className="album-book" aria-hidden="true">
          <div className="album-page left-page">
            <span />
            <span />
            <span />
          </div>
          <div className="album-cover">
            <div className="cover-shine" />
            <div className="cover-badge">
              <Trophy size={18} />
              Mundial 2026
            </div>
            <div className="cover-ball">
              <Sparkles size={34} />
            </div>
            <div className="cover-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="album-page right-page">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="welcome-copy">
          <div className="welcome-badge">
            <BookOpen size={18} />
            Portada especial
          </div>
          <h1 id="welcome-title">
            Album Mundial Ammycita <span aria-hidden="true">❤️</span>
          </h1>
          <p>Un álbum hecho con cariño para marcar cada cromo del Mundial 2026.</p>
        </div>

        <button className="primary-button" type="button" onClick={onEnter}>
          <Heart size={19} />
          Entrar al álbum
        </button>
      </section>
    </main>
  );
}
