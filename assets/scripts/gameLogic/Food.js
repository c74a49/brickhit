// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let FoodType = require("Const").FOOD_TYPE;
let startSpeed = 780;
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
        sprite: cc.Sprite,
        spriteFrame: {
            default: [],
            type: [cc.SpriteFrame],
            displayName: "spriteFrame",
        },
        ballPrefab: {
            default: null,
            type: cc.Prefab,
        },
        ballSpriteFrames: [cc.SpriteFrame],
        buffPrefab: cc.Prefab,
        //audio: {
        //    url: cc.AudioClip,
        //    default: null
        //}
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //this.node.color = cc.color(255, 0, 0);
    },
    init: function (_type, balls = 1) {
        this._type = _type;
        this.balls = balls;
        //let sprite = this.node.getComponent(cc.Sprite);
        let sprite = this.sprite;
        sprite.spriteFrame = this.spriteFrame[_type - 1];
    },
    //碰到球
    onContacked: function (other, self) {
        if (this._type == FoodType.TYPE_BOOM) { //炸弹
            audioManager.play("hitBoom");
            let pos = cc.v2(this.node.x, this.node.y);
            this.node.destroy();
            this.node.parent.getComponent("BrickLayout").destroy4Side(pos);
        }
        else if (this._type == FoodType.TYPE_BALL) {    //分裂一个球
            audioManager.play("hitBall");
            let pos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
            let mntNode = cc.find("Canvas/gameLogic/mntNode");
            pos = mntNode.convertToNodeSpaceAR(pos);
            for (let i = 0; i < this.balls; i++) {
                let newBall = cc.instantiate(this.ballPrefab);
                let rand = cc.random0To1();
                let alpha = rand * Math.PI / 2 + Math.PI / 4;
                newBall.getComponent("Ball").setSpeed(startSpeed * Math.cos(alpha), startSpeed * Math.sin(alpha));
                newBall.parent = mntNode;
                newBall.setPosition(pos);
                //let color = Math.min(Math.floor(this.ballSpriteFrames.length * rand), this.ballSpriteFrames.length - 1);
                //newBall.getComponent(cc.Sprite).spriteFrame = this.ballSpriteFrames[color]
                newBall.getComponent(cc.Sprite).spriteFrame = other.getComponent(cc.Sprite).spriteFrame;
                newBall.active = true;
                window.gameBalls += 1;
                window.ballsMap[newBall.getComponent("Ball").id] = window.ballsMap[other.getComponent("Ball").id];
                window.inBalls += window.ballsMap[newBall.getComponent("Ball").id] ? 0 : 1;
            }
            this.node.destroy();
        }
        else if (this._type == FoodType.TYPE_BUFF) { //buff
            audioManager.play("hitCoin");
            let newBuff = cc.instantiate(this.buffPrefab);
            newBuff.getComponent("Buff").init(window.gameScore);
            let pos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
            let mntNode = cc.find("Canvas/gameLogic/buffMntNode");
            pos = mntNode.convertToNodeSpaceAR(pos);
            newBuff.parent = mntNode;
            newBuff.setPosition(pos);
            newBuff.active = true;
            this.node.destroy();
        }
        else { }
    },
    onDestroy() {
        window.gameScore1 += 1;
    },

    start: function () {

    },

    // update (dt) {},
});
