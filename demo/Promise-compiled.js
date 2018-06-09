import _slicedToArray from "babel-runtime/helpers/slicedToArray";
import _Promise from "babel-runtime/core-js/promise";
var checkLogin = function checkLogin() {
  return new _Promise(function (resolve, reject) {
    var flag = document.cookie.indexOf("userId") > -1 ? true : false;

    if (flag = true) {
      resolve({
        status: 0,
        result: true
      });
    } else {
      reject("error");
    }
  });
};

var getUserInfo = function getUserInfo() {
  return new _Promise(function (resolve, reject) {
    var userInfo = {
      userId: "101"
    };
    resolve(userInfo);
  });
};

checkLogin().then(function (res) {
  if (res.status == 0) {
    console.log("login success");
    return getUserInfo();
  }
}).catch(function (error) {
  console.log("errrs:" + error);
}).then(function (res2) {
  console.log("userId:" + res2.userId);
});

_Promise.all([checkLogin(), getUserInfo()]).then(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      res1 = _ref2[0],
      res2 = _ref2[1];

  console.log("result1:" + res1.result + ",result2:" + res2.userId);
});

//# sourceMappingURL=Promise-compiled.js.map