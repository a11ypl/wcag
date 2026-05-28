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

## Source QA 2026-05-23: 2.5.8 Rozmiar celu (minimum)

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 2.5.8 Target Size (Minimum) - `https://www.w3.org/TR/WCAG22/#target-size-minimum`
- Understanding WCAG 2.5.8 Target Size (Minimum) - `https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html`
- How to Meet WCAG 2.5.8 - `https://www.w3.org/WAI/WCAG22/quickref/#target-size-minimum`

Zweryfikowane techniki z How to Meet / Quick Reference:

- C42: Using min-height and min-width on target container to ensure sufficient target spacing.

Failures:

- Quick Reference dla 2.5.8 nie wskazuje osobnej listy failures.

Uwagi zakresowe:

- 2.5.8 dotyczy celu dla wejścia wskaźnikiem, np. myszą, dotykiem albo rysikiem.
- Cel powinien mieć co najmniej 24 na 24 CSS px albo mieć wystarczający odstęp od innych celów zgodnie z warunkami kryterium.
- Wyjątki obejmują między innymi spacing, równoważny większy cel, linki inline, kontrolki przeglądarki i prezentację istotną lub wymaganą prawnie.
- Nie mieszać z 2.5.5, 2.5.7, 2.5.2, 1.4.11 ani 2.4.7.

## Source QA 2026-05-23: 1.3.1 Informacje i relacje

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 1.3.1 Info and Relationships - `https://www.w3.org/TR/WCAG22/#info-and-relationships`
- Understanding WCAG 1.3.1 Info and Relationships - `https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html`
- How to Meet WCAG 1.3.1 - `https://www.w3.org/WAI/WCAG22/quickref/#info-and-relationships`

Zweryfikowane techniki z How to Meet / Quick Reference:

- H42: Using h1-h6 to identify headings.
- H48: Using ol, ul and dl for lists or groups of links.
- H51: Using table markup to present tabular information.
- H63: Using the scope attribute to associate header cells with data cells in data tables.
- H44: Using label elements to associate text labels with form controls.
- H71: Providing a description for groups of form controls using fieldset and legend elements.

Failures:

- F91: Failure of Success Criterion 1.3.1 for not correctly marking up table headers.

Zweryfikowane, ale nie dodane jako publiczne źródła technik:

- G115, G117, G140, H39, H43, H65, H85, H97, H101 oraz techniki ARIA i PDF z Quick Reference. Nie były potrzebne do przykładów w tym tutorialu.
- Pozostałe failures z Quick Reference: F2, F33, F34, F42, F43, F46, F48, F90, F92, F111.

Uwagi zakresowe:

- 1.3.1 dotyczy informacji, struktury i relacji przekazanych przez prezentację, które muszą być programowo możliwe do ustalenia albo dostępne w tekście.
- W tutorialu użyto przede wszystkim natywnego HTML: nagłówków, list, tabel, etykiet i grupowania formularzy.
- Nie mieszać z 4.1.2: nazwa, rola, stan i wartość komponentu są powiązane, ale nie są głównym zakresem tego materiału.
- Nie mieszać z 1.3.2: kolejność treści jest osobnym kryterium, choć korzysta z poprawnej struktury.

## Source QA 2026-05-23: 1.3.5 Określenie celu danych wejściowych

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 1.3.5 Identify Input Purpose - `https://www.w3.org/TR/WCAG22/#identify-input-purpose`
- Understanding WCAG 1.3.5 Identify Input Purpose - `https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html`
- How to Meet WCAG 1.3.5 - `https://www.w3.org/WAI/WCAG22/quickref/#identify-input-purpose`
- HTML Standard: Autofill - `https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill`

Zweryfikowane techniki z How to Meet / Quick Reference:

- H98: Using HTML autocomplete attributes.

Failures:

- F107: Failure of Success Criterion 1.3.5 due to incorrect autocomplete attribute values.

Zweryfikowane tokeny użyte w tutorialu:

