import type { App } from 'vue'

const messages: Record<string, Record<string, string>> = {
  en: { greeting: 'Hello', farewell: 'Goodbye', counter: 'Counter' },
  fr: { greeting: 'Bonjour', farewell: 'Au revoir', counter: 'Compteur' },
}

export const I18nPlugin = {
  install(app: App, options: { locale: string }) {
    const locale = options.locale ?? 'en'

    app.config.globalProperties.$t = (key: string): string => {
      return messages[locale]?.[key] ?? key
    }

    app.provide('i18n', {
      t: (key: string) => messages[locale]?.[key] ?? key,
      locale,
    })
  },
}
