// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var login =  require('./login');
var config =  require('config');
var share =  require('../share/share');
var rank =  require('../rank/rank');
var ad=require('../ad/ad');
var MSG = require('../global/messageId');
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

    onLoad () {
        self = this;
        self.register()
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            // wx.authorize({
            //     success:res=>{
            //        // this.wxLoading()
            //     },
            // })
            self._rank = new rank();
            self._share = new share();
            self._rank.loadFriendRankWidget(self);
            self.wxLoading()
        }else{
            cc.director.loadScene(config.loginScene, null);
        }

       // console.log(login)
    },

    start () {

    },
    register(){
        var btn = cc.find("Canvas/loginSuccess/wxLogin");
        console.log(btn)
        btn.on('click',function(event){
            self.wxLoading()
        },self);
        var rebtn = cc.find("Canvas/loginFail/reLogin");
        rebtn.on('click',function(event){
            self.wxLoading()
        },self);
    },
    nameLoading(){
        // var nameWidget = cc.find("Canvas/loginSuccess/nameTitle/nameString");
        // var edit = nameWidget.getComponent(cc.EditBox)
        // config.useName = edit.string
    },
    wxLoading(){
        //this.nameLoading()
        if(self.failWidget){
            self.failWidget.active = false;
        }
        // cc.director.loadScene(config.loginScene, null);
        // return;
        wx.login({
            success:res=>{
                var launcInfo = wx.getLaunchOptionsSync();
                console.log("wx.getLaunchOptionsSync::",launcInfo); 
                if(!!!config.gamecenter_link){
                    if(launcInfo.shareTicket){
                        //保存 进来的群的shareTicket
                        config.shareTicket = launcInfo.shareTicket;
                        self.showGroupRank();
                    }else{
                        cc.director.loadScene(config.loginScene, null);  
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

                            self.showGroupRank();
                            
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
                    cc.director.loadScene(config.loginScene, null);
                },function(){
                    cc.director.loadScene(config.loginScene, null);
                    //console.log("failLoign show")
                    //self.failLogin();
                })

            },
            fail:res=>{
                //self.failLogin();
                cc.director.loadScene(config.loginScene, null);
            },
        })
    },
    showGroupRank(){
        if( typeof wx.getOpenDataContext != "function"){
            // self._flyText("微信版本过低，请升级")
            cc.director.loadScene(config.loginScene, null);
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
                cc.director.loadScene(config.loginScene, null);    
            });
        })))
    },
    failLogin(){
        // var widget = cc.find("Canvas/loginSuccess");    
        // widget.active = false;
        if(self.failWidget){
            self.failWidget.active = true;
        }else{
            var widget = cc.find("Canvas/loginFail");
            widget.active = true;
            self.failWidget = widget;
        }

    },
    loginBtnIn(){
        cc.director.loadScene(config.loginScene, null);
    }
    // update (dt) {},
});
