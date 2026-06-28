import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ExerciseForm } from '../components/ExerciseForm';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { ProgressSummary } from '../components/ProgressSummary';
import { exercises } from '../data/exercises';
import {
  checkAnswer,
  createSession,
  getExercisesForMode,
  getRepeatExercises,
  levelLabels,
  modeLabels
} from '../games/gameEngine';
import {
  createEmptyProgress,
  getProgress,
  recordAnswer,
  resetProgress,
  saveProgress,
  updateSettings
} from '../progress/progressStore';
import type {
  AnswerFeedback,
  AnswerResult,
  Exercise,
  GameSession,
  SupportedGameMode,
  UserProgress
} from '../types/exercise';

type View = 'home' | 'game' | 'summary' | 'progress' | 'settings';

export function App() {
  const initialProgress = useMemo(() => getProgress(), []);
  const [view, setView] = useState<View>('home');
  const [progress, setProgress] = useState<UserProgress>(initialProgress.progress);
  const [storageMessage, setStorageMessage] = useState<string | undefined>(initialProgress.message);
  const [selectedMode, setSelectedMode] = useState<SupportedGameMode>(progress.lastMode ?? 'wcag-detective');
  const [session, setSession] = useState<GameSession | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', progress.settings.reduceMotion);
    document.documentElement.classList.toggle('high-contrast', progress.settings.highContrast);
    document.documentElement.classList.toggle('large-spacing', progress.settings.largeSpacing);
  }, [progress.settings]);

  const currentExercises = useMemo(() => {
    if (!session) {
      return [];
    }
    return session.exerciseIds
      .map((id) => exercises.find((exercise) => exercise.id === id))
      .filter((exercise): exercise is Exercise => Boolean(exercise));
  }, [session]);

  const currentExercise = session ? currentExercises[session.currentIndex] : undefined;

  function persistProgress(nextProgress: UserProgress) {
    setProgress(nextProgress);
    const saved = saveProgress(nextProgress);
    setStorageMessage(saved.ok ? undefined : saved.message);
  }

  function startMode(mode: SupportedGameMode, startExerciseId?: string) {
    const modeExercises = getExercisesForMode(exercises, mode);
    setSelectedMode(mode);
    setSession(createSession(mode, modeExercises, false, startExerciseId));
    setFeedback(null);
    setView('game');
  }

  function continueSession() {
    if (progress.lastMode && progress.lastExerciseId) {
      startMode(progress.lastMode, progress.lastExerciseId);
    }
  }

  function startRepeatIncorrect() {
    const repeatExercises = getRepeatExercises(exercises, progress);
    if (repeatExercises.length === 0) {
      setStatusMessage('Nie masz jeszcze błędnych odpowiedzi do powtórzenia.');
      return;
    }

    setSelectedMode(repeatExercises[0].mode);
    setSession(createSession(repeatExercises[0].mode, repeatExercises, true));
    setFeedback(null);
    setView('game');
  }

  function handleAnswer(selectedAnswerId: string | boolean) {
    if (!currentExercise || !session) {
      return;
    }

    const previousAttempts = progress.resultsByExerciseId[currentExercise.id]?.attempts ?? 0;
    const nextFeedback = checkAnswer(currentExercise, selectedAnswerId, previousAttempts + 1);
    const nextProgress = recordAnswer(progress, nextFeedback.result, currentExercise);
    const nextSession: GameSession = {
      ...session,
      results: [...session.results, nextFeedback.result]
    };

    setSession(nextSession);
    setFeedback(nextFeedback);
    persistProgress(nextProgress);
  }

  function goToNextQuestion() {
    if (!session || currentExercises.length === 0) {
      setView('summary');
      return;
    }

    const nextIndex = session.currentIndex + 1;
    setFeedback(null);

    if (nextIndex >= currentExercises.length) {
      setSession({ ...session, completedAt: new Date().toISOString() });
      setView('summary');
      return;
    }

    setSession({ ...session, currentIndex: nextIndex });
  }

  function skipQuestion() {
    goToNextQuestion();
  }

  function finishSession() {
    if (session) {
      setSession({ ...session, completedAt: new Date().toISOString() });
    }
    setView('summary');
  }

  function handleResetConfirmed() {
    const emptyProgress = resetProgress();
    setProgress(emptyProgress);
    setSession(null);
    setFeedback(null);
    setResetDialogOpen(false);
    setStatusMessage('Postęp został usunięty.');
    setView('home');
  }

  function handleSettingsChange(nextSettings: UserProgress['settings']) {
    persistProgress(updateSettings(progress, nextSettings));
  }

  return (
    <Layout
      activeView={view}
      onHome={() => setView('home')}
      onProgress={() => setView('progress')}
      onSettings={() => setView('settings')}
    >
      <div aria-live="polite" className="sr-only" role="status">
        {statusMessage}
      </div>
      {storageMessage ? (
        <p className="notice" role="status">
          {storageMessage}
        </p>
      ) : null}
      {view === 'home' ? (
        <HomeView
          hasProgress={Boolean(progress.lastMode && progress.lastExerciseId)}
          onContinue={continueSession}
          onOpenProgress={() => setView('progress')}
          onOpenSettings={() => setView('settings')}
          onRepeatIncorrect={startRepeatIncorrect}
          onSelectMode={setSelectedMode}
          onStart={() => startMode(selectedMode)}
          selectedMode={selectedMode}
        />
      ) : null}
      {view === 'game' && session && currentExercise ? (
        <GameView
          currentExercise={currentExercise}
          currentIndex={session.currentIndex}
          feedback={feedback}
          onAnswer={handleAnswer}
          onFinish={finishSession}
          onNext={goToNextQuestion}
          onSkip={skipQuestion}
          session={session}
          showWcagHints={progress.settings.showWcagHints}
          total={currentExercises.length}
        />
      ) : null}
      {view === 'summary' ? (
        <SummaryView
          onHome={() => setView('home')}
          onRepeatIncorrect={startRepeatIncorrect}
          progress={progress}
          results={session?.results ?? []}
        />
      ) : null}
      {view === 'progress' ? (
        <ProgressView
          onRepeatIncorrect={startRepeatIncorrect}
          onReset={() => setResetDialogOpen(true)}
          progress={progress}
        />
      ) : null}
      {view === 'settings' ? (
        <SettingsView
          onReset={() => handleSettingsChange(createEmptyProgress().settings)}
          onSettingsChange={handleSettingsChange}
          settings={progress.settings}
        />
      ) : null}
      <ConfirmDialog
        confirmLabel="Usuń postęp"
        description="Czy na pewno chcesz usunąć postęp? Tej operacji nie da się cofnąć."
        onCancel={() => {
          setResetDialogOpen(false);
        }}
        onConfirm={handleResetConfirmed}
        open={resetDialogOpen}
        title="Usuń postęp"
      />
    </Layout>
  );
}

