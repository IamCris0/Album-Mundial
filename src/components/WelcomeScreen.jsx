import { Heart, Trophy } from 'lucide-react';

export default function WelcomeScreen({ onEnter }) {
  return (
    <main className="welcome-screen">
      <section className="welcome-hero" aria-labelledby="welcome-title">
        <div className="welcome-badge">
          <Trophy size={18} />
          Mundial 2026
        </div>
        <h1 id="welcome-title">Album Mundial Ammycita <span aria-hidden="true">❤️</span></h1>
        <p>Un album hecho con carinho para marcar cada cromo del Mundial 2026.</p>
        <button className="primary-button" type="button" onClick={onEnter}>
          <Heart size={19} />
          Entrar al album
        </button>
      </section>
    </main>
  );
}
