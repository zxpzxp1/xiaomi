<template>
    <div>
     <nav-header></nav-header>
     <nav-bread>
         <span>商品</span>
     </nav-bread>
   <div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">排序:</span>
      <a @click="sortGoods" href="javascript:;" class="default cur">缺省</a>
      <a href="javascript:void(0)" class="price">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">过滤</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
         <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>价格:</dt>
                <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
                <dd v-for="(item,index) in priceFilter">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>
      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item,index) in goodsList">
              <div class="pic">
                <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
           <div class="view-more-normal"   v-infinite-scroll="loadMore"
                                     infinite-scroll-disabled="busy"
                                     infinite-scroll-distance="10">
           <img src='../assets/loading-svg/loading-spinning-bubbles.svg' v-show=loading></img></div>
        </div>
      </div>
    </div>
  </div>
</div>
   <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
<nav-footer></nav-footer>
    </div>
</template>
<script>

      import NavHeader from 'components/NavHeader.vue';
      import NavBread from 'components/NavBread.vue'
      import NavFooter from 'components/NavFooter.vue'
      import Modal from 'components/Modal.vue'
      import axios from 'axios';
    export default{
        data(){
            return {
                    goodsList:[],
                    sortFlag:true,
                    page:1,
                    pageSize:8,
                    busy:true,
                    loading:false,
                    priceFilter:[{
                      startPrice:'0',
                      endPrice:'100'
                    },{
                      startPrice:'100',
                      endPrice:'500'
                    },{
                      startPrice:'500',
                      endPrice:'1000'
                    },{
                      startPrice:'1000',
                      endPrice:'5000'
                    }
                    ],
                    priceChecked:'all',
                    filterBy:false,
                    overLayFlag:false
            }
        },components: {
        NavHeader,NavBread,NavFooter,Modal
    },mounted: function () {
        this.getGoodsList();
    },methods: {
        getGoodsList(flag){
          var param={
                       page:this.page,
                       pageSize:this.pageSize,
                       sort:this.sortFlag?1:-1,
                       priceLevel:this.priceChecked
                    };
          this.loading = true;
          axios.get('/goods',{params:param}).then((result)=>{
              var res=result.data;
              this.loading = false;
               if(res.status=="0"){
                   if(flag){
                          this.goodsList = this.goodsList.concat(res.result.list);
                            if(res.result.count==0){
                                                    this.busy = true;
                              }else{
                                                    this.busy = false;
                              }
                   }else
                   {
                         this.goodsList=res.result.list;
                         this.busy = false;
                   }
              }
          });
        },
        loadMore(){
                        this.busy = true;
                        setTimeout(() => {
                          this.page++;
                          this.getGoodsList(true);
                        }, 500);
        },sortGoods(){
             this.sortFlag=!this.sortFlag;
             this.page=1;
             this.getGoodsList();
        }
        ,showFilterPop(){
             this.overLayFlag=true;

        },closePop()
        {
           this.filterBy=false;
           this.overLayFlag=false;
        },setPriceFilter(index){
          this.priceChecked = index;
          this.page = 1;
          this.getGoodsList();
        },addCart(productId){
            axios.post('/goods/addCart',{productId:productId}).then((res)=>{
                         if(res.status='0')
                         {
                            alert('加入成功');
                            this.$store.commit("updateCartCount",1);
                         }else{
                              alert(res.msg);
                         }
                     });
        }
    }
    }

</script>
