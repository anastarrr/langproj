import { createApp } from 'vue'
import router from "./router/index.js";
import './style.css'
import App from './App.vue'
import BootstrapVue3 from "bootstrap-vue-3";
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
createApp(App).use(router).mount('#app');

