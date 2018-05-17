// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let name2idx = { "hitBrick": 0, "hitBall": 1, "hitCoin": 2, "hitBoom": 3, };
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
        sound: {
            type: [ cc.AudioClip ],
            default: [],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        //
        this.busy = false;
        this.idx = 0;
        window.audioManager = this;
    },
    play: function (name, free) {
        if (!getUsrData().sound) return;

        if(!free) {cc.audioEngine.play(this.sound[name2idx[name]]); return;}

        if(this.busy) return;
        cc.audioEngine.play(this.sound[name2idx[name]]);
        this.busy = true;
        this.scheduleOnce(()=>this.busy = false, 0.07);
        return;
    },
    start :function() {

    },

    // update (dt) {},
});
