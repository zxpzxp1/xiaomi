<template>
  <div>
           <nav-header></nav-header>
            <nav-bread>
                <span>订单确认</span>
            </nav-bread>
             <!-- order list -->
             <div class="page-title-normal checkout-title">
               <h2><span>Order content</span></h2>
             </div>
             <div class="item-list-wrap confirm-item-list-wrap">
               <div class="cart-item order-item">
                 <div class="cart-item-head">
                   <ul>
                     <li>Order contents</li>
                     <li>Price</li>
                     <li>Quantity</li>
                     <li>Subtotal</li>
                   </ul>
                 </div>
                 <ul class="cart-item-list">
                   <li v-for="item in cartList" v-if="item.checked=='1'">
                     <div class="cart-tab-1">
                       <div class="cart-item-pic">
                         <img :src="'/static/'+item.productImage" :alt="item.productName">
                       </div>
                       <div class="cart-item-title">
                         <div class="item-name">{{item.productName}}</div>

                       </div>
                     </div>
                     <div class="cart-tab-2">
                       <div class="item-price">{{item.salePrice}}</div>
                     </div>
                     <div class="cart-tab-3">
                       <div class="item-quantity">
                         <div class="select-self">
                           <div class="select-self-area">
                             <span class="select-ipt">×{{item.productNum}}</span>
                           </div>
                         </div>
                         <div class="item-stock item-stock-no">In Stock</div>
                       </div>
                     </div>
                     <div class="cart-tab-4">
                       <div class="item-price-total">{{(item.salePrice*item.productNum)}}</div>
                     </div>
                   </li>
                 </ul>
               </div>
             </div>

             <!-- Price count -->
             <div class="price-count-wrap">
               <div class="price-count">
                 <ul>
                   <li>
                     <span>Item subtotal:</span>
                     <span>{{subTotal}}</span>
                   </li>
                   <li>
                     <span>Shipping:</span>
                     <span>{{shipping}}</span>
                   </li>
                   <li>
                     <span>Discount:</span>
                     <span>{{discount}}</span>
                   </li>
                   <li>
                     <span>Tax:</span>
                     <span>{{tax}}</span>
                   </li>
                   <li class="order-total-price">
                     <span>Order total:</span>
                     <span>{{orderTotal}}</span>
                   </li>
                 </ul>
               </div>
             </div>
                <div class="order-foot-wrap">
                     <div class="prev-btn-wrap">
                        <router-link class="btn btn--m btn--red" to="/address">Previous </router-link>
                     </div>
                     <div class="next-btn-wrap">
                       <button class="btn btn--m btn--red" @click="payMent">Proceed to payment</button>

                     </div>
                </div>
                <nav-footer></nav-footer>
  </div>
</template>

<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modal from './../components/Modal'
    import axios from 'axios';
export default {
    data(){
         return {
            cartList:[],
            subTotal:0,
            shipping:100,
            discount:200,
            tax:400,
            orderTotal:'',
         }
    },
    components:{
    NavHeader,NavFooter,NavBread
    },
    mounted()
    {
       this.init();
    },methods:
    {
           init(){
               axios.get('/users/cartList').then((response)=>
               {
                     let res=response.data;
                     this.cartList=res.result;
                     this.cartList.forEach((item)=>{
                          if(item.checked=='1')
                          {
                              this.subTotal+=item.salePrice*item.productNum;

                          }
                     });
                      this.orderTotal = this.subTotal+this.shipping-this.discount+this.tax;
               })
           },payMent(){
              var addressId=this.$route.query.addressId;
              axios.post("/users/payMent",{addressId:addressId,orderTotal:this.orderTotal}).then((response)=>{
                            let res = response.data;
                            if(res.status=="0"){
                                 this.$router.push({path:'/orderSuccess?orderId='+res.result.orderId});
                            }
              })
           }
    }
}
</script>

<style>
</style>
