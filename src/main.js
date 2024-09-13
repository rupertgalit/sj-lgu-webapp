import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Lara from '@primevue/themes/lara';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

import { login, signout } from './helper/auth-helper';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.provide('user', { login, signout });

app.mount('#app');
