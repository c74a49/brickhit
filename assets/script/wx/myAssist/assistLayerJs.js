// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
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
        tiems: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self._tiems = 5;
    },
    closeBtn(){
        
        //self.timesNode.active = false;
        self.node.active = false;
    },
    start () {

    },
    init(callBack){
        self._callBack = callBack;
        var parent = self.node.parent;
        var js = parent.getComponent('wxAddLayer');
        if(!!!js){
            return;   
        }
        self._tiems = 5;
        self._stopTimes = Math.floor(Math.random()*10) % 3 + 1;
        self.schedule(self.mainTime,1);
    },
    mainTime(){
        self.tiems.string = self._tiems;
        if(self._tiems <= self._stopTimes || self._tiems <= 0 ){
            if(self._callBack){
                self._callBack();
            }
            self.unschedule(this.mainTime);
            self.closeBtn();
            return;
        }
        self._tiems --;
    }
    // update (dt) {},
});
