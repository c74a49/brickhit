// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//let UsrData = require("UsrData");

//window.console.log = function(){};
window.bannerAd = false;
window.flashAd = true;
//小包关闭视频激励广告
window.flashAd = false;

let lang = require("Lang");
let common = require("Common");
let Const = require("Const")

let bannerWidth = Const.bannerWidth;
let bannerTop = Const.bannerTop;

cc.Class({
    extends: cc.Component,

    properties: {
        //audioMng: cc.Node
        rank: cc.Node,
        more: cc.Node,
        soundSprite: cc.Sprite,
        spriteFrames: {
            default: [],
            type: [cc.SpriteFrame],
            displayName: "sound sprites",
        },
        help4Gold: cc.Node, 
    },
    ctor:()=>{
        //微信android用户
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window.WECHAT_ANDROID = wx.getSystemInfoSync().system.toLowerCase().indexOf("android") != -1
        }
        getUsrData();
        getVersionData();
    },
    // use this for initialization
    onLoad: function () {
        //this.audioMng = this.audioMng.getComponent('AudioMng');
        //this.audioMng.playMusic();
        this.wxAddLayer = this.getComponent("wxAddLayer");
        //this.wxAddLayer.officalAccActive(true);
        cc.director.preloadScene('game', function () {
            console.log('Next scene preloaded');
        });
        
        //if (WECHAT_ANDROID) getUsrData().sound = false;

        //创建广告
        if(window.bannerAd){
            this._bannerAd = this.getComponent("BannerBlock");
            this._bannerAd.startLoop();
            this._bannerAd.stopLoop();
        }
    },
    start: function () {
        this.soundSprite.spriteFrame = this.spriteFrames[getUsrData().sound ? 1 : 0];
        //this.help4Gold.active = this.wxAddLayer.checkScore();
        this.help4Gold.active = false;
    },

    playGame: function () {
        this.wxAddLayer.officalAccActive(false)
        cc.director.loadScene('game');
    },

    getRank: function () {
        this.hideBannerAd();
        this.wxAddLayer.getFriendsRankBtn();
    },
    saveOfficalAcc: function () {
        this.hideBannerAd();
        this.wxAddLayer.saveOfficalAccount();
    },
    setSound: function () {
        let sound = getUsrData().sound
        sound = !sound;
        getUsrData().sound = sound;
        this.soundSprite.spriteFrame = this.spriteFrames[sound ? 1 : 0];
        console.log(getUsrData().sound)
    },
    getMore: function () {
        common._flyText(this.more, lang.LANG_NOT_OPENED);
    },

    // called every frame
    update: function (dt) {

    },
    showBannerAd: function () {
        if (this._bannerAd) this._bannerAd.show();
    },
    hideBannerAd: function () {
        if (this._bannerAd) this._bannerAd.hide();
    },
    onDestroy: function () {
        this.hideBannerAd();
    }
});
