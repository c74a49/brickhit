// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var global = require("global");
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
        //         return self._bar;
        //     },
        //     set (value) {
        //         self._bar = value;
        //     }
        // },
        gold:cc.Label,
        timesNode:cc.Node,
        textsTwo:cc.Node,
        btn:cc.Node,
        btnTwo:cc.Node,
        textures:[cc.SpriteFrame],
        reviveTwo:cc.Node,
        goldText:cc.Label,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self._times = 0;
        self.timesLabel = self.timesNode.getComponent(cc.Label);
        self.timesTwoLabel = self.textsTwo.getComponent(cc.Label);
    },

    init(callBack,flag = false,consumeGold){
        self._flag = flag;
        if(self._flag){
            self.reviveTwo.active = true;
            self.btn.active = false;
            self.goldText.string = 'x' + consumeGold;
        }else{
            self.btn.active = true;
            self.reviveTwo.active = false
        }
        self._consumeGold = consumeGold;
        self._callBack = callBack;
        var parent = self.node.parent;
        var js = parent.getComponent('wxAddLayer');
        if(!!!js){
            return;   
        }
        self._js = js;
        self.gold.string = js.getGold();
    },
    closeBtn(){
        
        //self.timesNode.active = false;
        self.node.active = false;
    },
    goldCallBackBtn(){
        if(self._js.getGold() < self._consumeGold){
            global.flyText(self.node,"金币不足，请邀请互助获取",cc.color(255,255,255),cc.color(0,0,0),2)
        }else{
            if(self._callBack){
                self.closeBtn();
                self._js.subGold(self._consumeGold);
                self._callBack();
            }
        }
    },
    assistBtn(){
        if(!!! self.timesNode.active ){
            var parent = self.node.parent;

            self.btnTwo.getComponent(cc.Sprite).spriteFrame = self.textures[0];
            self.btn.getComponent(cc.Sprite).spriteFrame = self.textures[0];
            
            
            var js = parent.getComponent('wxAddLayer');
            if(!!!js){
                return;   
            }
            js.shareBtnWithAssit(null,function(){
                self.timesNode.active = true;
                self.btnTwo.getComponent(cc.Sprite).spriteFrame = self.textures[1];
                self.btn.getComponent(cc.Sprite).spriteFrame = self.textures[1];
                
                self._times = global.getTimestamp() + 60;
                self.schedule(self.mainTime,1);
                js.showMeReq()
            });
        }else{
            global.flyText(self.node,"正在收集小伙伴的助力灵气",cc.color(255,255,255),cc.color(0,0,0),2)
        }

        
    },
    mainTime(){
        self.timesNode.active = true;
        self.textsTwo.active = true;
        let _tt = global.getTimestamp();
        let _T = Math.ceil( self._times - _tt);
        self.timesLabel.string = _T;
        self.timesTwoLabel.string = _T;
        if(_T <= 0){
            self.timesNode.active = false;
            self.textsTwo.active = false;
            self.btnTwo.getComponent(cc.Sprite).spriteFrame = self.textures[0];
            self.btn.getComponent(cc.Sprite).spriteFrame = self.textures[0];
            self.unschedule(self.mainTime);
            return;
        }
       
        
    },
    start () {

    },

    // update (dt) {},
});
