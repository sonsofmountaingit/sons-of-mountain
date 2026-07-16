# Translations Usage Guide

Quick reference for implementing translations throughout the site.

## System Overview

- **Default Language**: Bulgarian (BG)
- **Supported Languages**: BG, EN
- **Storage**: localStorage key = `language`
- **Provider**: LanguageProvider wraps entire app in layout.tsx
- **Type Safety**: Full TypeScript types for all translations

## Usage Examples

### In Client Components

```tsx
'use client'

import { useLanguage } from '@/lib/language-context'

export function MyComponent() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div>
      <h1>{t.trips.title}</h1>
      <button onClick={() => setLanguage('EN')}>English</button>
      <button onClick={() => setLanguage('BG')}>Български</button>
    </div>
  )
}
```

### Using the Helper Hook

```tsx
import { useTranslations } from '@/lib/use-translations'

export function TripCard() {
  const { t } = useTranslations()
  return <h2>{t.trips.book_now}</h2>
}
```

### In Server Components (Before RSC)

```tsx
import { translations } from '@/lib/translations'

export function StaticContent() {
  const t = translations.BG // Static Bulgarian
  return <p>{t.footer.copyright}</p>
}
```

### Monthly/Yearly Display

```tsx
function formatDate(date: Date, lang: Language) {
  const t = translations[lang]
  const month = t.months[date.getMonth()]
  const year = date.getFullYear()
  return `${month} ${year}`
}
```

### Nested Sections

```tsx
const { t } = useLanguage()

// Auth
<button>{t.auth.login}</button>
<p>{t.auth.forgot_password}</p>

// Trips
<h1>{t.trips.title}</h1>
<span>{t.trips.difficulty_easy}</span>

// Footer
<a>{t.footer.terms}</a>
<a>{t.footer.privacy}</a>

// Validation
<span>{t.validation.field_required}</span>
```

## Translation Structure

```
BG / EN
├── nav (7 items)
├── profile (7 items)
├── programs_menu (3 items)
├── search (7 items)
├── footer (32 items)
├── common (25 items)
├── auth (15 items)
├── dashboard (15 items)
├── trips (32 items)
├── programs (6 items)
├── destinations (4 items)
├── contact (19 items)
├── about (16 items)
├── blog (14 items)
├── gallery (12 items)
├── shop (35 items)
├── calendar (13 items)
├── nolimit (4 items)
├── testimonials (6 items)
├── hero (5 items)
├── errors (7 items)
├── validation (9 items)
├── social (8 items)
├── checkout (21 items)
├── faq (5 items)
├── months (12 items)
├── weekdays (7 items)
└── fullWeekdays (7 items)
```

## Adding New Translations

1. Add to both BG and EN in `src/lib/translations.ts`:
```tsx
myFeature: {
  title: 'Моя функция',           // BG
  // ... and separately ...
  title: 'My Feature',              // EN
}
```

2. Use in component:
```tsx
const { t } = useLanguage()
<h1>{t.myFeature.title}</h1>
```

3. Update `TRANSLATIONS.md` structure section if adding new top-level section

## Common Patterns

### Button Labels
```tsx
<button>{t.common.save}</button>
<button>{t.common.delete}</button>
<button>{t.trips.book_now}</button>
```

### Form Fields
```tsx
<label>{t.auth.email}</label>
<input placeholder={t.auth.email} />
<input placeholder={t.footer.firstname_placeholder} />
```

### Error Messages
```tsx
{error && <p>{t.errors.something_went_wrong}</p>}
{!email && <span>{t.validation.field_required}</span>}
```

### Status/State
```tsx
{isPending && <span>{t.common.loading}</span>}
{isSuccess && <span>{t.common.success}</span>}
<span>{t.common.active}</span>
```

### Links & Navigation
```tsx
<Link href="/contact">{t.nav.contact}</Link>
<Link href="/about">{t.nav.about}</Link>
<a href="#footer">{t.footer.privacy}</a>
```

## JSON Export

Translations are exported to `public/translations.json` for API endpoints or external services:

```ts
import translations from '@/public/translations.json'
console.log(translations.EN.nav.programs) // "Programs"
```

## Language Persistence

Language preference is automatically saved to localStorage. Returns to user's choice on next visit.

```ts
// Automatic - no code needed
setLanguage('EN') // Saves to localStorage
// Page reload → user stays on EN
```

## Type Safety

Full TypeScript support prevents typos:

```tsx
const { t } = useLanguage()

t.nav.programs ✓         // OK
t.nav.invalidKey ✗       // TypeScript error
t.invalid.key ✗          // TypeScript error

// Type hints on hover show all available keys
```

## Testing Translations

```tsx
import { translations } from '@/lib/translations'

test('all keys exist in both languages', () => {
  const bgKeys = Object.keys(translations.BG)
  const enKeys = Object.keys(translations.EN)
  expect(bgKeys).toEqual(enKeys)
})
```

## Performance Notes

- Translations are loaded in context at app root (LanguageProvider)
- Language changes don't require page reload
- localStorage is used for persistence (no database calls)
- Type safety prevents runtime errors
- Client-side rendering handles language switching smoothly

## Future Enhancements

- [ ] URL-based language selection (`/en/page`, `/bg/page`)
- [ ] Browser locale auto-detection
- [ ] Server-side language detection from headers
- [ ] Admin interface for managing translations
- [ ] i18n middleware for Next.js
- [ ] Translation file auto-generation tools
- [ ] Missing key detection in build
- [ ] Translation statistics dashboard

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/translations.ts` | Master translation definitions |
| `src/lib/language-context.tsx` | React context provider |
| `src/lib/use-translations.ts` | Helper hook |
| `public/translations.json` | JSON export for APIs |
| `TRANSLATIONS.md` | System documentation |
| `TRANSLATIONS_USAGE_GUIDE.md` | This file |
| `src/app/(frontend)/layout.tsx` | LanguageProvider wrapper |
| `src/components/ui/NavbarClient.tsx` | Language switcher UI |

## Support

For issues or questions about translations:
1. Check `TRANSLATIONS.md` for system overview
2. Review examples in `TRANSLATIONS_USAGE_GUIDE.md`
3. Search for key in `src/lib/translations.ts`
4. Add new translations following the structure pattern
