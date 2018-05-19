//window.console.log = function () { };

let common = require("Common");
let Const = require("Const");

window.gameScore = 0;   //记录层数/结束时用于传递最终分数
window.gameBalls = 0;   //总球数
window.gameScore1 = 0;  //记录分数

let self;
 cc.Class({
    extends: cc.Component,

    properties: {
        rebornLayout: require('RebornLayout'),
        //paddle: require("Paddle"),
        brickLayout:require("BrickLayout"),
        ground:require("Ground"),
        player: require("Player"),
        ballsMnt: cc.Node,
    },
    ctor: function(){
        self = this;
    },
    // use this for initialization
    onLoad: function () {
        //自适应
        //var screenSize = cc.view.getFrameSize();
        //if (screenSize.height / screenSize.width >= 1.78) {
        //    this.node.getComponent(cc.Canvas).fitWidth = true
        //}
        //else {
        //    this.node.getComponent(cc.Canvas).fitHeight = true
        //}
        //安卓返回键退出
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if (event.keyCode === cc.KEY.back) {
                cc.director.end();
            }
        });
        cc.director.preloadScene('over', function () {
            console.log('Next scene preloaded');
        });
        this.gameView = this.getComponent("GameView");
        this.wxAddLayout = this.getComponent("wxAddLayer");
        this.physicsManager = cc.director.getPhysicsManager();
        this.physicsManager.enabled = true;

        if(window.bannerAd){
            this._bannerAd = this.getComponent("BannerBlock");
            this._bannerAd.startLoop();
        }
    },
    start: function () {
        this.startGame();
        this.wxAddLayout.setShareAssist(()=>this.gameView.updateGold(this.getGold()));
    },

    init: function () {
        window.gameBalls = 0;
        window.gameScore = 0;
        window.gameScore1 = 0;
        this.physicsManager.enabled = true;
        //this.gameView.updateScore(gameScore);
        this.flg = false;
        let timeOut = 1;
        this.schedule(()=>{this.flg = true;}, timeOut);
        this.gameView.updateBest(this.dbGetScore());
        this.gameView.updateGold(this.getGold());
        this.rebornLayout.init(this);
        this.ground.reset(this);

    },

    rebornCtrl: function () { 
        //重生控制逻辑
        this.physicsManager.enabled = false;
        this.rebornLayout.show();
    },
    reborn: function () {
        //重生逻辑
        //window.gameScore = 0;
        window.gameBalls = 0;
        this.brickLayout.reset(this);
        this.brickLayout.newBrickLayout(2);
        window.gameScore += 2;

        window.ballsMap = {};
        this.ballsMnt.removeAllChildren();
        this.physicsManager.enabled = true;

        this.player.reset(this);
        //this.rebornCtrl();
    },
    startGame: function () {
        this.init();
        this.showBannerAd();
        //开始逻辑
        window.gameScore    = 0;
        window.gameBalls    = 0;
        window.gameScore1   = 0;

        window.ballsMap = {};
        this.ballsMnt.removeAllChildren();

        this.brickLayout.reset(this);
        this.brickLayout.newBrickLayout(2);
        window.gameScore += 2;
        this.player.reset(this);
        //this.rebornCtrl();
    },
    newStage: function(success){
        if(!this.flg) return;
        this.flg = false;
        let repeat = 1;
        window.ballsMap = {};
        this.ballsMnt.children.map((node) => window.ballsMap[node.getComponent("Ball").id] = true);
        if(this.brickLayout.newBrickLayout(repeat)) this.rebornCtrl();
        window.gameScore += repeat;
        if(typeof success == "function") success();
    },
    stopGame: function(){
        window.gameScore = window.gameScore1;
        cc.director.loadScene('over');
    },

    dbSetScore: function (score) {
        this.wxAddLayout.setScore(window.gameScore1)
    },
    dbGetScore: function () {
        return this.wxAddLayout.getScore();
    },
    addGold: function (gold) {
        this.wxAddLayout.addGold(gold)
        this.gameView.updateGold(this.getGold());
    },
    subGold: function (num, callBack) {
        let self= this;
        self.wxAddLayout.subGold(num, (success)=>{
            if(success)
                self.gameView.updateGold(this.getGold());
            if(typeof callBack == "function") callBack(success);
        })
    },
    getGold: function () {
        return this.wxAddLayout.getGold();
    },
    showBannerAd: function () {
        if (this._bannerAd) this._bannerAd.show();
    },
    hideBannerAd: function () {
        if (this._bannerAd) this._bannerAd.hide();
    },
    onDestroy: function () {
        this.physicsManager.enabled = false;
        this.hideBannerAd();
    }

});