# a11yfirst-course

Osobny, statyczny moduł deployowy dla landing page kursu `a11yfirst.pl`.

## Vercel

Ustaw w projekcie Vercel:

- Root Directory: `a11yfirst-course`
- Framework Preset: `Other`

`vercel.json` w tym katalogu wskazuje gotowy output w `public/`.

## Struktura

- `public/` - pliki wdrażane na produkcję
- `backups/` - kopia ostatniej wersji z Tpay, niewdrażana

## Zdjęcie Damiana

Aktualnie produkcyjny landing używa lokalnej grafiki zastępczej:

- `public/assets/damian-zlobicki.svg`

Żeby podmienić ją na docelowe zdjęcie:

1. wgraj plik do `public/assets/`, najlepiej jako `damian-zlobicki.jpg`
2. zmień pole `image` w `public/index.html` z `assets/damian-zlobicki.svg` na `assets/damian-zlobicki.jpg`
