import { useEffect, useRef } from 'react';
import type { AnswerFeedback } from '../types/exercise';
import { focusElement } from '../a11y/focusManagement';
import { Button } from './Button';

interface FeedbackPanelProps {
  feedback: AnswerFeedback;
  showWcagHints: boolean;
  onNext: () => void;
  onFinish: () => void;
}

export function FeedbackPanel({ feedback, showWcagHints, onNext, onFinish }: FeedbackPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const { exercise, result } = feedback;

  useEffect(() => {
    focusElement(panelRef.current);
  }, [feedback.result.exerciseId, feedback.result.answeredAt]);

  return (
    <section
      aria-labelledby="feedback-heading"
      aria-live="polite"
      className={`feedback-panel ${result.correct ? 'is-correct' : 'is-incorrect'}`}
      ref={panelRef}
      tabIndex={-1}
    >
      <p className="eyebrow">Informacja zwrotna po odpowiedzi</p>
      <h2 id="feedback-heading">{result.correct ? 'Dobrze' : 'Nie'}</h2>
      <dl className="definition-list">
        <div>
          <dt>Wybrana odpowiedź</dt>
          <dd>{feedback.selectedLabel}</dd>
        </div>
        {!result.correct ? (
          <div>
            <dt>Poprawna odpowiedź</dt>
            <dd>{feedback.correctLabel}</dd>
          </div>
        ) : null}
      </dl>
      <p>{feedback.selectedFeedback}</p>
      <section aria-labelledby="audit-summary-heading" className="inline-section">
        <h3 id="audit-summary-heading">Uzasadnienie audytorskie</h3>
        <p>{exercise.summary}</p>
      </section>
      {showWcagHints || result.correct ? (
        <section aria-labelledby="wcag-heading" className="inline-section">
          <h3 id="wcag-heading">Powiązane kryteria WCAG</h3>
          {exercise.wcag.length > 0 ? (
            <ul className="tag-list">
              {exercise.wcag.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          ) : (
            <p>To pytanie dotyczy praktyki audytowej, bez jednego bezpośredniego kryterium.</p>
          )}
        </section>
      ) : null}
      {exercise.fix ? (
        <section
          aria-labelledby="fix-heading"
          className={exercise.fix.includes('<') ? 'wcag-code-example' : 'inline-section'}
        >
          <div className={exercise.fix.includes('<') ? 'wcag-code-example__header' : undefined}>
            <h3 id="fix-heading">Rekomendacja naprawcza</h3>
          </div>
          {exercise.fix.includes('<') ? (
            <div className="wcag-code-example__code">
              <p className="wcag-code-example__label">Kod — przykład poprawki</p>
              <pre>
                <code>{exercise.fix}</code>
              </pre>
            </div>
          ) : (
            <p>{exercise.fix}</p>
          )}
        </section>
      ) : null}
      <div className="action-row">
        <Button variant="primary" onClick={onNext}>
          Następne pytanie
        </Button>
        <Button onClick={onFinish}>Zakończ sesję</Button>
      </div>
    </section>
  );
}
