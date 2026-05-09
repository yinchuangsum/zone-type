import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { pinia } from './stores'
import router from './router'
import { TEXT_PROVIDER_KEY, HardcodedTextProvider } from './providers/text'

const DEFAULT_TEXT = 'the quick brown fox jumps over the lazy dog the quick brown fox jumps over the lazy dog the quick brown fox jumps over the lazy dog'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.provide(TEXT_PROVIDER_KEY, new HardcodedTextProvider({ texts: [DEFAULT_TEXT] }))

app.mount('#app')