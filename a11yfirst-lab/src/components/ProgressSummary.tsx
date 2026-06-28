import type { UserProgress } from '../types/exercise';

interface ProgressSummaryProps {
  progress: UserProgress;
}

export function ProgressSummary({ progress }: ProgressSummaryProps) {
  const completed = progress.completedExerciseIds.length;
  const answered = Object.values(progress.categoryStats).reduce((sum, stat) => sum + stat.answered, 0);
  const correct = Object.values(progress.categoryStats).reduce((sum, stat) => sum + stat.correct, 0);
  const successRate = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const areasToRepeat = Object.entries(progress.categoryStats)
    .filter(([, stat]) => stat.incorrect > 0)
    .sort(([, first], [, second]) => second.incorrect - first.incorrect)
    .map(([category]) => category);

  return (
    <dl className="summary-grid">
      <div>
        <dt>Ukończone ćwiczenia</dt>
        <dd>{completed}</dd>
      </div>
      <div>
        <dt>Skuteczność</dt>
        <dd>{successRate}%</dd>
      </div>
      <div>
        <dt>Ostatnia aktywność</dt>
        <dd>{new Date(progress.updatedAt).toLocaleString('pl-PL')}</dd>
      </div>
      <div>
        <dt>Obszary do powtórki</dt>
        <dd>{areasToRepeat.length > 0 ? areasToRepeat.join(', ') : 'Brak zapisanych błędów'}</dd>
      </div>
    </dl>
  );
}
