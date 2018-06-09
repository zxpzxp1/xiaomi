// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'
import infiniteScroll from 'vue-infinite-scroll'
Vue.config.productionTip = false
Vue.use(VueLazyload,{
  loading: 'static/loading-svg/loading-bars.svg'
});
Vue.use(infiniteScroll);
Vue.use(Vuex);
const store=new Vuex.Store({
       state:{
           nickName:'',
           cartCount:0
       },mutations:{
           updateUserInfo(state,nickName){
               state.nickName=nickName;
           },
           updateCartCount(state,cartCount){
              state.cartCount+=cartCount;
           },
           initCartCount(state,cartCount){
             state.cartCount=0;
           }
      }
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
