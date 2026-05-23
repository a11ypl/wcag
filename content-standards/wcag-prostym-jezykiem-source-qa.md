# WCAG prostym językiem: source QA

Data checkpointu: 2026-05-17.

Zakres: mini-checkpoint po poprawkach 2.1.1. Sprawdzono wskazane podstrony pod kątem etykiet języka w blokach kodu oraz obecności podstawowych linków źródłowych.

Nie dopisywano nowych technik W3C ani failures bez niezależnego potwierdzenia w How to Meet / Quick Reference. Linki do technik, które już były w treści, oznaczono jako wymagające dalszego audytu źródeł.

| Kryterium | Tytuł | Etykiety kodu OK | Źródła podstawowe OK | Techniki W3C zweryfikowane | Failures zweryfikowane | Wymaga poprawy |
|---|---|---|---|---|---|---|
| 1.1.1 | Treść nietekstowa | Tak | Tak | Nie w tym checkpoincie - 6 linków obecnych, wymagają potwierdzenia w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 1.3.1 | Informacje i relacje | Nie dotyczy - brak bloków kodu | Nie | Nie - wymaga audytu w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | uzupełnić podstawowe źródła W3C; zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 1.3.2 | Zrozumiała kolejność | Tak | Tak | Nie - wymaga audytu w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 1.4.1 | Użycie koloru | Tak | Tak | Nie w tym checkpoincie - 4 linków obecnych, wymagają potwierdzenia w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 1.4.3 | Kontrast minimum | Tak | Tak | Nie w tym checkpoincie - 3 linków obecnych, wymagają potwierdzenia w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 1.4.11 | Kontrast elementów nietekstowych | Tak | Tak | Nie w tym checkpoincie - 2 linków obecnych, wymagają potwierdzenia w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 1.4.13 | Treść po najechaniu lub fokusie | Tak | Tak | Nie - wymaga audytu w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 2.1.1 | Klawiatura | Tak | Tak | Nie - wymaga audytu w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 2.1.2 | Brak pułapki na klawiaturę | Tak | Tak | Nie - wymaga audytu w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 2.4.3 | Kolejność fokusu | Tak | Tak | Nie w tym checkpoincie - 4 linków obecnych, wymagają potwierdzenia w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 2.4.7 | Widoczny fokus | Tak | Tak | Nie w tym checkpoincie - 5 linków obecnych, wymagają potwierdzenia w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |
| 3.3.1 | Identyfikacja błędu | Tak | Tak | Nie w tym checkpoincie - 5 linków obecnych, wymagają potwierdzenia w Quick Reference | Nie - wymaga audytu, jeśli failure jest istotny dla przykładów | zweryfikować techniki/failures przed kolejną rozbudową źródeł |

## Source QA 2026-05-19: 3.3.3 Sugestie korekty błędów

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 3.3.3 Error Suggestion - `https://www.w3.org/TR/WCAG22/#error-suggestion`
- Understanding WCAG 3.3.3 Error Suggestion - `https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html`
- How to Meet WCAG 3.3.3 - `https://www.w3.org/WAI/WCAG22/quickref/#error-suggestion`

Zweryfikowane techniki z How to Meet / Quick Reference:

- ARIA18: Using aria-alertdialog to Identify Errors.
- G85: Providing a text description when user input falls outside the required format or values.
- G177: Providing suggested correction text.
- PDF22: Indicating when user input falls outside the required format or values in PDF forms.
- G84: Providing a text description when the user provides information that is not in the list of allowed values.

Failures:

- Quick Reference dla 3.3.3 nie wskazuje osobnej listy failures.

Uwagi zakresowe:

- 3.3.3 dotyczy sugestii po wykryciu błędu, jeśli sugestia jest znana i nie zagraża bezpieczeństwu ani celowi treści.
- Nie mieszać z 3.3.1, 3.3.2, 3.3.4 ani 4.1.3.

