import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {
    console.log('PWA: Offline ready')
  },
})

const app = createApp(App)
app.mount('#app')
