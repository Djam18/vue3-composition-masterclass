import { createApp } from 'vue'
import App from './App.vue'
import GlobalButton from './components/registration/GlobalButton.vue'

const app = createApp(App)

// Global component registration — available in every template without importing
app.component('GlobalButton', GlobalButton)

app.mount('#app')
