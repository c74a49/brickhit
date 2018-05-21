// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
const settings =require("Settings");
const getpList= (score)=>settings.getSet(settings.buffSetting, score).pList;
const getType = (score)=>settings.computepl(getpList(score));
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
        spriteFrame: {
            default: [],
            type: [cc.SpriteFrame],
            displayName: "spriteFrame",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init: function (score) {
        //_type = Math.min(Math.floor(cc.random0To1() * this.spriteFrame.length), this.spriteFrame.length - 1);
        let _type = getType(score);
        //console.log(_type);
        this._type = _type;
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteFrame[_type - 1];
        //if(_type == 0) console.log(sprite.spriteFrame, this.node.active);
    },

    start() {

    },

    // update (dt) {},
});
