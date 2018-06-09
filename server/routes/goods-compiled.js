/**
 * Created by ccb on 2018/3/12.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.Promise = global.Promise;
//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/test');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.");
});
mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.");
});

//Goods.create({productId:'1',productName:39,salePrice:200,productNum:1,productImage:'1.jpg'},function(err,doc){
//	   if(!err){console.log(doc)}else
//	   	{console.log(err)}
//})

router.get("/", function (req, res, next) {
  var sort = req.param("sort");
  var page = parseInt(req.param("page"));
  var pageSize = parseInt(req.param("pageSize"));
  var priceLevel = req.param("priceLevel");
  var priceGt = '',
      priceLte = '';
  var skip = (page - 1) * pageSize;
  var params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;priceLte = 100;break;
      case '1':
        priceGt = 100;priceLte = 500;break;
      case '2':
        priceGt = 500;priceLte = 1000;break;
      case '3':
        priceGt = 1000;priceLte = 5000;break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    };
  }
  console.log("params", params);
  var goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({ 'salePrice': sort });
  goodsModel.exec(function (err, doc) {
    console.log('doc', doc);
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});
//加入到购物车
router.post("/addCart", function (req, res, next) {
  var userId = '100000077',
      productId = req.body.productId;
  var User = require('../models/users');
  User.findOne({ userId: userId }, function (err, userDoc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum++;
          }
        });
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: "1",
                msg: err2.message
              });
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              });
            }
          });
        } else {
          Goods.findOne({ productId: productId }, function (err1, doc) {
            if (err1) {
              res.json({
                status: "1",
                msg: err1.message
              });
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: "1",
                      msg: err2.message
                    });
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    });
                  }
                });
              }
            }
          });
        }
      }
    }
  });
});
module.exports = router;

//# sourceMappingURL=goods-compiled.js.map