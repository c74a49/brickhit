// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var common = require("Common");
var Const = require("Const");
var getUsrData = ()     =>common.getStorageSync(Const.usrData);
var setUsrData = (val)  =>common.setStorageSync(Const.usrData, val);
let defaultData = {sound: true};
var UsrData = cc.Class({
    properties:{
        //本地存储
        sound: {
            get(){
                //向前兼容
                return typeof this._data.sound != typeof defaultData.sound  ? defaultData.sound : this._data.sound;
            },
            set(val){
                this._data.sound = val;
                setUsrData(this._data);
            },
        },
        
        //---------------------------------------------------------------华丽的分割线-----------------------------------------------
    },
    instance: function(){
        let data = getUsrData();
        this._data = data ? data : defaultData;
        return this;
    },
});
var self;

//单例
window.getUsrData = () => {
    if(self != undefined) return self;
    self = new UsrData();
    return self.instance();
};