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
var getVersionData = ()     =>common.getStorageSync(Const.version);
var setVersionData = (val)  =>common.setStorageSync(Const.version, val);
let defaultData = {};
var VersionData = cc.Class({
    properties:{
        //本地存储

        versionStartSeconds:{
            get(){
                return (Date.parse(new Date()) - this._data.timestamp) / 1000;
            },
        },
    },
    instance: function(){
        let data = getVersionData();
        if(!data){
            this._data = defaultData;
            this._data.timestamp = Date.parse(new Date());
            setVersionData(this._data);
        }
        else this._data = data;
        //this._data = data ? data : defaultData;
        return this;
    },
});
var self;

//单例
window.getVersionData = () => {
    if(self != undefined) return self;
    self = new VersionData();
    return self.instance();
};