// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import Vuex from 'vuex'
import { HTTP as axios } from './axios.js';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
//import 'devextreme/dist/css/dx.generic.custom-scheme.css';
// import 'assets/dx.generic.custom-scheme.css';
var VueCookie = require('vue-cookie');

Vue.use(VueCookie);
Vue.use(Vuex)
Vue.prototype.$http = axios;

Vue.config.productionTip = false


const store = new Vuex.Store( {
	state: {
		title: ''
	},
	mutations: {
		rtChangeTitle( state, value ) {
			state.title = value;
			document.title = ( state.title ? state.title + ' - ' : '' );
		}
	}
} );


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App: () => import('./layout/Main/Main.vue') },
  template: '<App/>',

})
