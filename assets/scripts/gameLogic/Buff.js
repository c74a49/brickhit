// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
const buffType = require("Const").BUFF_TYPE;
var head = (arr)=>arr.slice(0, 1)[0];
var tail = (arr)=>arr.slice(1);
const pList = [
    [
        /*[buffType.LANG15 ] = */80,
        /*[buffType.SHOT15 ] = */10,
        /*[buffType.REVERSE] = */10,
    ],
    [
        /*[buffType.LANG15 ] = */50,
        /*[buffType.SHOT15 ] = */40,
        /*[buffType.REVERSE] = */10,
    ],
    [
        /*[buffType.LANG15 ] = */30,
        /*[buffType.SHOT15 ] = */50,
        /*[buffType.REVERSE] = */20,
    ],
    [
        /*[buffType.LANG15 ] = */20,
        /*[buffType.SHOT15 ] = */50,
        /*[buffType.REVERSE] = */30,
    ],
    [
        /*[buffType.LANG15 ] = */10,
        /*[buffType.SHOT15 ] = */55,
        /*[buffType.REVERSE] = */35,
    ],
];
var getType = function (score) {
    let vs;
    //let score = windwo.gameScore;
    if      (score <= 10 )  vs = pList[0];
    else if (score <= 30 )  vs = pList[1];
    else if (score <= 60 )  vs = pList[2];
    else if (score <= 100)  vs = pList[3];
    else                    vs = pList[4];
    let total = 0;
    vs.map((a)=>total += a);
    const ps = vs.map((a)=>a / total);
    const random = cc.random0To1();
    const search = (base, rand, arr) =>{
        const p  = head(arr);
        if(!p) return null;
        if(rand <= p) return base
        else return search(base + 1, rand - p, tail(arr));
    }
    return search(0, random, ps);

}
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
    init: function (_type) {
        //_type = Math.min(Math.floor(cc.random0To1() * this.spriteFrame.length), this.spriteFrame.length - 1);
        _type = getType(window.gameScore);
        _type += 1;
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
