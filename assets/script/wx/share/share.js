
var urls = require('config').urls
var config = require('config');
var global = require('global');
var globalFunc = require('globalFunc');
var util = require('../utils/util');
var consume = require('consume').getInstance();
var shareUtil = require('shareUtil').getInstance();
var self = null;
export default class share {
  constructor(){
    self = this;
    //this.shareTicket = ''  
    self._getStorage();
    self._url = [{url:'res/raw-assets/resources/share/share1.jpg'},
    {url:'res/raw-assets/resources/share/share2.jpg'}]; 
    this.updateShareMenu();
    this.showShareMenu();
    this.onShareAppMessage();
  };

  _getStorage(){
    let _sharedGroupList;
    let sharedGroupListItem = cc.sys.localStorage.getItem('sharedGroupList');
    if (!sharedGroupListItem) {
        sharedGroupListItem = new Array();
        cc.sys.localStorage.setItem('sharedGroupList', JSON.stringify(sharedGroupListItem));

        _sharedGroupList = sharedGroupListItem;
    } else {
        _sharedGroupList = JSON.parse(sharedGroupListItem);
    }
    let i = _sharedGroupList.length;
    while (i--) {
        let groupInfo = _sharedGroupList[i];
        // 删除过期记录
        if (!self.isToday(groupInfo.timestamp)) {
            console.log('timestamp Invalid, not today:', groupInfo.timestamp);
            _sharedGroupList.splice(i, 1);
        }
    }
    config.shareGroupTime = _sharedGroupList.length;
    console.log("config.shareGroupTime",config.shareGroupTime,_sharedGroupList)
  }
  _setStorage(){
    let groupInfo = {
      timestamp: new Date().getTime()
    }
    let _sharedGroupList;
    let sharedGroupListItem = cc.sys.localStorage.getItem('sharedGroupList');
    if (!sharedGroupListItem) {
        sharedGroupListItem = new Array();
        cc.sys.localStorage.setItem('sharedGroupList', JSON.stringify(sharedGroupListItem));

        _sharedGroupList = sharedGroupListItem;
    } else {
        _sharedGroupList = JSON.parse(sharedGroupListItem);
    }
    _sharedGroupList.push(groupInfo);

    config.shareGroupTime = _sharedGroupList.length;
    console.log('config.shareGroupTime,  today:', config.shareGroupTime);
    cc.sys.localStorage.setItem('sharedGroupList', JSON.stringify(_sharedGroupList));
  }
  isToday (time) {
    return new Date(time).toDateString() === new Date().toDateString();
  }
  _getImgUrl(index){  
    return self._url[index].url;
  }
  // getShareTicket(){
  //   return this.shareTicket
  // };
// 转发后； 点击 转发的卡片 会得到一个shareTicket 通过调用 wx.getShareInfo() 接口传入 shareTicket 可以获取群相关信
 updateShareMenu = function(){
  console.log("updateShareMenu")
  if (cc.sys.platform == cc.sys.WECHAT_GAME){
    wx.updateShareMenu({
      withShareTicket: true,
      success: function(res) {
        console.log("updateShareMenu true res:",res)
      },
      fail: function(res) 
      {
        console.log("updateShareMenu fail res:",res)
      },
      complete: function(res) {},
    })
  }
}; 
//  右上角可以点击转发按钮
showShareMenu = function(){
  console.log("showShareMenu")
  if (cc.sys.platform == cc.sys.WECHAT_GAME){
    wx.showShareMenu({
      withShareTicket: true,
      success: function(res) {
        console.log("showShareMenu true res:",res)
      },
      fail: function(res) 
      {
        console.log("showShareMenu fail res:",res)
      },
      complete: function(res) {},
    })
  }
}; 
 onShareAppMessage = function(){
  if (cc.sys.platform == cc.sys.WECHAT_GAME){ 
    wx.onShareAppMessage(function (res) {
      // 用户点击了“转发”按钮
      var _index = Math.random() > 0.5 ? 1 : 0;
      var _title = 0;
      var _titleIndex = (Math.floor(Math.random()*10)) % config.shareTitles['1'].length;
      _title = config.shareTitles['1'][_titleIndex].title;   
      return  {
        title :_title,
        imageUrl:self._getImgUrl(_index),
        query:"uid="+config.UID,
        success:res=>{
          console.log("onShareAppMessage success",res,self,this)
          if (res.shareTickets) {
            if (res.shareTickets && res.shareTickets[0] && self ){
              if(config.gamecenter_link){
                self.getShareInfo(res.shareTickets[0],self.shareGroup); 
              }
            }
          }
        },
        fail:res=>{
          console.log(res)
        }
      }
    })
  }
};
  //分享群
 shareGroup = function(groupid){
    var url = urls.user +"/add_group";
    var param = {
        groupid: groupid,
      };
    util.request({
        url: url,
        data: param,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success:res=>{
            var d = res.data;
        },
        fail: function (er) {
            console.error(er);
          }
    })      
};
 getShareOpenGid = function(res,callBack){
    var url = urls.share +"/getShareInfo";
    var param = {
      sessionKey:config.sessionkey,
      encryptedData:res.encryptedData,
      iv:res.iv,
    }
    util.request({
        url: url,
        data: param,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success:res=>{
            //服务器存储的用户数据
            console.log("send getShareInfo ",res)
            if(res.data && res.data.data && res.data.data.openGId){
              //保存群的openGID;
              config.groupOpenGID = res.data.data.openGId;
              if (callBack && typeof callBack == 'function') callBack(res.data.data.openGId)
            }
            
        },
        fail:res=>{
          console.log("send getShareInfo fail ",res)
        },
    })   
 };

