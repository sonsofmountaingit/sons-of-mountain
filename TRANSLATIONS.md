# Translations Documentation

## Overview

The site supports two languages: Bulgarian (BG) and English (EN). The translation system uses a client-side context provider with localStorage persistence.

## Files

- `src/lib/translations.ts` - Core translation definitions (TypeScript)
- `src/lib/language-context.tsx` - React context provider for language management
- `src/lib/use-translations.ts` - Hook for accessing translations
- `public/translations.json` - JSON export of translations for external use
- `src/app/(frontend)/layout.tsx` - Wraps app with LanguageProvider

## Usage

### In Client Components

```tsx
'use client'

import { useLanguage } from '@/lib/language-context'

export function MyComponent() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div>
      <h1>{t.nav.programs}</h1>
      <button onClick={() => setLanguage('EN')}>
        Switch to English
      </button>
    </div>
  )
}
```

### Using the Hook

```tsx
import { useTranslations } from '@/lib/use-translations'

export function AnotherComponent() {
  const { language, setLanguage, t } = useTranslations()
  
  return <h1>{t.footer.company}</h1>
}
```

## Structure

Translations are organized into sections:

```
nav          - Navigation links
profile      - User profile menu items
programs_menu - Program selection menu
search       - Search panel text
footer       - Footer section text
common       - Common UI labels
auth         - Authentication text
dashboard    - User dashboard text
trips        - Trip/program listing text
contact      - Contact page text
about        - About page text
blog         - Blog section text
gallery      - Gallery section text
shop         - Shop/commerce text
calendar     - Calendar event text
months       - Month names
weekdays     - Day abbreviations
fullWeekdays - Full day names
```

## Adding New Translations

1. Add new keys to both `translations.BG` and `translations.EN` in `src/lib/translations.ts`
2. Update `public/translations.json` with the same structure
3. Use `t.your_section.your_key` in components

Example:
```tsx
// src/lib/translations.ts
search: {
  placeholder: 'Търси...',  // BG
  // ... and
  placeholder: 'Search...',  // EN
}

// In component
<input placeholder={t.search.placeholder} />
```

## Language Persistence

Language preference is stored in `localStorage` under the key `language`. The default is Bulgarian (BG).

## Types

Full type safety is provided via TypeScript:
```tsx
import type { Language, Translations } from '@/lib/translations'

const lang: Language = 'EN' // Only 'BG' or 'EN' allowed
const text: Translations = translations['BG']
```

## Navbar Implementation

The language switcher in the navbar is fully wired:
- Located in top-right corner
- Shows current language code (BG/EN)
- Dropdown with language options
- Updates all page content on selection
- Persists selection across sessions

## Export as JSON

To use translations outside React:
```ts
import translations from '@/public/translations.json'

console.log(translations.EN.nav.programs) // "Programs"
```

## Future Enhancements

- Add URL-based language selection (e.g., `/en/page` or `/bg/page`)
- Implement language auto-detection based on browser locale
- Add more languages as needed
- Create admin interface for translation management
- Implement server-side language detection from headers
