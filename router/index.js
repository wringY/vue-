import Vue from 'vue';
import Router from 'vue-router'
import { resolve } from 'path';
Vue.use(Router)
const login = resolve => require(['../pages/login.vue'],resolve)
export default new Router({
    routes: [
        {
            path: '',
            name: 'login',
            component: login
        }
    ]
})