interface HomeViewProps {
  selectedMode: SupportedGameMode;
  hasProgress: boolean;
  onSelectMode: (mode: SupportedGameMode) => void;
  onStart: () => void;
  onContinue: () => void;
  onRepeatIncorrect: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
}

function HomeView({
  hasProgress,
  onContinue,
  onOpenProgress,
  onOpenSettings,
  onRepeatIncorrect,
  onSelectMode,
  onStart,
  selectedMode
}: HomeViewProps) {
  return (
    <section className="view-stack" aria-labelledby="home-heading">
      <div className="intro">
        <p className="eyebrow">Ćwiczenia audytorskie</p>
        <h1 id="home-heading">A11yFirst Lab</h1>
        <p>
          Ćwicz decyzje audytorskie na krótkich scenariuszach. Po każdej odpowiedzi dostaniesz wyjaśnienie,
          kryteria WCAG i rekomendację naprawczą.
        </p>
      </div>
      <form className="mode-picker">
        <fieldset>
          <legend>Wybierz tryb gry</legend>
          {(Object.keys(modeLabels) as SupportedGameMode[]).map((mode) => (
            <div className="mode-option" key={mode}>
              <input
                checked={selectedMode === mode}
                id={`mode-${mode}`}
                name="game-mode"
                onChange={() => onSelectMode(mode)}
                type="radio"
                value={mode}
              />
              <label htmlFor={`mode-${mode}`}>
                <strong>{modeLabels[mode]}</strong>
                <span>
                  {mode === 'wcag-detective'
                    ? 'Scenariusz audytorski i jedna najlepsza odpowiedź ABCD.'
                    : 'Krótka teza audytorska oceniana jako Prawda albo Fałsz.'}
                </span>
              </label>
            </div>
          ))}
        </fieldset>
      </form>
      <div className="action-row">
        <Button variant="primary" onClick={onStart}>
          Rozpocznij
        </Button>
        {hasProgress ? <Button onClick={onContinue}>Kontynuuj od ostatniego miejsca</Button> : null}
        <Button onClick={onRepeatIncorrect}>
          Powtórz błędne odpowiedzi
        </Button>
        <Button onClick={onOpenProgress}>Zobacz postęp</Button>
        <Button onClick={onOpenSettings}>Ustawienia dostępności</Button>
      </div>
    </section>
  );
}

