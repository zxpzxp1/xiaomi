import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'
import HelloWorld from '@/components/HelloWorld'
import HelloWorld2 from '@/components/HelloWorld2'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'GoodsList',
    },
    {
      path: '/GoodsList',
      name: 'GoodsList',
      component:GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component:Cart
    },
    {
      path: '/address',
      name: 'Address',
      component:Address
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component:OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component:OrderSuccess
    },
    {
      path:'/HelloWorld',
      name: 'HelloWorld',
      component:HelloWorld
    },
    {
      path:'/HelloWorld2',
      name: 'HelloWorld2',
      component:HelloWorld2
    }
  ]
})
