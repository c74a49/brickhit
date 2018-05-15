///////////////////////////////////////////
//定义 用户操作  上传数据或拉取数据
/////////////////////////////////////////////
var global = require('../global/global');
var urls = require('config').urls
var config = require('config')
var util = require('../utils/util');

//// 类版本 全局函数太多可以使用类版本
var self = null;
export default class userOperate {
  // 类似构成函数
  constructor(){
    self  = this;

  }; 
  
    // 上传 分数
    setScore = function(_score){
        if(!!!config.gamecenter_link){
            this._setStorageScore(_score);
            return;
        }
        var score = global.getUserDataInfoByName('score');
        if(!!!score || score < _score){
            this._setScore(_score);
        }
        var score = global.getUserDataInfoByName('weekScore');
        if(!!!score || score < _score){
            this._setScore(_score,"weekScore","set_week_score");
            this.setFriendsRankScore(_score);
        }
    }
    /**
     * 设置本地分数问题
     */
    _setStorageScore = function(_score){
        var score = cc.sys.localStorage.getItem('score');
        if(!!!score || parseInt(score) < _score){
            cc.sys.localStorage.setItem('score',score);
            global.setUserDataInfoByName('score',_score);
        }
        var timetamp = cc.sys.localStorage.getItem('timetamp');
        if(timetamp){
            if(global.isWeekTime(timetamp) ){
                var _storageScore = cc.sys.localStorage.getItem('weekScore');
                if(!!!_storageScore || parseInt( _storageScore ) < _score){
                    this.__setStorage(_score);
                }                 
            }else{
                this.__setStorage(_score);   
            }
        }else{
            this.__setStorage(_score);
        }

    }
    __setStorage(__score){
        console.log("__SetStorage",__score);
        cc.sys.localStorage.setItem('weekScore',__score);
        global.setUserDataInfoByName('weekScore',parseInt(__score));
        var time = global.getTimestamp();
        cc.sys.localStorage.setItem('timetamp',time);
        this.setFriendsRankScore(__score);
    }
    _setScore  = function(_score,dataName = "score", setWeek = "set_score"){
        var url = urls.user +"/"+setWeek;
        var param = {}//config.getParam();
        param["score"] = _score;
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log("setScore Success",res)
                global.setUserDataInfoByName(dataName,_score);

            }
        })       
    }
    /**
     * 设置真实好友分数
     */
    setFriendsRankScore = function(score){

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
             var weekScore = global.getUserDataInfoByName('weekScore');
             if(!!!weekScore || weekScore <= score){
                var time = global.getTimestamp();
                var _kvData = new Array();
                score = score.toString();
                time = time.toString();
                _kvData.push({key:'score',value:score},{key:'timestamp',value : time});
                wx.setUserCloudStorage({
                    KVDataList:_kvData,
                    success:res=>{
                        console.log(res);
                        global.setUserDataInfoByName('weekScore',parseInt(score));
                    },
                    fail:res=>{
                        console.log("fail",res);
                    }
                })
            }
        }    
    }
    //当局本地分数
    setLocalScore = function(score){
        this._localScore = score;
    }

    getLocalScore = function(){
        return this._localScore || 0;
    }

    getScore = function(){
        var score = 0
        if(!!!config.gamecenter_link){
            var timetamp = cc.sys.localStorage.getItem('timetamp');
            if(timetamp){
                if(global.isWeekTime(timetamp) ){
                    var _storageScore = cc.sys.localStorage.getItem('weekScore');
                    if(_storageScore){
                        score = _storageScore;
                    }                 
                }
            }   
        }else{
            score = global.getUserDataInfoByName('weekScore') || 0;   
        } 
        return score;       
    }
    /** 
     * 上传 个人数据（自定义）
     * 
     * */
    setBlob = function(blob,callBack){
        var url = urls.user +"/set_blob"
        var param = {}//config.getParam();
        param["blob"] = blob;
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log("setBlob Success",res)              
                if (callBack && typeof callBack == 'function') callBack()
            }
        })
    }
    
    /**
    * 上传个人人物数据信息 
    *
    */

    setUserInfo = function(){
        var url = urls.user +"/setuserinfo";
        var param = {};//config.getParam();
        console.log(config.userInfo)
        param["portrait"] = config.userInfo.avatarUrl
        param["name"] = config.userInfo.nickName
        param["geo"] = config.userInfo.city
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
        })
    }
    /**
     * 消耗体力
     */
    subVit = function(callBack,_num){
        var url = urls.user +"/sub_vit";
        var param = {
            num:_num,
        };//config.getParam();
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                if (callBack && typeof callBack == 'function') callBack(res.data.data)
            },
            fail: function (er) {
                console.error(er);
              }
        })      
    }
    /*
    *上传周分数
    set_week_score
    */ 
    setWeekScore = function(callBack,_num){
        var url = urls.user +"/set_week_score";
        var param = {
            num:_num,
        };//config.getParam();
        util.request({
            url: url,
            data: param,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success:res=>{
                console.log(res.data);
                if (callBack && typeof callBack == 'function') callBack(res.data.data)
            },
            fail: function (er) {
                console.error(er);
              }
        })       
    }
    // 获取 用户信息 
    /*res.data{
    "user": {
        "uid": "String",
        "name": "String",

        "portrait":"String",
        "geo":"String",
        
        "blob": {
            "type": "Mixed",
            "default": {}
        },
        "score": {
            "type":"Number",
            "default":0
        },
        "weekScore": {
            "type":"Number",
            "default":0
        },
        "weekTime": {
            "type":"Number",
            "default":0
        },
        "vit": {
            "type":"Number",
            "default":0
        },
        "vitRecoverTime": {
            "type":"Number",
            "default":0
        },
        "money": {
            "type": "Number",
            "default":0
        },
        "getHongBaos": {
            "type": "Object",
            "default": []
        },
        "sendHongBaos": {
            "type": "Object",
            "default": []
        },
        "tuiguangToday": {
            "type": "Object",
            "default": []
        },
        "tuiguangScore":{
            "type":"Number",
            "default":0
        },
        "createdate": "Date",
        "gold": "Number",
        "match": {
            "type": "Object",
            "default": []
        }
    },
    }
    */
    getUserData = function(callBack){
        var url = urls.user +"/get_user";
        var param = {};//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                console.log("getUserData",res)
                global.setUserDataInfo(res.data.data)
                if (callBack && typeof callBack == 'function') callBack(res.data)
            },
        })
    }
    getTuiguangUrl = function(callBack){
        var url = urls.user +"/get_tuiguangUrl"
        var param = {}//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                console.log(res)
                if (callBack && typeof callBack == 'function') callBack(res.data)
            },
        })
    } 
    //获得体力
    getVit = function(callBack){
        var url = urls.user +"/get_vit";
        var param = {};//config.getParam();
        util.request({
            url: url,
            data: param,
            method: 'GET',
            success:res=>{
                //服务器存储的用户数据
                if (callBack && typeof callBack == 'function') callBack(res.data.data)
            },
        })
    }
};
