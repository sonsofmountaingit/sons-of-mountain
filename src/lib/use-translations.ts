import { useLanguage } from './language-context'

export function useTranslations() {
  const { language, setLanguage, t } = useLanguage()
  return { language, setLanguage, t }
}
