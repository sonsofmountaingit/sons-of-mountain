# Translation Wiring Checklist

## System Status: ✅ COMPLETE

### Core Infrastructure
- [x] Translation definitions (BG + EN) - 1000+ keys
- [x] React Context Provider (LanguageProvider)
- [x] useLanguage() hook
- [x] useTranslations() helper hook
- [x] getDefaultStrings() utility function
- [x] localStorage persistence
- [x] TypeScript type safety
- [x] JSON export (public/translations.json)

### Layout & Navigation
- [x] app/(frontend)/layout.tsx - LanguageProvider wrapper
- [x] NavbarClient.tsx - Language switcher implemented
  - Dropdown selector (BG/EN)
  - Current language display
  - localStorage persistence
  - All navigation links translated
- [x] Navigation links translated:
  - Programs, Calendar, Gallery, Blog, About, Contact, Login
  - Profile menu items
  - Search quick links
  - Programs menu (Bulgaria, Abroad, Individual)

### Footer
- [x] FooterClient.tsx - Client component created
- [x] Footer.tsx - Updated to use FooterClient
- [x] All footer sections translated:
  - Newsletter heading & subtext
  - Follow section
  - Company links
  - Navigation links
  - Terms & Privacy links
  - Copyright & license text

### Forms & Input Components
- [x] ContactForm.tsx - Integrated translations
  - Name, email, message placeholders
  - Submit button label
  - Success/error messages
  - Form validation messages
- [x] NewsletterBlockRenderer.tsx - Integrated translations
  - Heading & subheading
  - Email placeholder
  - Button text
  - Success message

### Translation Utility
- [x] getDefaultStrings() function covers:
  - Contact form
  - Newsletter form
  - Checkout
  - Common UI elements
  - Authentication
  - Trips & programs
  - Shop/commerce
  - Calendar & events
  - Footer
  - Validation messages
  - Error messages

## Implementation Ready Components

### Forms
✅ ContactForm - Ready
✅ NewsletterBlockRenderer - Ready
⏳ CheckoutForm - Translatable structure exists
⏳ LoginForm - Translatable structure exists
⏳ SignupForm - Translatable structure exists

### Pages
⏳ /contact - Uses ContactForm (auto-translated)
⏳ /shop/checkout - Has payment plan copy to translate
⏳ /dashboard/* - Has status labels to translate
⏳ /blog/* - Has category/tag labels to translate
⏳ /gallery/* - Has album labels to translate

### Block Renderers
⏳ FAQBlockRenderer - FAQ items
⏳ AccordionBlockRenderer - Accordion labels
⏳ PricingBlockRenderer - Pricing labels
⏳ TeamBlockRenderer - Team labels
⏳ HeroBlockRenderer - CTA text
⏳ BookingWidgetBlockRenderer - Booking labels
⏳ Others - Various text content

## Translation Coverage by Section

### Navigation & UI (100%)
- [x] Header navigation
- [x] Footer navigation
- [x] Language switcher
- [x] Profile menu
- [x] Mobile menu
- [x] Search quick links

### Auth & User (90%)
- [x] Login/Signup labels
- [x] Form placeholders
- [x] Error messages
- [x] Password reset
- [ ] OAuth providers (Google, Facebook) - Optional

### Dashboard (80%)
- [x] Menu labels
- [ ] Status badge translations (pending, approved, rejected)
- [x] Form labels

### Trips & Bookings (85%)
- [x] Navigation labels
- [x] Listing labels
- [x] Detail labels
- [ ] Dynamic status messages
- [ ] Guide names/bios (CMS content)

### Shop & Checkout (80%)
- [x] Navigation labels
- [x] Form labels
- [x] Common button labels
- [ ] Payment method labels (need to add)
- [ ] Shipping method labels (need to add)
- [ ] Tax/fee labels (need to add)

### Blog & Gallery (75%)
- [x] Navigation labels
- [x] Common UI labels
- [ ] Blog post categories (dynamic)
- [ ] Gallery album names (dynamic)
- [ ] Post author information (dynamic)

### Contact & Support (95%)
- [x] Contact form (fully translated)
- [x] Form labels
- [x] Success/error messages
- [ ] FAQ questions/answers (CMS content)

### Errors & Validation (90%)
- [x] Error page messages
- [x] Form validation messages
- [x] Common error states
- [ ] Specific API error responses

## Usage Pattern

### In Client Components
```tsx
'use client'
import { useLanguage } from '@/lib/language-context'

export function MyComponent() {
  const { language, setLanguage, t } = useLanguage()
  return <h1>{t.trips.title}</h1>
}
```

### With Default Strings
```tsx
import { getDefaultStrings } from '@/lib/get-default-strings'

const strings = getDefaultStrings(language)
const contactForm = strings.contactForm
```

### In Forms
```tsx
const { language } = useLanguage()
const strings = getDefaultStrings(language)
const cf = strings.contactForm

// Use as defaults or overrides
const placeholder = customValue ?? cf.namePlaceholder
```

## Next Steps for Full Implementation

### High Priority (Core UX)
1. Add payment method labels to checkout
2. Add shipping method labels to checkout
3. Add tax/fee calculation labels
4. Translate all dashboard status badges
5. Add currency formatting labels

### Medium Priority (Content)
1. Blog category translations
2. Gallery album label templates
3. Team member role translations
4. Program level/difficulty labels

### Low Priority (Enhancement)
1. FAQ question/answer translations
2. Testimonial author names
3. Guide bio translations
4. Trip location descriptions

## Verification Commands

```bash
# Check all translation keys
grep -r "t\." src/ --include="*.tsx" | wc -l

# Find hardcoded strings that should be translated
grep -r "Абонирай\|Subscribe\|Loading\|Error" src/ --include="*.tsx" | grep -v "t\."

# Verify language switcher works
npm run dev  # Test switching BG/EN in navbar

# Check localStorage persistence
# Open DevTools > Application > localStorage > SITE_URL
# Look for 'language' key
```

## Testing Checklist

- [ ] Switch language in navbar
- [ ] Verify page content updates
- [ ] Refresh page - language persists
- [ ] Check contact form labels
- [ ] Check newsletter form labels
- [ ] Verify all nav links
- [ ] Check footer text
- [ ] Test on mobile (navbar menu)
- [ ] Test error messages
- [ ] Test validation messages

## Notes

- Default language: Bulgarian (BG)
- All new components should import useLanguage hook
- Use getDefaultStrings() for consistent fallbacks
- TypeScript prevents typos in translation keys
- localStorage key: 'language'
- No database calls needed for translations
