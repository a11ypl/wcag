import { FormEvent, useId, useState } from 'react';
import type { Exercise } from '../types/exercise';
import { Button } from './Button';

interface ExerciseFormProps {
  exercise: Exercise;
  disabled: boolean;
  onSubmitAnswer: (selectedAnswerId: string | boolean) => void;
}

export function ExerciseForm({ disabled, exercise, onSubmitAnswer }: ExerciseFormProps) {
  const fieldsetId = useId();
  const helpId = `${fieldsetId}-help`;
  const [selected, setSelected] = useState<string>('');
  const questionText = exercise.type === 'single-choice' ? exercise.question : exercise.statement;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      return;
    }
    onSubmitAnswer(exercise.type === 'true-false' ? selected === 'true' : selected);
  }

  return (
    <form aria-describedby={helpId} className="exercise-form" onSubmit={handleSubmit}>
      <fieldset disabled={disabled}>
        <legend>{questionText}</legend>
        <p className="form-help" id={helpId}>
          Wybierz jedną odpowiedź, a potem użyj przycisku „Sprawdź odpowiedź”.
        </p>
        <div className="answer-list">
          {exercise.type === 'single-choice'
            ? exercise.answers.map((answer) => (
                <div className="answer-option" key={answer.id}>
                  <input
                    checked={selected === answer.id}
                    id={`${exercise.id}-${answer.id}`}
                    name={exercise.id}
                    onChange={() => setSelected(answer.id)}
                    type="radio"
                    value={answer.id}
                  />
                  <label htmlFor={`${exercise.id}-${answer.id}`}>
                    <span className="answer-prefix">{answer.id.toUpperCase()}</span>
                    {answer.text}
                  </label>
                </div>
              ))
            : [
                { id: 'true', label: 'Prawda' },
                { id: 'false', label: 'Fałsz' }
              ].map((answer) => (
                <div className="answer-option" key={answer.id}>
                  <input
                    checked={selected === answer.id}
                    id={`${exercise.id}-${answer.id}`}
                    name={exercise.id}
                    onChange={() => setSelected(answer.id)}
                    type="radio"
                    value={answer.id}
                  />
                  <label htmlFor={`${exercise.id}-${answer.id}`}>{answer.label}</label>
                </div>
              ))}
        </div>
      </fieldset>
      <Button disabled={!selected || disabled} type="submit" variant="primary">
        Sprawdź odpowiedź
      </Button>
    </form>
  );
}