## Source QA 2026-05-20: 3.3.4 Zapobieganie błędom (prawne, finansowe, dane)

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 3.3.4 Error Prevention (Legal, Financial, Data) - `https://www.w3.org/TR/WCAG22/#error-prevention-legal-financial-data`
- Understanding WCAG 3.3.4 Error Prevention (Legal, Financial, Data) - `https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html`
- How to Meet WCAG 3.3.4 - `https://www.w3.org/WAI/WCAG22/quickref/#error-prevention-legal-financial-data`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G164: Providing a stated time within which an online request (or transaction) may be amended or canceled by the user after making the request.
- G98: Providing the ability for the user to review and correct answers before submitting.
- G155: Providing a checkbox in addition to a submit button.
- G99: Providing the ability to recover deleted information.
- G168: Requesting confirmation to continue with selected action.

Failures:

- Quick Reference dla 3.3.4 nie wskazuje osobnej listy failures.

Uwagi zakresowe:

- 3.3.4 dotyczy stron, które powodują zobowiązania prawne, transakcje finansowe, modyfikację lub usunięcie danych kontrolowanych przez użytkownika albo wysłanie odpowiedzi testowych.
- Kryterium wymaga co najmniej jednego z mechanizmów: odwrócenie, sprawdzenie danych z możliwością poprawy albo przegląd/potwierdzenie/korekta przed finalizacją.
- Nie mieszać z 3.3.1, 3.3.2, 3.3.3, 3.3.6 ani 4.1.3.

## Source QA 2026-05-22: 3.3.6 Zapobieganie błędom (wszystkie)

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 3.3.6 Error Prevention (All) - `https://www.w3.org/TR/WCAG22/#error-prevention-all`
- Understanding WCAG 3.3.6 Error Prevention (All) - `https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html`
- How to Meet WCAG 3.3.6 - `https://www.w3.org/WAI/WCAG22/quickref/#error-prevention-all`
- How to Meet WCAG 3.3.4 - `https://www.w3.org/WAI/WCAG22/quickref/#error-prevention-legal-financial-data`

Zweryfikowane techniki z How to Meet / Quick Reference:

- How to Meet dla 3.3.6 wskazuje: following the sufficient techniques for Success Criterion 3.3.4 for all forms that require the user to submit information.
- G164: Providing a stated time within which an online request (or transaction) may be amended or canceled by the user after making the request.
- G98: Providing the ability for the user to review and correct answers before submitting.
- G155: Providing a checkbox in addition to a submit button.
- G99: Providing the ability to recover deleted information.
- G168: Requesting confirmation to continue with selected action.

Failures:

- Quick Reference dla 3.3.6 nie wskazuje osobnej listy failures.

Uwagi zakresowe:

- 3.3.6 jest kryterium poziomu AAA.
- 3.3.6 rozszerza 3.3.4 na wszystkie formularze i strony, które wymagają wysłania informacji przez użytkownika.
- Kryterium wymaga co najmniej jednego z mechanizmów: odwrócenie, sprawdzenie danych z możliwością poprawy albo przegląd/potwierdzenie/korekta przed finalizacją.
- Nie mieszać z 3.3.1, 3.3.2, 3.3.3, 3.3.4 ani 4.1.3.

## Source QA 2026-05-22: 3.3.7 Powtarzające się wpisy

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 3.3.7 Redundant Entry - `https://www.w3.org/TR/WCAG22/#redundant-entry`
- Understanding WCAG 3.3.7 Redundant Entry - `https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html`
- How to Meet WCAG 3.3.7 - `https://www.w3.org/WAI/WCAG22/quickref/#redundant-entry`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G221: Provide data from a previous step in a process.

Nie dodano jako techniki publicznej:

- `Not requesting the same information twice` - Quick Reference oznacza to jako potencjalną przyszłą technikę.

Failures:

- Quick Reference dla 3.3.7 nie wskazuje osobnej listy failures.

Uwagi zakresowe:

- 3.3.7 dotyczy ponownego wpisywania tej samej informacji w tym samym procesie.
- Wcześniej podana informacja powinna być automatycznie uzupełniona albo dostępna do wyboru.
- Wyjątki: ponowne wpisanie jest niezbędne, wymagane dla bezpieczeństwa albo wcześniejsza informacja nie jest już ważna.
- Nie mieszać z 1.3.5, 3.3.2, 3.3.4, 3.3.6 ani 1.3.1.