- `given-name`, `family-name`, `email`, `tel`, `street-address`, `address-level2`, `postal-code`, `country-name`.
- `shipping` i `billing` jako opcjonalne tokeny rozróżniające adres albo dane kontaktowe wysyłki i rozliczeń.

Uwagi zakresowe:

- 1.3.5 dotyczy pól zbierających informacje o użytkowniku, gdy cel pola odpowiada liście input purposes i technologia pozwala określić ten cel programowo.
- Widoczna etykieta nadal jest potrzebna; `autocomplete` nie zastępuje wymagań z 3.3.2 ani dostępnej nazwy z 4.1.2.
- `type="email"` i `type="tel"` opisują typ danych, ale nie zawsze precyzyjny cel pola w sensie 1.3.5.
- Nie każde pole formularza wymaga `autocomplete`; kryterium dotyczy tylko pasujących danych o użytkowniku.

## Source QA 2026-05-28: 1.3.3 Właściwości zmysłowe

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 1.3.3 Sensory Characteristics - `https://www.w3.org/TR/WCAG22/#sensory-characteristics`
- Understanding WCAG 1.3.3 Sensory Characteristics - `https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html`
- How to Meet WCAG 1.3.3 - `https://www.w3.org/WAI/WCAG22/quickref/#sensory-characteristics`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G96: Providing textual identification of items that otherwise rely only on sensory information to be understood.

Failures:

- F14: Failure of Success Criterion 1.3.3 due to identifying content only by its shape or location.
- F26: Failure of Success Criterion 1.3.3 due to using a graphical symbol alone to convey information.

Uwagi zakresowe:

- 1.3.3 dotyczy instrukcji, które do zrozumienia wymagają wyłącznie cech zmysłowych: koloru, kształtu, rozmiaru, położenia, orientacji albo dźwięku.
- Kryterium nie zakazuje używania cech zmysłowych. Wymaga dodatkowego tekstowego lub programowego sposobu identyfikacji elementu, jeśli instrukcja wskazuje użytkownikowi, co ma zrobić.
- Nie mieszać z 1.4.1: informacja przekazana wyłącznie kolorem jest powiązana, ale 1.3.3 dotyczy instrukcji zależnych od cech zmysłowych.
- Nie mieszać z 1.3.1, 1.3.2 ani 3.3.2: struktura, kolejność oraz kompletność etykiet i instrukcji mogą wspierać poprawkę, ale nie są głównym zakresem tego kryterium.

## Source QA 2026-05-28: 1.4.4 Zmiana rozmiaru tekstu

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 1.4.4 Resize Text - `https://www.w3.org/TR/WCAG22/#resize-text`
- Understanding WCAG 1.4.4 Resize Text - `https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html`
- How to Meet WCAG 1.4.4 - `https://www.w3.org/WAI/WCAG22/quickref/#resize-text`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G142: Using a technology that has commonly-available user agents that support zoom.
- C28: Specifying the size of text containers using `em` units.
- G179: Ensuring that there is no loss of content or functionality when the text resizes and text containers do not change their width.

Failures:

- F69: Failure of Success Criterion 1.4.4 when resizing visually rendered text up to 200 percent causes the text, image or controls to be clipped, truncated or obscured.
- F80: Failure of Success Criterion 1.4.4 when text-based form controls do not resize when visually rendered text is resized up to 200%.
- F94: Failure of Success Criterion 1.4.4 due to incorrect use of viewport units to resize text.

Uwagi zakresowe:

- 1.4.4 dotyczy powiększenia tekstu do 200% bez technologii wspomagającej, bez utraty treści lub funkcjonalności.
- Kryterium nie wymaga zachowania identycznego układu po powiększeniu; układ może się zawijać, wydłużać, rozszerzać albo przewijać, jeśli treść i funkcje pozostają dostępne.
- Wyjątki w kryterium obejmują napisy i obrazy tekstu.
- Nie mieszać z 1.4.10: reflow przy 320 CSS px / 400% jest osobnym wymaganiem.
- Nie mieszać z 1.4.12: odstępy w tekście są osobnym wymaganiem.
- Nie mieszać z 1.4.3 ani 2.4.7: kontrast tekstu i widoczność fokusu mogą być testowane równolegle, ale nie są głównym zakresem tego kryterium.

