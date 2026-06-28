import type { PropsWithChildren } from 'react';
import { Button } from './Button';

interface LayoutProps {
  activeView: string;
  onHome: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

export function Layout({ activeView, children, onHome, onProgress, onSettings }: PropsWithChildren<LayoutProps>) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="skip-link" href="#main">
          Przejdź do treści głównej
        </a>
        <nav aria-label="Główna nawigacja" className="top-nav">
          <span className="brand">A11yFirst Lab</span>
          <div className="nav-actions">
            <Button variant={activeView === 'home' ? 'primary' : 'text'} onClick={onHome}>
              Start
            </Button>
            <Button variant={activeView === 'progress' ? 'primary' : 'text'} onClick={onProgress}>
              Postęp
            </Button>
            <Button variant={activeView === 'settings' ? 'primary' : 'text'} onClick={onSettings}>
              Ustawienia
            </Button>
          </div>
        </nav>
      </header>
      <main className="main" id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <p>Postęp jest zapisywany tylko lokalnie w tej przeglądarce.</p>
      </footer>
    </div>
  );
}