interface GameViewProps {
  session: GameSession;
  currentExercise: Exercise;
  currentIndex: number;
  total: number;
  feedback: AnswerFeedback | null;
  showWcagHints: boolean;
  onAnswer: (selectedAnswerId: string | boolean) => void;
  onNext: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

function GameView({
  currentExercise,
  currentIndex,
  feedback,
  onAnswer,
  onFinish,
  onNext,
  onSkip,
  session,
  showWcagHints,
  total
}: GameViewProps) {
  return (
    <section className="view-stack" aria-labelledby="game-heading">
      <div className="question-meta">
        <p className="eyebrow">{session.repeatIncorrect ? 'Powtórka błędnych odpowiedzi' : modeLabels[session.mode]}</p>
        <h1 id="game-heading">{modeLabels[currentExercise.mode]}</h1>
        <dl className="meta-list">
          <div>
            <dt>Pytanie</dt>
            <dd>
              {currentIndex + 1} z {total}
            </dd>
          </div>
          <div>
            <dt>Kategoria</dt>
            <dd>{currentExercise.category}</dd>
          </div>
          <div>
            <dt>Poziom</dt>
            <dd>{levelLabels[currentExercise.level]}</dd>
          </div>
        </dl>
      </div>
      <ExerciseForm disabled={Boolean(feedback)} exercise={currentExercise} onSubmitAnswer={onAnswer} />
      {!feedback ? (
        <div className="action-row">
          <Button onClick={onSkip}>Pomiń</Button>
          <Button onClick={onFinish}>Zakończ sesję</Button>
        </div>
      ) : null}
      {feedback ? (
        <FeedbackPanel feedback={feedback} onFinish={onFinish} onNext={onNext} showWcagHints={showWcagHints} />
      ) : null}
    </section>
  );
}

interface SummaryViewProps {
  progress: UserProgress;
  results: AnswerResult[];
  onRepeatIncorrect: () => void;
  onHome: () => void;
}

function SummaryView({ onHome, onRepeatIncorrect, progress, results }: SummaryViewProps) {
  const correct = results.filter((result) => result.correct).length;
  const total = results.length;
  const areasToRepeat = Object.entries(progress.categoryStats)
    .filter(([, stats]) => stats.incorrect > 0)
    .map(([category]) => category);

  return (
    <section className="view-stack" aria-labelledby="summary-heading">
      <p className="eyebrow">Podsumowanie sesji</p>
      <h1 id="summary-heading">Wynik: {total > 0 ? `${correct}/${total}` : 'brak odpowiedzi'}</h1>
      <p>{total > 0 ? `Poprawne odpowiedzi: ${correct}. Błędne odpowiedzi: ${total - correct}.` : 'Sesja została zakończona bez odpowiedzi.'}</p>
      <section aria-labelledby="repeat-heading" className="inline-section">
        <h2 id="repeat-heading">Obszary do powtórzenia</h2>
        {areasToRepeat.length > 0 ? (
          <ul>
            {areasToRepeat.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        ) : (
          <p>Brak zapisanych błędów w tej przeglądarce.</p>
        )}
      </section>
      <div className="action-row">
        <Button onClick={onRepeatIncorrect} variant="primary">
          Powtórz błędne odpowiedzi
        </Button>
        <Button onClick={onHome}>Wróć do menu</Button>
      </div>
    </section>
  );
}

interface ProgressViewProps {
  progress: UserProgress;
  onReset: () => void;
  onRepeatIncorrect: () => void;
}

function ProgressView({ onRepeatIncorrect, onReset, progress }: ProgressViewProps) {
  return (
    <section className="view-stack" aria-labelledby="progress-heading">
      <p className="eyebrow">Twoje dane lokalne</p>
      <h1 id="progress-heading">Postęp</h1>
      <ProgressSummary progress={progress} />
      <section aria-labelledby="areas-heading" className="inline-section">
        <h2 id="areas-heading">Obszary do powtórki</h2>
        {progress.incorrectExerciseIds.length > 0 ? (
          <p>Masz {progress.incorrectExerciseIds.length} ćwiczeń z błędną odpowiedzią do powtórzenia.</p>
        ) : (
          <p>Nie ma jeszcze błędnych odpowiedzi do powtórzenia.</p>
        )}
      </section>
      <div className="action-row">
        <Button onClick={onRepeatIncorrect} variant="primary">
          Powtórz błędne odpowiedzi
        </Button>
        <Button onClick={onReset} variant="danger">
          Wyczyść postęp
        </Button>
      </div>
    </section>
  );
}

interface SettingsViewProps {
  settings: UserProgress['settings'];
  onSettingsChange: (settings: UserProgress['settings']) => void;
  onReset: () => void;
}

function SettingsView({ onReset, onSettingsChange, settings }: SettingsViewProps) {
  return (
    <section className="view-stack" aria-labelledby="settings-heading">
      <p className="eyebrow">Preferencje lokalne</p>
      <h1 id="settings-heading">Ustawienia dostępności</h1>
      <p>
        W wersji MVP postęp jest zapisywany lokalnie w Twojej przeglądarce. Accessibility First nie widzi Twoich
        wyników.
      </p>
      <div className="settings-form" role="group" aria-labelledby="settings-heading">
        <SettingsToggle
          enabled={settings.reduceMotion}
          label="Ogranicz animacje"
          onToggle={() => onSettingsChange({ ...settings, reduceMotion: !settings.reduceMotion })}
        />
        <SettingsToggle
          enabled={settings.largeSpacing}
          label="Większe odstępy"
          onToggle={() => onSettingsChange({ ...settings, largeSpacing: !settings.largeSpacing })}
        />
        <SettingsToggle
          enabled={settings.highContrast}
          label="Tryb wysokiego kontrastu"
          onToggle={() => onSettingsChange({ ...settings, highContrast: !settings.highContrast })}
        />
        <SettingsToggle
          enabled={settings.showWcagHints}
          label="Pokazuj kryteria WCAG w informacji zwrotnej"
          onToggle={() => onSettingsChange({ ...settings, showWcagHints: !settings.showWcagHints })}
        />
      </div>
      <Button onClick={onReset}>Reset ustawień</Button>
    </section>
  );
}

interface SettingsToggleProps {
  enabled: boolean;
  label: string;
  onToggle: () => void;
}

function SettingsToggle({ enabled, label, onToggle }: SettingsToggleProps) {
  return (
    <button
      aria-pressed={enabled}
      className="settings-toggle"
      onClick={onToggle}
      type="button"
    >
      <span>{label}</span>
      <span className="settings-toggle__state">{enabled ? 'Włączone' : 'Wyłączone'}</span>
    </button>
  );
}