 getShareOpenGidLocal = function(res, callBack) {
  util.decodeOpenId(res, function (openid) {
    if (openid && callBack && typeof callBack == 'function') {
      callBack(openid);
    }
  });
 };

 getShareInfo = function(_shareTicket,callBack){
  wx.getShareInfo({
    shareTicket:_shareTicket,
    success:res=>{
      //保存shareTicket
      config.shareTicket = _shareTicket;
      if(config.gamecenter_link){
        this.getShareOpenGid(res,callBack);
      }else{
        // 解密拿到群openid后保存到本地    
        this.getShareOpenGidLocal(res, function (gopenid) {
          console.log('get group open id:', gopenid);
          shareUtil.setShareGroupInfo(gopenid);
        })
      }
  
    },
    fail:res=>{
      console.log('getShareInfo fail',res)
    }
  });
};
 shareAppMessage = function(callBack,score = false,isSpecial =false,obj = false,isPeople = false,wxAddLayer =false,gold =false,isAssit =false){
  self._shareAppMessage(callBack,score,isSpecial,obj,isPeople,gold,wxAddLayer,isAssit)
};

shareAppMessageWithRevived =function(callBack,score = false,isSpecial =false,obj = false,isPeople = false,wxAddLayer =false,gold =false,isAssit = false){
  self._shareAppMessage(callBack,score,isSpecial,obj,isPeople,gold,wxAddLayer,isAssit,true);
}

shareAppMessageWithAssit = function(callBack,score = false,isSpecial =false,obj = false,isPeople = false,wxAddLayer =false,gold =false,isAssit = true){
  self._shareAppMessage(callBack,score,isSpecial,obj,isPeople,gold,wxAddLayer,isAssit)
}
/**
 *  share 炫耀成绩获得金币
 * 
 */
shareAppMessageWithGold = function(callBack, score, gold ,wxAddLayer,isSpecial =false,obj = false,isPeople = false,isAssit =false){
  self._shareAppMessage(callBack,score,isSpecial,obj,isPeople,gold,wxAddLayer,isAssit)
};
/**
 *  share 个人/群
 * 
 */
shareAppMessageWithImgUrl = function(callBack,score = false,isSpecial =false,obj = false,isPeople = true,wxAddLayer =false,gold =false,isAssit =false){
  self._shareAppMessage(callBack,score,isSpecial,obj,isPeople,gold,wxAddLayer,isAssit)
};
/**
 * share 分享给群
 */
shareAppMessageForGroup= function(callBack,score = false,isSpecial =false,obj = false,isPeople = false,wxAddLayer =false,gold =false,isAssit =false){
  self._shareAppMessage(callBack,score,isSpecial,obj,isPeople,gold,wxAddLayer,isAssit)
};
/**
 * 分享 特殊功能
 */
shareAppMessageWithSpecial = function(callBack,obj,score = false,isSpecial =true,isPeople = false,wxAddLayer =false ,gold =false,isAssit =false){
  self._shareAppMessage(callBack,score,isSpecial,obj,isPeople,gold,wxAddLayer,isAssit)
  console.log("shareAppMessageWithSpecial",)
};

_shareAppMessage(callBack = false,score = false,isSpecial= false,obj= false,isPeople= false,gold= false,wxAddLayer = false,isAssit = false,isRevive = false){
  console.log("_shareAppMessage",callBack,score,isSpecial,isPeople,gold,wxAddLayer,isAssit,isRevive)

  var _index = Math.random() > 0.5 ? 1 : 0;
  var _title = 0;
  if(typeof score == 'number'){
    var _titleIndex = (Math.floor(Math.random()*10)) % config.shareTitles['2'].length;
    _title = config.shareTitles['2'][_titleIndex].title;
    _title = globalFunc.getTextext({title:_title,score:score})
  }else{
    var _titleIndex = (Math.floor(Math.random()*10)) % config.shareTitles['1'].length;
    _title = config.shareTitles['1'][_titleIndex].title;   
  }
  var randString = null;
  if(isAssit || isRevive ){
    randString = util.randomString();
    var _titleIndex = (Math.floor(Math.random()*10)) % config.shareTitles['3'].length;
    _title = config.shareTitles['3'][_titleIndex].title;   
  }
  wx.shareAppMessage( {
    title: _title,
    imageUrl:self._getImgUrl(_index),
    query: isAssit ? "randStr=" + randString + "&uid="+config.UID : "uid="+config.UID,
    success:res=>{
      console.log("wx.shareAppMessage",res);
      var shareHasCallBack = false;
      if(!!!config.gamecenter_link){
        if(isSpecial){
          self._setStorage();
          if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
            shareHasCallBack =true
            callBack.call(obj);
          } 
        }
        if(gold){
          let shareWithGold = false;
          //let times = global.getStartGameTimes();
          //console.log(times,wxAddLayer._isShareWithGold);
          //if(times > config.startGameTimes){
              // 已获得一次金币,其他不获取
              if(wxAddLayer._isShareWithGold){
                  let isShareGold = Math.floor(Math.random()*10) % 3;       
                  if(isShareGold === 1){
                    consume.addGold(gold);
                    wxAddLayer._isShareWithGold = false;
                    shareWithGold = true;
                  };
              }
          //}
          if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
            shareHasCallBack =true
            callBack.call(obj,shareWithGold);
          } 
        }
      }
      if(isAssit){
        global.addRandString(randString);
        if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
          shareHasCallBack =true
          callBack.call(obj);
        } 
      }
      if(isRevive){
        global.addRandString(randString);
        if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
          shareHasCallBack =true
          callBack.call(obj);
        }      
      }
      var isGroup = false;
      if (res.shareTickets && res.shareTickets[0]){
        if(config.gamecenter_link){
          this.getShareInfo(res.shareTickets[0],this.shareGroup);
        }
        //保存shareTicket
        config.shareTicket = res.shareTickets[0];
        if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
            shareHasCallBack =  true;
            isGroup = true;
            callBack.call(obj,isGroup);
        } 
      };
    
      if(isPeople){
        //console.log("getShareInfo",isSpecial)
        if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
          shareHasCallBack =  true
          callBack.call(obj);
        } 
      }else{
        if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
          shareHasCallBack =  true
          callBack.call(obj,isGroup);
        } 
      }
      if(score){
        if(!!!shareHasCallBack && callBack && typeof callBack == "function"){
          shareHasCallBack =  true
          callBack.call(obj);
        }     
      }
      
    },
    fail:res=>{
      console.log("shareAppMessage fail",res)
    }
  });
};
 addFriend = function(_appID){
  var url = urls.user +"/add_friend"
  var param = {
    frienduid :_appID,
  }//config.getParam();
  util.request({
      url: url,
      data: param,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success:res=>{
          console.log("addFriend Success")
      }
  })
};

};



