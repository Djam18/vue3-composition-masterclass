import { createApp } from 'vue'
import App from './App.vue'
import GlobalButton from './components/registration/GlobalButton.vue'
import { vFocus } from './directives/vFocus'

const app = createApp(App)

// Global component registration — available in every template without importing
app.component('GlobalButton', GlobalButton)

// Global directive registration — v-focus auto-focuses elements on mount
app.directive('focus', vFocus)

app.mount('#app')