## Source QA 2026-05-28: 1.4.5 Obrazy tekstu

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 1.4.5 Images of Text - `https://www.w3.org/TR/WCAG22/#images-of-text`
- Understanding WCAG 1.4.5 Images of Text - `https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html`
- How to Meet WCAG 1.4.5 - `https://www.w3.org/WAI/WCAG22/quickref/#images-of-text`

Zweryfikowane techniki z How to Meet / Quick Reference:

- C22: Using CSS to control visual presentation of text.

Failures:

- Quick Reference dla 1.4.5 nie wskazuje osobnej listy failures.

Uwagi zakresowe:

- 1.4.5 dotyczy używania prawdziwego tekstu zamiast obrazów tekstu, jeśli technologia pozwala osiągnąć oczekiwany wygląd.
- Wyjątki obejmują obrazy tekstu, które można wizualnie dostosować do wymagań użytkownika, oraz przypadki, w których konkretna prezentacja tekstu jest istotna dla informacji.
- Logotypy są w WCAG traktowane jako istotne.
- Nie mieszać z 1.1.1: tekst alternatywny nie zastępuje wymogu użycia prawdziwego tekstu tam, gdzie jest to możliwe.

## Source QA 2026-05-28: 1.4.10 Dopasowanie do ekranu

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 1.4.10 Reflow - `https://www.w3.org/TR/WCAG22/#reflow`
- Understanding WCAG 1.4.10 Reflow - `https://www.w3.org/WAI/WCAG22/Understanding/reflow.html`
- How to Meet WCAG 1.4.10 - `https://www.w3.org/WAI/WCAG22/quickref/#reflow`

Zweryfikowane techniki z How to Meet / Quick Reference:

- C32: Using media queries and grid CSS to reflow columns.
- C31: Using CSS Flexbox to reflow content.
- C33: Allowing for Reflow with Long URLs and Strings of Text.
- C38: Using CSS width, max-width and flexbox to fit labels and inputs.

Failures:

- F102: Failure of Success Criterion 1.4.10 due to content disappearing and not being available when content has reflowed.

Uwagi zakresowe:

- 1.4.10 dotyczy prezentacji treści bez utraty informacji lub funkcjonalności i bez przewijania w dwóch kierunkach dla treści przewijanej pionowo przy szerokości równoważnej 320 CSS px oraz dla treści przewijanej poziomo przy wysokości równoważnej 256 CSS px.
- Wyjątki obejmują części treści, które wymagają układu dwuwymiarowego do użycia albo zrozumienia, na przykład mapy, diagramy, wideo, gry, prezentacje, tabele danych i niektóre interfejsy edycyjne.
- Nie mieszać z ogólną jakością responsywnego UI: błąd 1.4.10 wymaga utraty informacji/funkcjonalności albo konieczności przewijania w dwóch kierunkach poza wyjątkami.

## Source QA 2026-05-28: 1.4.12 Odstępy w tekście

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 1.4.12 Text Spacing - `https://www.w3.org/TR/WCAG22/#text-spacing`
- Understanding WCAG 1.4.12 Text Spacing - `https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html`
- How to Meet WCAG 1.4.12 - `https://www.w3.org/WAI/WCAG22/quickref/#text-spacing`

Zweryfikowane techniki z How to Meet / Quick Reference:

- C36: Allowing for text spacing override.
- C35: Allowing for text spacing without wrapping.

Failures:

- F104: Failure of Success Criterion 1.4.12 due to clipped or overlapped content when text spacing is adjusted.

Uwagi zakresowe:

