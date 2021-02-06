import Vue from "vue";
import Router from "vue-router";
import Landing from './views/Landing';
import Signup from './views/Signup';
import Login from './views/Login';

import '../node_modules/bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: '/', component: Landing },
    { path: '/signup', component: Signup },
    { path: '/login', component: Login },
    { path: '/*', component: Login }
  ]
});
