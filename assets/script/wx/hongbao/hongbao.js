
var urls = require('config').urls
var config = require('config')
var util = require('../utils/util');

//// 类版本 全局函数太多可以使用类版本
export default class hongbao {
    // 类似构成函数
    constructor(){
  
    }; 
     loadHongbaoWidget = function(target,name){
        cc.loader.loadRes("wx/hongbao/hongbaoWidget",cc.Prefab,function(err,prefab){
                    console.log(prefab)
                    var hongbaoWidget = cc.instantiate(prefab);
                    target.node.addChild(hongbaoWidget);
                    // //适配高 宽
                    // var _size = hongbaoWidget.getContentSize();
                    // var tagSize = target.node.getContentSize();
                    // var scaleX = tagSize.width/_size.width;
                    // var scaleY = tagSize.height/_size.height;
                    // hongbaoWidget.setScale(scaleX,1)
 
                    hongbaoWidget.setPosition(cc.p(0,0))
                    hongbaoWidget.active = false;
                    name = name || "hongbaoWidget";
                    target[name] = hongbaoWidget;
                })
      };
    
     createHongbao = function(_price, _num){
        var url = urls.hongbao +"/create_hongbao";
        var param = {
            money: _price,
            peoplecount: _num,
            type: 1,
            blob: {
            }
          };
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log("create_hongbao Success")
                var d = res.data;
                console.log(d);
                util.pay(_price/100, null, null, null);
            },
            fail: function (er) {
                console.error(er);
              }
        })
      };
      
      //领取红包
       lingHongbao = function(_hongbaoId, _command){
        var url = urls.hongbao +"/ling_hongbao";
        var param = {
            hongbaoId: _hongbaoId,
            command: _command,
          };
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log("ling_hongbao Success")
                var d = res.data;
                console.log(d);
                //util.pay(_price/100, null, null, null);
            },
            fail: function (er) {
                console.error(er);
              }
        })
      };
    
    //查询某个红包信息
       getHongbaoInfo = function(_hongbaoId, _command){
        var url = urls.hongbao +"/get_hongbaoInfo";
        var param = {
            hongbaoId: _hongbaoId,
            command: _command,
          };
        util.request({
            url: url,
            data: param,
            success:res=>{
                console.log("get_hongbaoInfo Success",res)
                // var d = res.data;
                // console.log(d);
                // util.pay(_price/100, null, null, null);
            },
            fail: function (er) {
                console.error(er);
              }
        })
      };
    
        //查询所有领取的红包信息
       getHongBaoGetInfos = function(_hongbaoId, _command){
        var url = urls.hongbao +"/get_HongBaoGetInfos";
        var param = { };
        util.request({
            url: url,
            data: param,
            //header: { 'content-type': 'application/x-www-form-urlencoded' },
            //method: 'POST',
            success:res=>{
                console.log("get_HongBaoGetInfos Success",res)
                // var d = res.data;
                // console.log(d);
                // util.pay(_price/100, null, null, null);
            },
            fail: function (er) {
                console.error(er);
              }
        })
      };
    
    //查询所有创建的红包信息
       getHongBaoSendInfos = function(_hongbaoId, _command){
        var url = urls.hongbao +"/get_HongBaoSendInfos";
        var param = {
          };
        util.request({
            url: url,
            data: param,
            success:res=>{
                console.log("get_HongBaoSendInfos Success",res)
                // var d = res.data;
                // console.log(d);
                // util.pay(_price/100, null, null, null);
            },
            fail: function (er) {
                console.error(er);
              }
        })
      };
}



// const loadHongbaoWidget = function(target){
//     cc.loader.loadRes("wx/hongbao/hongbaoWidget",cc.Prefab,function(err,prefab){
//                 console.log(prefab)
//                 var hongbaoWidget = cc.instantiate(prefab);
//                 target.node.addChild(hongbaoWidget);
//                 hongbaoWidget.active = false;
//                 target.hongbaoWidget = hongbaoWidget;
//             })
//   };

// const createHongbao = function(_price, _num){
//     var url = urls.hongbao +"/create_hongbao";
//     var param = {
//         money: _price,
//         peoplecount: _num,
//         type: 1,
//         blob: {
//         }
//       };
//     util.request({
//         url: url,
//         data: param,
//         header: { 'content-type': 'application/x-www-form-urlencoded' },
//         method: 'POST',
//         success:res=>{
//             console.log("create_hongbao Success")
//             var d = res.data;
//             console.log(d);
//             util.pay(_price/100, null, null, null);
//         },
//         fail: function (er) {
//             console.error(er);
//           }
//     })
//   };
  
//   //领取红包
//   const lingHongbao = function(_hongbaoId, _command){
//     var url = urls.hongbao +"/ling_hongbao";
//     var param = {
//         hongbaoId: _hongbaoId,
//         command: _command,
//       };
//     util.request({
//         url: url,
//         data: param,
//         header: { 'content-type': 'application/x-www-form-urlencoded' },
//         method: 'POST',
//         success:res=>{
//             console.log("ling_hongbao Success")
//             var d = res.data;
//             console.log(d);
//             //util.pay(_price/100, null, null, null);
//         },
//         fail: function (er) {
//             console.error(er);
//           }
//     })
//   };

// //查询某个红包信息
//   const getHongbaoInfo = function(_hongbaoId, _command){
//     var url = urls.hongbao +"/get_hongbaoInfo";
//     var param = {
//         hongbaoId: _hongbaoId,
//         command: _command,
//       };
//     util.request({
//         url: url,
//         data: param,
//         success:res=>{
//             console.log("get_hongbaoInfo Success",res)
//             // var d = res.data;
//             // console.log(d);
//             // util.pay(_price/100, null, null, null);
//         },
//         fail: function (er) {
//             console.error(er);
//           }
//     })
//   };

//     //查询所有领取的红包信息
//   const getHongBaoGetInfos = function(_hongbaoId, _command){
//     var url = urls.hongbao +"/get_HongBaoGetInfos";
//     var param = { };
//     util.request({
//         url: url,
//         data: param,
//         //header: { 'content-type': 'application/x-www-form-urlencoded' },
//         //method: 'POST',
//         success:res=>{
//             console.log("get_HongBaoGetInfos Success",res)
//             // var d = res.data;
//             // console.log(d);
//             // util.pay(_price/100, null, null, null);
//         },
//         fail: function (er) {
//             console.error(er);
//           }
//     })
//   };

// //查询所有创建的红包信息
//   const getHongBaoSendInfos = function(_hongbaoId, _command){
//     var url = urls.hongbao +"/get_HongBaoSendInfos";
//     var param = {
//       };
//     util.request({
//         url: url,
//         data: param,
//         success:res=>{
//             console.log("get_HongBaoSendInfos Success",res)
//             // var d = res.data;
//             // console.log(d);
//             // util.pay(_price/100, null, null, null);
//         },
//         fail: function (er) {
//             console.error(er);
//           }
//     })
//   };

//   module.exports = {
//     loadHongbaoWidget:loadHongbaoWidget,
//     createHongbao: createHongbao,
//     lingHongbao: lingHongbao,
//     getHongbaoInfo: getHongbaoInfo,
//     getHongBaoGetInfos: getHongBaoGetInfos,
//     getHongBaoSendInfos: getHongBaoSendInfos,
  
//   }