// // 转发后； 点击 转发的卡片 会得到一个shareTicket 通过调用 wx.getShareInfo() 接口传入 shareTicket 可以获取群相关信
// const  updateShareMenu = function(){
//   console.log("updateShareMenu")
//   if (cc.sys.platform == cc.sys.WECHAT_GAME){
//     wx.updateShareMenu({
//       withShareTicket: true,
//       success: function(res) {
//         console.log("updateShareMenu true res:",res)
//       },
//       fail: function(res) 
//       {
//         console.log("updateShareMenu fail res:",res)
//       },
//       complete: function(res) {},
//     })
//   }
// }(); 
// const  showShareMenu = function(){
//   console.log("showShareMenu")
//   if (cc.sys.platform == cc.sys.WECHAT_GAME){
//     wx.showShareMenu({
//       withShareTicket: true,
//       success: function(res) {
//         console.log("showShareMenu true res:",res)
//       },
//       fail: function(res) 
//       {
//         console.log("showShareMenu fail res:",res)
//       },
//       complete: function(res) {},
//     })
//   }
// }(); 
// const onShareAppMessage = function(){
//   if (cc.sys.platform == cc.sys.WECHAT_GAME){ 
//     console.log("onShareAppMessage")
//     wx.onShareAppMessage(function (res) {
//       console.log("onShareAppMessage",res)
//       // 用户点击了“转发”按钮
//       return  {
//         //title: '转发标题',
//         imageUrl: canvas.toTempFilePathSync({
//           destWidth: 500,
//           destHeight: 400
//         }),
//         query:{
//           key1:123456,
    
