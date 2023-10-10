import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDatePicker } from 'vuetify/labs/VDatePicker'

// initialise Vuetify
const vuetify = createVuetify({
  components: { VDatePicker, ...components },
  directives
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

// add Vuetify to vue app
app.use(vuetify)

app.mount('#app')