## Source QA 2026-05-23: 3.3.8 Dostępne uwierzytelnianie (minimum)

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 3.3.8 Accessible Authentication (Minimum) - `https://www.w3.org/TR/WCAG22/#accessible-authentication-minimum`
- Understanding WCAG 3.3.8 Accessible Authentication (Minimum) - `https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html`
- How to Meet WCAG 3.3.8 - `https://www.w3.org/WAI/WCAG22/quickref/#accessible-authentication-minimum`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G218: Email link authentication.
- H100: Providing properly marked up email and password inputs.

Nie dodano jako technik publicznych:

- `Providing WebAuthn as an alternative to username/password` - Quick Reference oznacza to jako potencjalną przyszłą technikę.
- `Providing a third-party login using OAuth` - Quick Reference oznacza to jako potencjalną przyszłą technikę.
- `Using two techniques to provide two-factor authentication` - Quick Reference oznacza to jako potencjalną przyszłą technikę.

Failures:

- F109: Failure of Success Criterion 3.3.8 and 3.3.9 due to preventing password or code re-entry in the same format.

Uwagi zakresowe:

- 3.3.8 dotyczy uwierzytelniania istniejących użytkowników i testów funkcji poznawczych w procesie logowania.
- Kryterium dopuszcza hasła, kody i zabezpieczenia, jeśli dostępny jest mechanizm pomocy albo alternatywna metoda.
- Na poziomie AA wyjątki obejmują rozpoznawanie obiektów i identyfikację własnych treści nietekstowych użytkownika; rozszerzone wymaganie 3.3.9 jest poziomem AAA i nie jest rozwijane w tym tasku.
- Nie mieszać z 3.3.9, 1.3.5, 3.3.2, 4.1.2 ani ogólną polityką cyberbezpieczeństwa.

## Source QA 2026-05-23: 2.4.11 Fokus niezakryty (minimum)

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 2.4.11 Focus Not Obscured (Minimum) - `https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum`
- Understanding WCAG 2.4.11 Focus Not Obscured (Minimum) - `https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html`
- How to Meet WCAG 2.4.11 - `https://www.w3.org/WAI/WCAG22/quickref/#focus-not-obscured-minimum`

Zweryfikowane techniki z How to Meet / Quick Reference:

- C43: Using CSS margin and scroll-margin to un-obscure content.

Failures:

- F110: Failure of Success Criterion 2.4.11 due to opening a dialog or menu which obscures focused content.

Uwagi zakresowe:

- 2.4.11 dotyczy sytuacji, gdy element z fokusem jest całkowicie zasłonięty przez treść utworzoną przez autora strony.
- Częściowe zasłonięcie opisano jako ryzyko i powiązanie z wyższymi wymaganiami, nie jako automatyczne naruszenie 2.4.11.
- Nie mieszać z 2.4.7, 2.4.12, 2.4.3, 1.4.11 ani 2.4.13.
- 2.4.12 jest poziomem AAA i nie jest rozwijane w tym tasku.

## Source QA 2026-05-23: 2.5.7 Ruch przeciągania

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 2.5.7 Dragging Movements - `https://www.w3.org/TR/WCAG22/#dragging-movements`
- Understanding WCAG 2.5.7 Dragging Movements - `https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html`
- How to Meet WCAG 2.5.7 - `https://www.w3.org/WAI/WCAG22/quickref/#dragging-movements`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G219: Ensuring that an alternative is available for dragging movements that operate on content.

Failures:

- F108: Failure of Success Criterion 2.5.7 Dragging Movements due to not providing a single pointer method that does not require a dragging movement.

Uwagi zakresowe:

- 2.5.7 dotyczy funkcji, które wymagają ruchu przeciągania.
- Kryterium nie zakazuje przeciągania. Wymaga alternatywnej drogi wykonania tej samej funkcji bez przeciągania, chyba że przeciąganie jest istotą funkcji albo funkcja należy do wyjątków WCAG.
- Nie mieszać z 2.5.1, 2.1.1, 2.5.8, 2.5.2 ani 1.4.10.
