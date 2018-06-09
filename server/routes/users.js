var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users');
require('./../util/util');


mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});
mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/test', function(req, res, next) {
  res.send('test');
});
router.post('/login', function(req, res, next) {
  var param={userName:req.body.userName,userPwd:req.body.userPwd};
  Users.findOne(
    param,function(err,doc){
           if(err)
           {
               res.json({
               status:'1',
               msg:err.message
             });
           }else
           {
                if(doc){
                  res.cookie("userId",doc.userId,{
                    path:'/',
                    maxAge:1000*60*60
                  });
                  res.cookie("userName",doc.userName,{
                    path:'/',
                    maxAge:1000*60*60
                  });
             //     req.session.user=doc;
                  res.json({
                    status:'0',
                    msg:'',
                    result:{
                      userName:doc.userName
                    }
                  });
                }else
                {
                  res.json({
                    status:'1',
                    msg:'账号密码错误',
                    result:''
                  });

                }
           }
    }
  )
});
//登出
router.post('/loginOut',function(req,res,next){
  res.cookie("userId",'',{
       path:'/',
       maxAge:-1
  });
  res.cookie("userName",'',{
    path:'/',
    maxAge:-1
  });
  res.json({status:'0',
            msg:'',
            result:''});
})
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
//查询当前用户的购物车数据
router.get('/cartList',function(req,res,next)
{
   var userId=req.cookies.userId;
    Users.findOne(
    {userId:userId},function(err,doc){
        if(err)
        {
          res.json({
            status:'1',
            msg:err.message
          });
        }else
        {
            if(doc) {
              res.json({status:'0',msg:'',result:doc.cartList})
            }

        }
    }

  )
})
//购物车删除
router.post('/cartDel',function(req,res,next)
{
       var userId=req.cookies.userId;
       var productId=req.body.productId;
       Users.update({'userId':userId},
         {$pull:{'cartList':{
            'productId':productId
           }
         }
         },function(err,doc){
         if(err) {
           res.json({
             status:'1',
             msg:err.message
           });
         }else
         {
           if(doc) {
             res.json({status:'0',msg:'',result:""})
           }
         }
         });
});
//修改商品数量
router.post("/cartEdit", function (req,res,next){
       var userId=req.cookies.userId;
       var productId=req.body.productId;
       var productNum = req.body.productNum;
       var checked = req.body.checked;
       Users.update({"userId":userId,"cartList.productId":productId},
         {"cartList.$.productNum":productNum,"cartList.$.checked":checked},function(err,doc)
         {
           if(err) {
             res.json({
               status:'1',
               msg:err.message
             });
           }else
           {
              if(doc) {
               res.json({status:'0',msg:'',result:""})
             }
           }
         });
});
//地址列表
router.get('/addressList',function(req,res,next){
        var userId=req.cookies.userId;
        Users.findOne({'userId':userId},function(err,doc)
        {
          if(err) {
            res.json({
              status:'1',
              msg:err.message
            });}else
          {
            res.json({
                status:'0',
                result:doc.addressList,
                msg:''
            })
          }

        })
});
//设置缺省值
router.post('/setDefault',function(req,res,next){
       var userId=req.cookies.userId;
       var addressId=req.body.addressId;
       Users.findOne({'userId':userId},function(err,doc)
       {
        if(err) {
           res.json({
           status:'1',
           msg:err.message
         });}else
       {
           var addressList = doc.addressList;
           addressList.forEach((item)=>{
                   if(item.addressId==addressId)
                   {
                      item.isDefault=true
                   }else
                   {
                     item.isDefault=false
                   }
           })
      }
         doc.save(function(err1,doc1){
           if(err1){
             res.json({
               status:'1',
               msg:err.message,
               result:''
             });
           }else{
             res.json({
               status:'0',
               msg:'',
               result:''
             });
           }
         });
  })
});
//删除地址列表
router.post('/delAddress',function(req,res,next){
  var userId=req.cookies.userId;
  var addressId=req.body.addressId;
  Users.update({'userId':userId},
    {$pull:{'addressList':{
      'addressId':addressId
    }
    }
    },function(err,doc){
      if(err) {
        res.json({
          status:'1',
          msg:err.message
        });
      }else
      {
        if(doc) {
          res.json({status:'0',msg:'',result:""})
        }
      }
    });
});
//订单支付
router.post("/payMent",function(req,res,next){
          var userId=req.cookies.userId;
          var orderTotal=req.body.orderTotal;
          var addressId = req.body.addressId;
          Users.findOne(
            {userId:userId},function(err,doc){
              if(err) {
                res.json({
                  status:'1',
                  msg:err.message
                });
              }else
              {
                  var address = '',goodsList = [];
                 //获取地址信息
                 doc.addressList.forEach((item)=>{
                     if(item.addressId==addressId)
                     {
                       address=item;
                     }
                 })
                //获取用户购物车的购买商品
                doc.cartList.filter((item)=>{
                    item.checked='1';
                    goodsList.push(item);
                })
                var platform = '622';
                var r1 = Math.floor(Math.random()*10);
                var r2 = Math.floor(Math.random()*10);
                var sysDate = new Date().Format('yyyyMMddhhmmss');
                var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
                var orderId = platform+r1+sysDate+r2;
                var order = {
                  orderId:orderId,
                  orderTotal:orderTotal,
                  addressInfo:address,
                  goodsList:goodsList,
                  orderStatus:'1',
                  createDate:createDate
                };
                doc.orderList.push(order);
                doc.save(function (err1,doc1) {
                  if(err1){
                    res.json({
                      status:"1",
                      msg:err.message,
                      result:''
                    });
                  }else{
                    res.json({
                      status:"0",
                      msg:'',
                      result:{
                        orderId:order.orderId,
                        orderTotal:order.orderTotal
                      }
                    });
                  }
                });

              }

            }

          )


})
//查询订单信息
router.get('/orderDetail',function(req,res,next){
  var userId=req.cookies.userId;
  var orderId=req.param("orderId");
  Users.findOne({'userId':userId},function(err,doc)
  {
    if(err) {
      res.json({
        status:'1',
        msg:err.message
      });}else
      {
         var  orderList=doc.orderList;
         if(orderList.length>0)
         {
           var orderTotal = 0;
           orderList.forEach((item)=>{
             if(item.orderId == orderId){
               orderTotal = item.orderTotal;
             }
           });
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId:orderId,
                orderTotal:orderTotal
              }
            })
         }else
         {
           res.json({
             status:"0",
             msg:'',
             result:'无此订单'
           })


         }


      }
  })
});
//查询购物车数量
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    console.log("userId:"+req.cookies.userId);
    var userId = req.cookies.userId;
    Users.findOne({"userId":userId}, function (err,doc) {
      if(err){
        res.json({
          status:"0",
          msg:err.message
        });
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        });
      }
    });
  }else{
    res.json({
      status:"0",
      msg:"当前用户不存在"
    });
  }
});
module.exports = router;
