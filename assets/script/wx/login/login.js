var urls = require('config').urls
var config = require('config')
var util = require('../utils/util');
var userOperate = require('../userOperate/userOperate');
userOperate = new userOperate();
// 获取用户信息
const getUseInfo = function(){
  if(cc.sys.platform == cc.sys.WECHAT_GAME){
      wx.getUserInfo({
          success:res=>{
              console.log(res)
              config.userInfo = res.userInfo            
              userOperate.setUserInfo()
          },
      })
  }
};

const login = function (code, success,fail) {
  var param = config.getParam();
  param["appsign"] = util.sign(param);
  param["js_code"] = code;
  util.request({
    url: urls.login,
    data: param,
    success: function (res) {
      var d = res.data;
      if (d && (d.ecode == 0 || d.ecode == 2)) {
        console.log("login +",res)
        if(res.data["uid"]){
          config.UID = res.data["uid"] ;
        }
        if(res.data['sessionkey']){
          config.sessionkey = res.data.sessionkey;
        }
        // 登录成功 获取用户数据 再登录回调
        userOperate.getUserData(function(){
          if (success && typeof success == 'function') success();
        });
        
      } else {
        var msg = "server login fail." + JSON.stringify(res);
        if (fail && typeof fail == 'function') fail();
      }
    },
    fail: function (er) {
      console.error(er);
      if (fail && typeof fail == 'function') fail();
    }
  });
}
module.exports = {
  login: login,
  getUseInfo:getUseInfo,
}