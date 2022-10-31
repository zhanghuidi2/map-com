import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import {mapVue} from '../packages/components/binyaMap/index';

const app = createApp(App);

app.use(mapVue);

app.mount('#app');

