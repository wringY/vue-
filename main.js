import Vue from 'vue'
import router from './router/index'
import App from './app.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
window.vv = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})