//         },
//         success:res=>{

//         if (res.shareTickets) {
//             wx.getShareInfo({
//               // 请问这里的shareTickets为什么是数组类型，并不允许或出现一次转发多个群组的情况啊
//               // 如果是有其他使用情况，还请做说明，指点指点，谢谢。
//               shareTicket: res.shareTickets[0],
//               success:er=>{
//                 console.log(er)
//               },
//               fail() { }
//             })
//           }
//         },
//         fail:res=>{
//           console.log(res)
//         }
//       }
//     })
//   }
// }();
//   //分享群
// const shareGroup = function(groupid){
//     var url = urls.user +"/add_group";
//     var param = {
//         groupid: groupid,
//       };
//     util.request({
//         url: url,
//         data: param,
//         header: { 'content-type': 'application/x-www-form-urlencoded' },
//         method: 'POST',
//         success:res=>{
//             console.log("add_group Success")
//             var d = res.data;
//             console.log(d);
//         },
//         fail: function (er) {
//             console.error(er);
//           }
//     })      
// };
// const getShareInfo = function(res,callBack){
//   wx.getShareInfo({
//     shareTicket:res.shareTickets[0],
//     success:res=>{
//       var url = urls.share +"/getShareInfo";
//       var param = {
//         sessionKey:config.sessionkey,
//         encryptedData:res.encryptedData,
//         iv:res.iv,
//       }
//       util.request({
//           url: url,
//           data: param,
//           header: { 'content-type': 'application/x-www-form-urlencoded' },
//           method: 'POST',
//           success:res=>{
//               //服务器存储的用户数据
//               console.log("send getShareInfo ",res)
//               if (callBack && typeof callBack == 'function') callBack(res.data.data.openGId)
//           },
//           fail:res=>{

//           },
//       })            
//     },
//     fail:res=>{
//       console.log('getShareInfo fail',res)
//     }
//   });
// };
// const shareAppMessage = function(uid){
//   uid = config.UID;
//   console.log("shareAppMessage",uid)
//   wx.shareAppMessage( {
//     title: '转发标题',
//     imageUrl: canvas.toTempFilePathSync({
//       destWidth: 500,
//       destHeight: 400
//     }),
//     query:{
//       uid: uid ,
//     },
//     success:res=>{
//       console.log("shareAppMessage",res);
//       if (res.shareTickets && res.shareTickets[0]){
//         console.log('shareAppMessage getShareInfo')
//         getShareInfo(res,shareGroup); 
//       }
      
//     },
//     fail:res=>{
//       console.log("shareAppMessage fail",res)
//     }
//   });
// };
// const addFriend = function(_appID){
//   var url = urls.user +"/add_friend"
//   var param = {
//     appid :_appID,
//     frienduid :"chen",
//   }//config.getParam();
//   util.request({
//       url: url,
//       data: param,
//       header: { 'content-type': 'application/x-www-form-urlencoded' },
//       method: 'POST',
//       success:res=>{
//           console.log("addFriend Success")
//       }
//   })
// };


// module.exports = {  
//   shareAppMessage: shareAppMessage,
//   getShareInfo: getShareInfo,
//   addFriend: addFriend,
//   shareGroup:shareGroup,
// }