- 1.4.12 dotyczy braku utraty treści lub funkcjonalności po ustawieniu: line-height co najmniej 1.5, odstępu po akapitach co najmniej 2 razy rozmiar fontu, letter-spacing co najmniej 0.12 razy rozmiar fontu i word-spacing co najmniej 0.16 razy rozmiar fontu.
- Kryterium nie wymaga, żeby autor domyślnie używał tych wartości. Wymaga odporności treści, gdy użytkownik nadpisze odstępy.
- Nie mieszać z 1.4.4: powiększenie tekstu do 200% jest osobnym wymaganiem.

## Source QA 2026-05-28: 2.4.1 Możliwość pominięcia bloków

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 2.4.1 Bypass Blocks - `https://www.w3.org/TR/WCAG22/#bypass-blocks`
- Understanding WCAG 2.4.1 Bypass Blocks - `https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html`
- How to Meet WCAG 2.4.1 - `https://www.w3.org/WAI/WCAG22/quickref/#bypass-blocks`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G1: Adding a link at the top of each page that goes directly to the main content area.
- G123: Adding a link at the beginning of a block of repeated content to go to the end of the block.
- G124: Adding links at the top of the page to each area of the content.
- H69: Providing heading elements at the beginning of each section of content.

Failures:

- Quick Reference dla 2.4.1 nie wskazuje osobnej listy failures.

Uwagi zakresowe:

- 2.4.1 dotyczy mechanizmu pominięcia bloków treści powtarzanych na wielu stronach, takich jak menu, nagłówek, lista linków albo rozbudowane filtry.
- Nagłówki i landmarki mogą pomagać, ale tutorial nie opisuje ogólnej poprawności struktury nagłówków jako głównego wymagania 2.4.1.

## Source QA 2026-05-28: 2.4.2 Tytuł strony

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 2.4.2 Page Titled - `https://www.w3.org/TR/WCAG22/#page-titled`
- Understanding WCAG 2.4.2 Page Titled - `https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html`
- How to Meet WCAG 2.4.2 - `https://www.w3.org/WAI/WCAG22/quickref/#page-titled`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G88: Providing descriptive titles for Web pages.
- H25: Providing a title using the title element.

Failures:

- F25: Failure of Success Criterion 2.4.2 due to the title of a Web page not identifying the contents.

Uwagi zakresowe:

- 2.4.2 dotyczy tytułu strony w elemencie `title`.
- Nie mieszać z `h1`: nagłówek główny może być podobny do tytułu, ale jest osobnym elementem i pełni inną funkcję.

## Source QA 2026-05-28: 2.4.4 Cel linku w kontekście

Status: zweryfikowane.

Zweryfikowane źródła:

- WCAG 2.2: 2.4.4 Link Purpose (In Context) - `https://www.w3.org/TR/WCAG22/#link-purpose-in-context`
- Understanding WCAG 2.4.4 Link Purpose (In Context) - `https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html`
- How to Meet WCAG 2.4.4 - `https://www.w3.org/WAI/WCAG22/quickref/#link-purpose-in-context`

Zweryfikowane techniki z How to Meet / Quick Reference:

- G91: Providing link text that describes the purpose of a link.
- H30: Providing link text that describes the purpose of a link for anchor elements.
- G53: Identifying the purpose of a link using link text combined with the text of the enclosing sentence.
- H79: Identifying the purpose of a link using link text combined with its enclosing table row and table headings.

Failures:

- F63: Failure of Success Criterion 2.4.4 due to providing link context only in content that is not related to the link.
- F89: Failure of Success Criteria 2.4.4, 2.4.9 and 4.1.2 due to using null alt on an image where the image is the only content in a link.

Uwagi zakresowe:

- 2.4.4 dotyczy celu linku rozumianego z samego tekstu linku albo z programowo dostępnego kontekstu.
- Nie mieszać z wyglądem linków, kolorem ani kontrastem. To kryterium ocenia znaczenie linku, nie jego prezentację wizualną.
