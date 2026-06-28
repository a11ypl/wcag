# Silnik gier i feedback - A11yFirst Lab

## 1. Zasada edukacyjna

Każda błędna odpowiedź ma uczyć. Feedback nie może być generyczny.

Złe:

> Źle. Poprawna odpowiedź: B.

Dobre:

> Nie. Pusty alt może być poprawny dla obrazu dekoracyjnego, ale tutaj obraz jest jedyną treścią przycisku. W efekcie przycisk nie ma dostępnej nazwy.

## 2. Logika sprawdzania odpowiedzi ABCD

1. Użytkownik wybiera radio.
2. Użytkownik klika „Sprawdź odpowiedź”.
3. System sprawdza `answers[].correct`.
4. System zapisuje wynik.
5. System pokazuje feedback przypisany do wybranej odpowiedzi.
6. Jeśli odpowiedź jest błędna, system pokazuje poprawną odpowiedź i uzasadnienie.
7. Użytkownik sam decyduje, kiedy przejść dalej.

## 3. Logika Prawda/Fałsz

1. Użytkownik wybiera Prawda albo Fałsz.
2. System porównuje z `correct`.
3. System pokazuje `feedbackTrue` albo `feedbackFalse` zależnie od wyboru użytkownika.
4. System zapisuje wynik.

## 4. Tryb powtórki błędów

Tryb „Powtórz błędne odpowiedzi” wybiera ćwiczenia z `incorrectExerciseIds`.

Po poprawnej odpowiedzi w powtórce:

- ćwiczenie może pozostać w historii błędów,
- ale status aktualny zmienia się na poprawiony,
- statystyki kategorii odnotowują próbę.

Nie usuwaj historii błędu całkowicie, bo użytkownik powinien widzieć postęp.

## 5. Losowanie pytań

MVP:

- domyślnie kolejność według danych JSON,
- opcja „Losuj kolejność” jako ustawienie sesji.

Losowanie musi zapisać `exerciseIds` w sesji, aby odświeżenie strony nie zmieniło kolejności.

## 6. Podpowiedzi WCAG

Ustawienie `showWcagHints`:

- włączone: pokazuje kategorię i możliwe kryteria po odpowiedzi,
- wyłączone: pokazuje tylko po zakończeniu sesji.

Nie pokazuj poprawnej odpowiedzi przed zatwierdzeniem.

## 7. Ocena końcowa

Po sesji pokaż:

- wynik liczbowy,
- procent,
- liczba błędnych odpowiedzi,
- najmocniejsze kategorie,
- kategorie do powtórki,
- przycisk „Powtórz błędne odpowiedzi”,
- przycisk „Eksportuj postęp”.

Przykład:

```text
Wynik: 14/20

Najmocniejsze obszary:
- kontrast,
- tekst alternatywny.

Do powtórzenia:
- ARIA,
- formularze,
- komunikaty dynamiczne.
```

## 8. Format feedbacku ABCD

Dla każdej odpowiedzi:

```json
{
  "id": "a",
  "text": "Poprawne, bo obraz dekoracyjny ma pusty alt",
  "correct": false,
  "feedback": "Nie. Pusty alt może być poprawny dla obrazu dekoracyjnego, ale tutaj obraz jest jedyną treścią przycisku."
}
```

## 9. Minimalny obiekt wyniku

```ts
interface AnswerResult {
  exerciseId: string;
  selectedAnswerId: string | boolean;
  correct: boolean;
  answeredAt: string;
  attemptNumber: number;
}
```

## 10. Tryby docelowe

### ARIA Surgeon

Użytkownik widzi fragment HTML i wybiera najlepszą poprawkę.

### Formularzowy Saper

Użytkownik znajduje błędy w formularzu i przypisuje je do kryteriów.

### Keyboard Escape Room

Użytkownik przechodzi przez interfejs klawiaturą i raportuje problemy.

### Alt Arena

Użytkownik wybiera najlepszy alt w konkretnym kontekście.

### Raportownik

Użytkownik buduje wpis do raportu z audytu: opis błędu, wpływ, kryterium, rekomendacja.
