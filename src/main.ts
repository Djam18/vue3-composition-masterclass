import { createApp } from 'vue'
import App from './App.vue'
import GlobalButton from './components/registration/GlobalButton.vue'
import { vFocus } from './directives/vFocus'
import { I18nPlugin } from './plugins/i18n'
import { ToastPlugin } from './plugins/toast'

const app = createApp(App)

// Global component registration — available in every template without importing
app.component('GlobalButton', GlobalButton)

// Global directive registration — v-focus auto-focuses elements on mount
app.directive('focus', vFocus)

// Plugin installation — install(app, options) pattern
app.use(I18nPlugin, { locale: 'fr' })
app.use(ToastPlugin)

app.mount('#app')
