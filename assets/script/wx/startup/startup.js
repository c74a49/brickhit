import { request } from 'http';


var login =  require('login');
var util = require('util');
var config =  require('config');
var share =  require('../share/share');
var rank =  require('../rank/rank');
var global = require("global");
var consume = require('consume').getInstance();
var ad=require('../ad/ad');
var MSG = require('../global/messageId');
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        this.startupImage = cc.find('startup', this.node);
        this.toLoadScene = null;

        // 预加载场景
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            if (config.gamecenter_open) {
                this.toLoadScene = 'gameWxLoading';
            } else {
                this.toLoadScene = config.loginScene;
            }
        } else {
            this.toLoadScene = config.loginScene;
        }
        cc.director.preloadScene(this.toLoadScene, function () {
        });

    },

    start () {
        //var self = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            self._rank = new rank();
            self._share = new share();
            self._rank.loadFriendRankWidget(self);
            self.wxLoading();
        }else{
           self.loginScene(); 
        }

    },
    loginScene(){
        var finished = cc.callFunc(function () {
            cc.director.loadScene(self.toLoadScene);
        });

        var seq = cc.sequence(
            cc.delayTime(1.5),
            cc.fadeOut(0.5),
            finished
        );

        this.startupImage.runAction(seq);
    },
    wxLoading(){
        wx.login({
            success:res=>{
                var launcInfo = wx.getLaunchOptionsSync();
                console.log("wx.getLaunchOptionsSync::",launcInfo); 
                if(!!!config.gamecenter_link){
                    util.getLocalOpenID(res.code);
                    let randStr = launcInfo.query.randStr
                    if(randStr){
                        let flag = global.IsRepeatRandString(randStr)
                        if(!!!flag){
                            global.addRandString(randStr);
                            consume.addGold(config.myAssist);
                            global.setEnterGameRandStr(true);
                        }
                    }
                    if(launcInfo.shareTicket){
                        //保存 进来的群的shareTicket
                        config.shareTicket = launcInfo.shareTicket;
                        //self.showGroupRank();
                        self.loginScene();
                    }else{
                        self.loginScene();
                    }
                    
                    return;
                };
                login.login(res.code,function(res){
                    login.getUseInfo();
                    // var launcInfo = wx.getLaunchOptionsSync();
                    // console.log("wx.getLaunchOptionsSync::",launcInfo); 
                    ad.postAdvert();
                    if (launcInfo && launcInfo["query"] && launcInfo.query["uid"]){
                        self._share.addFriend(launcInfo.query["uid"]);                        
                        if (launcInfo.shareTicket){
                            self.loginScene();
                            //self.showGroupRank();
                            
                            // //通过shareTicket 获得群号，显示群排行信息
                            // self._share.getShareInfo(launcInfo.shareTicket,function(openGId){
                            //     //console.log("openGId",openGId,self._rank)
                            //     config.groupOpenGID = openGId;
                            //     self._share.shareGroup(openGId);
                            //     self._rank.getQunRank( openGId,function(res){
                            //         if(res && res["data"]){
                            //             self.qunRankWidget.active = true
                            //             var js = self.qunRankWidget.getComponent('rankQunLayer');
                            //             js.init(res.data,function(){
                            //                 cc.director.loadScene(config.loginScene, null);
                            //             })
                            //         }
                            //     },"true");                   
                            // })
                            return;
                        }                     
                    }                
                    self.loginScene();
                },function(){
                    self.loginScene();
                    //console.log("failLoign show")
                    //self.failLogin();
                })

            },
            fail:res=>{
                //self.failLogin();
                self.loginScene();
            },
        })
    },
    showGroupRank(){
        if( typeof wx.getOpenDataContext != "function"){
            // self._flyText("微信版本过低，请升级")
            self.loginScene();
            return
        }

        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            id:MSG.MessageID.ON_MSG_GET_GROUP_RANK_OPEN,
            shareTicket:config.shareTicket,
        })
        self.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            self.friendRank.active = true;
            var js = self.friendRank.getComponent('friendLayer');
            js.initRank("true",function(){
                self.loginScene(); 
            });
        })))
    },
    // update (dt) {},
});
