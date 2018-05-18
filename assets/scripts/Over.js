let got = 10;
let common = require("Common");
let Const = require("Const");
let bannerWidth = Const.bannerWidth;
let bannerTop = Const.bannerTop;
cc.Class({
	extends: cc.Component,

	properties: {
		scoreLabel: cc.Label,
		bestLabel: cc.Label,
		share4Gold: cc.Node,
		help4Gold:cc.Node,
	},
	// use this for initialization
	onLoad: function () {
		this.wxAddLayer = this.getComponent("wxAddLayer");
		//this.showOfficalAcc();
		if(window.bannerAd){
            this._bannerAd = this.getComponent("BannerBlock");
            this._bannerAd.startLoop();
            this._bannerAd.stopLoop();
        }
	},
	start: function(){
		this.show()
	},

	show: function () {
		this.scoreLabel.string = window.gameScore;
		//上传分数
		console.log("push score ", window.gameScore);
		this.wxAddLayer.setScore(window.gameScore);
		this.bestLabel.string = this.wxAddLayer.getScore();
		//for check 
		//this.share4Gold.active 	= this.wxAddLayer.checkScore();
		//this.help4Gold.active 	= this.wxAddLayer.checkScore();
		this.share4Gold.active 	= false;
		this.help4Gold.active 	= false;
	},

	onBtnRestart: function () {
		cc.director.loadScene('game');
	},
	onBtnHome: function () {
		cc.director.loadScene('start');
	},
	getRank: function () {
		this.hideBannerAd();
		this.wxAddLayer.getFriendsRankBtn();
	},
	onBtnShare: function () {
		this.wxAddLayer.shareBtn();
		/*
		this.wxAddLayer.shareBtnWithScore(0, (success) => {
			if (success) {
					//刷新操作
				if (cc.sys.platform === cc.sys.WECHAT_GAME) {

					wx.showModal({
						title: ' 成功',
						content: "炫耀成功，获得" + got.toString() + "金币",
						showCancel: false,
						success: function (res) {
						}
					});

				}
			}
			else {
			}
		}, got);
		*/
	},
	showOfficalAcc: function () {
        this.wxAddLayer.officalAccActive(true);
    },
    hiddenOfficalAcc: function () {
        this.wxAddLayer.officalAccActive(false);
    },
    showBannerAd: function () {
        if (this._bannerAd) this._bannerAd.show();
    },
    hideBannerAd: function () {
        if (this._bannerAd) this._bannerAd.hide();
	},
	onDestroy: function () {
		this.hiddenOfficalAcc();
        this.hideBannerAd();
    }
});
