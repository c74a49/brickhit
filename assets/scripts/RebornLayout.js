// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

let timeOut = 0;
let cost1 = 5;
let cost2 = 10;
const common = require("Common");
const lang = require("Lang");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        scoreLabel: cc.Label,
        skip: cc.Node,
        shareBtn: cc.Node,
        adBtn: cc.Node,
    },
    init: function (ctl) {
        this.gameCtl = ctl;
        this.node.active = false;
        this.reborned = 0;
    },
    reborn: function () {
        this.node.active = false;
        this.reborned += 1;
        this.gameCtl.reborn()
    },
    show: function () {
        this.node.active = true;
        this.scoreLabel.string = window.gameScore1;
        if (this.reborned >= 2) {
            this.onSkipBtn(); 
            return;
        }
        this.shareLeftTimes = 1;
        //this.shareBtn.active = this.gameCtl.getComponent("wxAddLayer").checkScore();
        this.shareBtn.active = this.gameCtl.getComponent("wxAddLayer").checkScore() && (getVersionData().versionStartSeconds > 1200);
        this.adBtn.active = window.flashAd;
        if(!this.shareBtn.active && !this.adBtn.active) {
            this.onSkipBtn();
            return;
        }
        if (this.reborned == 1) {
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function () {

    },
    //友助复活
    onAdBtn: function () {
        let self = this;
        var callBack = () => {
            self.reborn();
        }
        //this.gameCtl.getComponent("wxAddLayer").shareBtnWithScore(0,callBack, 10);
        //this.gameCtl.subGold(cost1, callBack);
        //this.gameCtl.getComponent("wxAddLayer").assistTwoBtn(callBack, this.reborned == 0 ? cost1 : cost2);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.gameCtl.wxAddLayout.shareBtnWithUrl(0,callBack);
        }
        else callBack();
    },
    //广告复活
    onShareBtn: function () {
        let self = this;
        this.gameCtl.hideBannerAd();
        if (this.reborned == 0) {
            var success =  () =>{
                this.reborn();
            }
            var fail = null;
            common.playAd(success, fail);
        }
        else if (this.reborned == 1) {
            this.onReshareBtn();
        }
    },
    onReshareBtn: function () {
        let self = this;
        var success = function () {
            self.reborn();
        }
        var fail = null;
        common.playAd(success, fail);
    },

    onSkipBtn: function () {
        this.node.active = false;
        this.gameCtl.stopGame();
    },
    onDestroy: function () {
    }
    // update (dt) {},
});
