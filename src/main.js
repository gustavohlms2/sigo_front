import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import Landing from './components/Landing';
import Signup from './components/Signup';
import Login from './components/Login';

import '../node_modules/bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Datetime } from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
 
Vue.use(Datetime)
Vue.use(VueRouter); //IMPORTANT

const routes = [
  { path: '/', component: Landing },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  el: '#app',
  router,
  render: h => {
    return h(App)
  }
});