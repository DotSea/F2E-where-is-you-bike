import { createApp } from 'vue';
import mitt from 'mitt';
import App from './App.vue';
import router from './router';

const app = createApp(App);

const eventBus = mitt();
app.config.globalProperties.eventBus = eventBus;
app.use(router).mount('#app');
