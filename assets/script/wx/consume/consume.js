var urls = require('config').urls
var config = require('config')
var util = require('../utils/util');

var consume = cc.Class({
  statics: {
      instance: null,
      getInstance: function () {
          if (consume.instance == null) {
            consume.instance = new consume();
          }
          return consume.instance;
      }
  },

  ctor: function () {
    this._gold = cc.sys.localStorage.getItem('Gold');
    if(!!!this._gold){
       let _gold = config.gold;
       cc.sys.localStorage.setItem('Gold',_gold);
       this._gold = _gold;
    }else{
      this._gold = parseInt(this._gold);
    }
    //console.log("consume ctor",this._gold);
  },
  getGold(){
    return this._gold;
  },
  addGold(num){
      if(typeof num != 'number'){
        return;
      }
      this._gold += num;
      //console.log("addGold",this._gold);
      cc.sys.localStorage.setItem('Gold',this._gold);
  },
  subGold(num,callBack){
    //console.log(num,callBack,this._gold)
    let flag = false;
    if(!!!num || num > this._gold){
      if(callBack && typeof callBack == "function"){
        callBack(flag)
      }
      return;
    }
    flag = true;
    this._gold -= num;
    if(this._gold < 0){
      this._gold = 0;
    }
    cc.sys.localStorage.setItem('Gold',this._gold);
    if(callBack && typeof callBack == "function"){
       //console.log(flag)
       callBack(flag)
    }
  }

})
// //// 类版本 全局函数太多可以使用类版本
// export default class consume {
//     // 类似构成函数
//     constructor(){
  
//     }; 
//     //  loadHongbaoWidget = function(target){
//     //     cc.loader.loadRes("wx/hongbao/hongbaoWidget",cc.Prefab,function(err,prefab){
//     //                 console.log(prefab)
//     //                 var hongbaoWidget = cc.instantiate(prefab);
//     //                 target.node.addChild(hongbaoWidget);
//     //                 hongbaoWidget.active = false;
//     //                 target.hongbaoWidget = hongbaoWidget;
//     //             })
//     //   };
    
//       getGold = function(callBack){
//         var url = urls.user +"/get_gold";
//         var param = {
//           };
//         util.request({
//             url: url,
//             data: param,
//             method: 'get',
//             success:res=>{
//                 console.log("getGold Success")
                
//                 console.log(res.data);
//                 if (callBack && typeof callBack == 'function') callBack(res.data.data)
//             },
//             fail: function (er) {
//                 console.error(er);
//               }
//         })    
//       };
//       addGold = function(callBack,_num){
//         var url = urls.user +"/add_gold";
//         var param = {
//             num:_num,
//           };
//         util.request({
//             url: url,
//             data: param,
//             header: { 'content-type': 'application/x-www-form-urlencoded' },
//             method: 'POST',
//             success:res=>{
//                 console.log("addGold Success")
//                 console.log(res.data);
//                 if (callBack && typeof callBack == 'function') callBack(res.data.data)
//             },
//             fail: function (er) {
//                 console.error(er);
//               }
//         })
//       };
//       subGold = function(callBack,_num){
//         var url = urls.user +"/sub_gold";
//         var param = {
//             num:_num,
//           };
//         util.request({
//             url: url,
//             data: param,
//             header: { 'content-type': 'application/x-www-form-urlencoded' },
//             method: 'POST',
//             success:res=>{
//                 console.log("getGold Success")

//                 console.log(res.data);
//                 if (callBack && typeof callBack == 'function') callBack(res.data.data)
//             },
//             fail: function (er) {
//                 console.error(er);
//               }
//         })    
//       };
// }

