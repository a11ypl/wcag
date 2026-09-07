# Prompty i blokada tożsamości

Prompt jest instrukcją dla modelu, nie gwarancją. Zawsze towarzyszą mu rzeczywiste obrazy wzorcowe.

## Ilustracja do makiety

```text
Use case: illustration-story / identity-preserve.
Asset: illustration for an Accessibility First graphic. No lettering or logos.
Reference roles: image 1 = approved AF-M01 identity; image 2 = approved AF-F01 identity. Use only characters requested in the brief.
Scene: {scene, meaningful activity and necessary props}.
Identity invariants: {fixed_traits from characters.json}. Preserve specific facial geometry, iris colour and size, hairline, hair volume, beard, skin tone, approved body proportions and distinctive asymmetries. Clothing does not define identity.
Allowed changes: {clothes, pose, expression, setting explicitly needed for the scene}.
Wardrobe constraints: {wardrobe_constraints from each selected character}. For Damian / AF-M01: full-length sleeves lowered to both wrists, all arm and forearm skin covered, hands visible; no rolled-up, pushed-up, short or three-quarter sleeves. Both arms have tattoo sleeves; conceal them with clothing, do not invent or render tattoo patterns.
Damian / AF-M01 build: athletic muscular swimmer physique, broad shoulders, developed chest and upper back, clearly tapering to a trim waist (inverted triangle). Keep natural head and neck proportions, maintain total height and cover both arms fully to the wrists.
Relative height: Ola / AF-F01 is approximately half of Damian's head height shorter than Damian / AF-M01. Compare upright figures on the same ground plane at the same distance from the viewer. Preserve natural adult proportions; do not equalize their height, enlarge heads or compress legs. For joint scenes include the pair_reference sheet as a scale reference in addition to the individual identity cards.
Style: mature editorial comic illustration; clean dark outlines, controlled warm cel shading, restrained highlights; natural adult anatomy. Maintain the approved character rendering.
Composition: {framing matching the illustration area; key faces and hands within safe margins}. Simple scene with a single focal action. The separate layout will contain all marketing copy.
Avoid: text, logos, watermarks, random UI glyphs, anatomical errors, extra fingers, mirrored identity details, enormous cartoon eyes, unrelated neon holograms, unrequested characters.
```

Usuń wiersze odnoszące się do nieużywanej osoby. Jeśli format wymaga odmiennego kadru, zachowaj twarz i czynność, zmień kompozycję. Nie rozciągaj ludzi. Dla faktycznego interfejsu edukacyjnego użyj poprawnego osobno składanego diagramu lub zweryfikowanego zrzutu.

Zasada rękawów AF-M01 obowiązuje także przy zmianie ubrania i tworzeniu kart. Nie przenoś jej na AF-F01. Historyczna karta AF-M01 v01 pokazuje odsłonięte przedramiona i nie może być używana jako aktualna referencja ubioru.

## Zmiana ubrania / korekta

```text
Use case: identity-preserve.
Image 1: edit target. Image 2: approved identity reference.
Change only: {one concrete correction}.
Preserve: the exact facial structure, eye colour and size, hairline, hairstyle, beard, skin tone, body proportions and all other approved details. Preserve the remaining scene and composition.
No new text, logos or unrelated objects.
```

## Karta wzorcowa

Jedna osoba na arkusz. Trzy pełne sylwetki: przód, trzy czwarte i profil, z identycznym ubraniem i skalą. Obok trzy zbliżenia: neutralne, przyjazne i skupione. Jednolite jasne tło, całe głowy, dłonie i buty, dużo miejsca między ujęciami. Nazwę i status dodaj w otaczającym dokumencie, nie każ modelowi pisać opisów w obrazie.

Rozróżnij cechy widoczne w źródle od zaprojektowanych rozszerzeń. Do kanonu trafia dopiero zaakceptowana karta. Dokładne prompty pierwszych kart zapisano w `character-generation.json`.
