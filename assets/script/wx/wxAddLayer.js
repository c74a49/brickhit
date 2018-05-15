
//import userOperate from './userOperate/userOperate';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

/**
 * 提示
 * global 保存了从服务器拉下来的用户数据, userOperate.getUserData
 * 
 */
var userOperate = require('userOperate');
var config = require('config');
var rank = require('./rank/rank');
var share = require('./share/share');
var hongbao = require('./hongbao/hongbao')
var match = require('./match/match')
var global = require('./global/global');
var tokenUrl = require('./utils/tokenMgr');
var consume = require('consume').getInstance();
var matchManager = require('matchManager').getInstance();
var lottery = require('lottery');
var MSG = require('./global/messageId');
var shareUtil = require('shareUtil').getInstance();
var preview = require('./savePhotos/preview');
// 友助
var myAssist = require('myAssist').getInstance();
var commonNode = require('commonNode');
var self = null;
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        self._localScore = 0;
        self._isShareWithGold = false;
        self.initData();
        self.loadWidget();
        shareUtil.loadShareGroupInfo();

        //console.log("LLLLLLLLLLLLLLLLLL",self.node.parent);


        //30秒拉取一次比赛活动
        // self.schedule(function() {
        //     console.log("get match info...");
        //     self._match.update(self);
        // }, 30);
        // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        //     self.scheduleOnce(function() {
        //         console.log("get match info...");
        //         // self._match.update();
        //         matchManager.update();
        //     }, 3);
        // }
    },
    /**
     * 
     * 初始化data
     */
    initData() {
        self._userOperate = new userOperate();
        //self._hongbao = new hongbao();
        self._rank = new rank();
        self._share = new share();
        // self._match = new match();
    },

    /**
     * 加载  prefab(widget)
     */
    loadWidget() {
        // wx 添加排行榜 rank layer
        self._rank.loadRankWidget(self);
        self._rank.loadQunRankWidget(self);
        self._rank.loadFriendRankWidget(self);
        myAssist.loadMyAssistWidget(self);
        myAssist.loadAssistLayerTwo(self);
        //self._hongbao.loadHongbaoWidget(self);
        // wx 添加match相关widgets
        // matchManager.loadMatchHongbaoIcon(self);
        // matchManager.loadMatchShareWidget(self);
        // matchManager.loadMatchRankWidget(self);
        // matchManager.setTarget(self);

    },

    /**
     * 体力定时器
     * @param {*无意义} floats 
     */
    callback(floats) {
        self._userOperate.getVit(function (res) {
            console.log(res);
            if (res.vit) {
                global.setUserDataInfoByName('vit', res.vit)
            }
        })
    },
    start() {

        //   self.setFriendsRankScore(20);  
        //   self.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
        //     self.getFriendsRankBtn();
        //   })))
        //////////////////////////////////////////
        if(global.getShareAssist()){
            self.showMeReq(); 
        }
        self.showHelpTips();

        commonNode.getInstance();
    },

    /**
     * 进入其他界面，重新更新 金币
     */
    setShareAssist(callback){
        self._assistCallBack = callback;
    },
    /**
     * callback 为更新分数接口
     * @param {*} callback 
     */
    showHelpTips(callback){
        if(global.getEnterGameRandStr()){
            self._flyText("已经助力伙伴,获取灵气，共同获得"+config.myAssist+"金币！",cc.color(255,255,255),cc.color(0,0,0),3);
            global.setEnterGameRandStr(false);
            if(callback){
                callback();
                //self._assistCallBack = callback;
            }
        }

    },
    showMeReq(callBack){
        if(callBack && typeof callBack === 'function'){
            self._assistCallBack = callBack; 
        }
        global.setShareAssist(true);
        self._asTimes =  Math.floor(Math.random()*10) % 10 + 10;
        self.schedule(self.assistTime,1);
    },
    assistTime(){
        if(self._asTimes <= 0){
            self.showMeRequst();
            global.setShareAssist(false);
            self.unschedule(self.assistTime);
            return;
        }
        self._asTimes--;
    },
    showMeRequst(){
        self._flyText("收集满小伙们提供的助力灵气，获得"+config.myAssist+"金币！",cc.color(255,255,255),cc.color(0,0,0),3);
        self.addGold(config.myAssist);
        if(self._assistCallBack ){
            self._assistCallBack ();
        }
    },

    // update() {

    // },
    /** 
     * 排行榜 customData = true ，表示拉取周排行 无 则表示总排行
     * 
     */
    rankBtn(event, customData) {
        console.log(event, customData)
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._rank.getRank(function (res) {
                //console.log(res)
                if (res && res["data"]) {
                    self.rankWidget.active = true
                    var js = self.rankWidget.getComponent('rankLayer');
                    js.init(res.data, function () {
                    })
                }
            }, customData);
        }
    },
    rankQunBtn(event, customData) {
        customData = customData || "true";
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (config.groupOpenGID) {
                self._rank.getQunRank(config.groupOpenGID, function (res) {
                    //console.log(res)
                    if (res && res["data"]) {
                        self.qunRankWidget.active = true
                        var js = self.qunRankWidget.getComponent('rankQunLayer');
                        js.init(res.data, function () {
                        })
                    }
                }, customData);
            }
        }
    },

    /** 
     * 分享
     * 炫耀成绩
     * 
     * gold 分享获得金币 数量，
     */
    shareBtnWithScore(event,callBack, gold){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._localScore = self._userOperate.getLocalScore();
            //console.log("localScore",self._localScore,self._isShareWithGold)
            if (typeof self._localScore == 'number') {
                self._share.shareAppMessageWithGold(callBack, self._localScore , gold, self);
                //self._isShareWithGold = false;
            } else {
                self._share.shareAppMessage(callBack);
            }
        }
    },
    /**
     * 
     * @param {*} event 
     * @param {*} callBack 
     * 友助 复活
     */
    shareBtnWithRevived(event,callBack){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let func = function(){
                self.assistLayerTwo.active = true;
                let js = self.assistLayerTwo.getComponent("assistLayerJs");
                js.init(callBack)
            }
            self._share.shareAppMessageWithRevived(func);
        }
    },
    /**
     * 
     */
    shareBtnWithAssit(event,callBack){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._share.shareAppMessageWithAssit(callBack);
        }   
    },
    /**
     * 分享  
     * ****此处分享是带分数分享（分数分享只有这个函数,要提前调用setScore 或 setLocalScore 函数) ******** 
     * 
     */
    shareBtn(event, callBack) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._localScore = self._userOperate.getLocalScore();
            if (self._localScore) {
                self._share.shareAppMessage(callBack, self._localScore);
            } else {
                self._share.shareAppMessage(callBack);
            }
        }
    },

    /**
     * 分享 
     * 分享到群，个人 都有回调
     * 
     */
    shareBtnWithUrl(event, callBack) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._share.shareAppMessageWithImgUrl(callBack)
            // if(self._localScore){
            //     self._share.shareAppMessageWithImgUrl(callBack,self._localScore);
            // }else{
            //     self._share.shareAppMessageWithImgUrl(callBack);
            //}
        }
    },
    /**
     * 分享 
     * 分享群  拥有回调
     * 分享到个人也拥有回调;
     * callback 需要一个参数，callback(param1),
     * param1  true/false, 判断是否为群
     */
    shareBtnWithGroup(event, callBack) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._share.shareAppMessageForGroup(callBack)
        }
    },
    /**
     * 特殊功能 分享  shareTicket 增加次数的
     * @param {*} event 
     * @param {*} callBack 
     */
    shareBtnWithSpecial(event, callBack, obj) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._share.shareAppMessageWithSpecial(callBack, obj)
            // if(self._localScore){
            //     self._share.shareAppMessageWithImgUrl(callBack,self._localScore);
            // }else{
            //     self._share.shareAppMessageWithImgUrl(callBack);
            //}
        }
    },
    /**
     * 获取分享次数
     */
    getShareTicketTime() {
        var times = config.shareGroupTime || 0;
        return times;
    },
    /**
     * 红包
     */
    hongbaoBtn() {
        //红包功能未完成 需要开发后调试
        // if(cc.sys.platform == cc.sys.WECHAT_GAME){
        //     self.closeTouch()
        //     var js = self.hongbaoWidget.getComponent('hongbaoLayer');
        //     js.init(self)    
        // }
    },
    // update (dt) {},
    /**
     * 比赛
     */
    hasMatch() {
        // return self._match.hasMatch();
        return match.hasMatch();
    },
    matchBtn() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // self._match.getMatchInfo(function(res) {
            // match.getMatchInfo(function(res) {
            //     if (res && res["data"]) {
            //         self.matchWidget.active = true;

            //     }
            // });
            matchManager.showMatchRankView();
        }
    },
    /**
     * 获取真实好友排行榜
     * 
     */
    getFriendsRankBtn() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            if (typeof wx.getOpenDataContext != "function") {
                self._flyText("微信版本过低，请升级")
                return
            }

            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                id: MSG.MessageID.ON_MSG_GET_FRIEND_RANK_OPEN,
            })
            self.friendRank.active = true;
            var js = self.friendRank.getComponent('friendLayer');
            js.initRank();
        }
    },
    /**
     * 获取下一个想要超越的好友
     * 
     */
    setNextFriendInfoBtn(){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            
            if( typeof wx.getOpenDataContext != "function"){
                self._flyText("微信版本过低，请升级")
                return
            }

            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                id:MSG.MessageID.ON_MSG_GET_NEXT_PEOPLE,
                openid:config.UID,
            })
        }
    },
    // /**
    //  * 设置开放域 分数
    //  * @param {*int} score 
    //  */
    // setFriendsRankScore(score){

    //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    //          var weekScore = global.getUserDataInfoByName('weekScore');
    //          if(!!!weekScore || weekScore <= score){
    //             global.setUserDataInfoByName('weekScore',score);
    //             var time = global.getTimestamp();
    //             //key: 'timestamp';
    //             var _kvData = new Array();
    //             score = score + "";
    //             time = time + "";
    //             _kvData.push({key:'score',value:score},{key:'timestamp',value : time});
    //             wx.setUserCloudStorage({
    //                 KVDataList:_kvData,
    //                 success:res=>{
    //                     console.log(res);
    //                 },
    //                 fail:res=>{
    //                     console.log("fail",res);
    //                 }
    //             })
    //         }
    //     }        
    // },

    /**
  * 获取真实群排行榜（微信平台维护）
  * 
  */
    getOpenDataQunRankBtn() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            if (typeof wx.getOpenDataContext != "function") {
                self._flyText("微信版本过低，请升级")
                return
            }
            if (config.shareTicket) {
                let openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    id: MSG.MessageID.ON_MSG_GET_GROUP_RANK_OPEN,
                    shareTicket: config.shareTicket,
                })
                self.friendRank.active = true;
                var js = self.friendRank.getComponent('friendLayer');
                js.initRank("true");
            } else {
                self.shareBtnWithGroup();
            }

        }
    },
    /**
     * 
     * @param {*} callback  为游戏更新分数接口
     * //直接拉到控制按键就好
     */
    assistBtn(event){
        self.myAssistWidget.active = true;
        let js = self.myAssistWidget.getComponent("myAssistLayer");
        js.init(event);
    },
    /**
     *  callback 为 复活回调， gold 为 复活消耗金币数
     *    金币复活，分享互助 2合一接口
     */
    assistTwoBtn(callback,gold){
        
        self.myAssistWidget.active = true;
        let js = self.myAssistWidget.getComponent("myAssistLayer");
        js.init(callback,true,gold);
    },
    /**
     * 弃用 测试的
     * 获取体力操作 使用下面的getVit(),subVit()
     * 
     */
    getVitBtn() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._userOperate.getVit(function (res) {
                console.log(res);
                if (res.vit) {
                    global.setUserDataInfoByName('vit', res.vit)
                }
            });

        }
    },
    subVitBtn() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._userOperate.getVit(function (res) {
                console.log(res);
                global.setUserDataInfoByName('vit', res.vit);
                if (parseInt(res.vit) > 0) {
                    self._userOperate.subVit(function (res) {
                        var num = global.getUserDataInfoByName('vit');
                        global.setUserDataInfoByName('vit', num - 1)
                    }, 1);
                } else {
                    self._flyText("您的体力不足");
                }
            });
        }
    },

    /* 
    * 飘字
    */
    _flyText(_text, color, strokeColor,time) {
        var textNode = new cc.Node;
        textNode.addComponent(cc.Label);
        textNode.addComponent(cc.LabelOutline);
        let winSize = self.node.getContentSize();
        textNode.setContentSize(winSize.width-80,200);
        var text = textNode.getComponent(cc.Label);
        text.string = _text || "";//"您的体力不足";
        text.fontSize = 40;
        text.lineHeight = 40;
        text.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        textNode.color = color || cc.color(247, 255, 43, 255);
        var textOutLine = textNode.getComponent(cc.LabelOutline);
        textOutLine.color = strokeColor || cc.color(63, 2, 2, 255);
        textOutLine.width = 2;
        self.node.addChild(textNode);
        var size = self.node.getContentSize();
        //textNode.setPosition(size.width/2,size.height);
        var fadeOut = cc.fadeOut(0.2);
        var move = cc.moveBy(0.2, cc.p(0, 200));
        time = time || 0.3;
        textNode.runAction(cc.sequence(cc.delayTime(time), cc.spawn(fadeOut, move), cc.callFunc(function () {
            textNode.destroy();
        }, self)))
    },
    /*
    *分数操作
    */
    getScore() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            return self._userOperate.getScore();
        }
        return 0;
    },
    setScore(score) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (typeof score == 'number') {
                self._isShareWithGold = true;
                self.addGameStartTimes();
                self.setCurLocalScore(score);
                self._userOperate.setScore(score);
            }
        }
    },
    /**
     * 检查分数 是否超过分享复活的界限 ，（老玩家3次后都返回TRUE）
     */
    checkScore(score){
        if( global.getLowScoreTimes() >= 5 ){
            return true;
        }

        if(config.topScore <= score){
            if(global.getHeightScoreTimes() >= 2 ){
                return true;
            }else{
                global.setHeightScoreTimes()
            }
            
        }else{
            global.setLowScoreTimes();
        } 
        return false;
    },
    /**
     * 设置本次分享分数
     * @param {*} score 
     */
    setCurLocalScore(score) {
        if (typeof score == 'number') {
            self._userOperate.setLocalScore(score);
        }
    },
    /* 
    *体力操作
    */
    getVit() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            global.setUserDataInfoByName('vit', res.vit);
        }
        return 0;
    },
    subVit(callBack) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._userOperate.getVit(function (res) {
                global.setUserDataInfoByName('vit', res.vit);
                if (parseInt(res.vit) > 0) {
                    self._userOperate.subVit(function (res) {
                        var num = global.getUserDataInfoByName('vit');
                        global.setUserDataInfoByName('vit', num - 1);
                        if (callBack && typeof callBack == 'function') {
                            callBack();
                        }

                    }, 1);
                } else {
                    self._flyText("您的体力不足");
                }
            });

        }
    },
    /**
     * 
     * 设置用户自定义数据上传
     */
    setCustomData(blob, callBack) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            self._userOperate.setBlob(blob, callBack);
        }
    },

    /**
     * 金币/积分 操作
     */
    getGold() {
        let gold = consume.getGold();
        return gold;
    },
    /**
     * 
     * @param {*} _num 
     * @param {*} callBack  带一个参数 (true/false 判断消耗金币 成功/失败);
     */
    subGold(_num,callBack) {
        consume.subGold( _num,callBack);
    },
    addGold( _num) {
        consume.addGold( _num );
    },
    /*
    *打开 体力定时器 30分钟恢复一次体力；
    */
    openVitTimers() {
        self.schedule(self.callback, 1800);
    },
    onDestroy() {
        self.unschedule(self.callback);
    },

    /**
     * 开奖操作
     */
    startActivity(callBack) {
        lottery.startActivity(callBack);
    },

    runLottery(type, callBack) {
        lottery.runLottery(type, callBack);
    },

    quitActivity(callBack) {
        lottery.quitActivity(callBack);
    },

    //保存公众号;
    saveOfficalAccount() {
        var node=cc.find("Canvas/officalAccount");
        if(node==null){
            preview.officalAccLoad();
        }else{
            node.active=true;
        }
    },
    
    //更多预览
    moreGame() {
        preview.previewImage();
    },
    //显隐公众号
    officalAccActive(show) {
        var node = cc.find("Canvas/officalBtn");
        if (node == null && show) {
            preview.loadRes();
        } else if (node == null & !show) {
            return;
        } else {
            node.active = show;
        }
    },
    /**
     * 添加 游戏开始次数 
     */
    addGameStartTimes(){
        global.addStartGameTimes();
    },
    /**
     * 获得 游戏开始次数
     */
    getGameStartTimes(){
        return global.getStartGameTimes();
    }
});

