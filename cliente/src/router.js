import Vue from "vue";
import Router from "vue-router";
import Landing from './views/Landing';
import Signup from './views/Signup';
import Login from './views/Login';

import '../node_modules/bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

/*
import '../node_modules/bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Datetime } from 'vue-datetime';
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css';

import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.http.headers.common['Content-Type'] = 'application/json';
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';

Vue.http.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin';

Vue.use(Datetime);
Vue.use(VueRouter); //IMPORTANT
*/

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: '/', component: Landing },
    { path: '/signup', component: Signup },
    { path: '/login', component: Login }
  ]
});
