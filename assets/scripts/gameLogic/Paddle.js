// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let self;
let maxSpeed = 1800;
let common = require("Common");
let tagConst = require("Const").PHYSICIS_TAG;
let buffType = require("Const").BUFF_TYPE;
let buffTimeOut = 8;
let colors = [cc.color(211, 211, 211), cc.color(255, 90, 90), cc.color(255, 222, 89),];
window.inBalls = 0;
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
        touch: cc.Node,
        ballSpriteFrames: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._pos = this.node.getPosition();
        this.speedScale = 1.0;
        this.defaultWidth = this.node.width;
        this.maxWidth = this.defaultWidth * 3.0;
        this.minWidth = this.defaultWidth * 0.4;
    },
    ctor: function () {
        self = this;
        this.src = cc.v2(0, 0);
        this.dst = cc.v2(0, 0);
    },
    reset: function (game) {
        this.game = game;
        //this.balls = 0;
        window.inBalls = 0;
        this.stages = 1;
        this.node.color = colors[this.stages % colors.length];
        //this.clearnState();
        this.touch.on("touchstart", this.onTouchStart, this);
        this.touch.on("touchmove", this.onTouchMove, this);
        this.touch.on("touchend", this.onTouchEnd, this);
        this.on = true;
    },
    onTouchStart: function (event) {
        this.src = event.getLocation();
        this.dst = this.src;
    },
    onTouchMove: function (event) {
        //将世界坐标转化为本地坐标
        //let touchPoint = this.node.parent.convertToNodeSpace(event.getLocation());
        //this.node.x = touchPoint.x;
        this.src = this.dst;
        this.dst = event.getLocation();
        //console.log(this.node.x);
    },
    onTouchEnd: function (event) {
        this.dst = event.getLocation();
        this.src = this.dst;
    },
    stop: function () {
        if (!this.on) return;
        //this.dst = this.src;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.clearnState();
        this.node.color = colors[0];
        this.touch.off("touchstart", this.onTouchStart, this);
        this.touch.off("touchmove", this.onTouchMove, this);
        this.touch.off("touchend", this.onTouchEnd, this);
        this.on = false;
    },
    clearnState: function () {
        this.unscheduleAllCallbacks();
        this.speedScale = 1.0;
        this.node.width = this.defaultWidth;
        this.getComponent(cc.PhysicsCollider).size.width = this.node.width;
        this.getComponent(cc.PhysicsCollider).apply();
    },
    changeWidthScale: function (scale) {
        let width = this.node.width * scale;
        width = Math.min(this.maxWidth, width);
        width = Math.max(this.minWidth, width);
        this.node.width = width;
        this.getComponent(cc.PhysicsCollider).size.width = width;
        this.getComponent(cc.PhysicsCollider).apply();
    },/*
    contackBall: function(id){
        if (window.ballsMap[id]) this.balls += 1;
                window.ballsMap[id] = false;
                if (window.gameBalls > 0 && this.balls >= window.gameBalls) {
                    this.game.newStage();
                    this.balls = 0; 
                }
                console.log(ballsMap, gameBalls, this.balls);
    },*/
    contackBall: function (id) {
        window.ballsMap[id] = false;
        //ball.getComponent(cc.Sprite).spriteFrame = this.ballSpriteFrames[this.stages % this.ballSpriteFrames.length];
        if (window.gameBalls > 0 && inBalls >= window.gameBalls) {
            this.game.newStage(()=>{
                window.inBalls = 0;
                this.stages++;
                this.node.color = colors[this.stages % colors.length];
            });
            
        }
    },
    onBeginContact: function (contact, self, other) {
        switch (other.tag) {
            case tagConst.TAG_BALL:
                let ball = other.node.getComponent("Ball");
                if (window.ballsMap[ball.id]) {
                    inBalls += 1;
                };
                this.contackBall(ball.id);
                ball.getComponent(cc.Sprite).spriteFrame = this.ballSpriteFrames[this.stages % this.ballSpriteFrames.length];

                break;
            case tagConst.TAG_BUFF:
                let buff = other.node.getComponent("Buff");
                switch (buff._type) {
                    case buffType.LANG15:
                        this.changeWidthScale(1.5);
                        //this.scheduleOnce(()=>this.changeLengthScale(1/1.5), buffTimeOut);
                        break;
                    case buffType.SHORT15:
                        this.changeWidthScale(1 / 1.5);
                        //this.scheduleOnce(()=>this.changeLengthScale(1.5), buffTimeOut);
                        break
                    case buffType.REVERSE:
                        this.speedScale *= -1.0;
                        //this.scheduleOnce(()=>{this.speedScale *= -1.0}, buffTimeOut);
                        break;
                }
                other.node.destroy();
                break;
        }
    },

    start() {

    },

    update(dt) {
        if (!this.on) return;
        let x = (this.dst.x - this.src.x) / dt;
        let y = (this.dst.y - this.src.y) / dt;
        let speed = Math.sqrt(x * x + y * y);
        speed = (x > 0 ? this.speedScale : -this.speedScale) * Math.min(speed, maxSpeed);
        //if (this.node.x >= this.node.parent.width + this.node.width / 4 && speed > 0 || this.node.x <= -this.node.width / 4 && speed < 0) speed = 0;
        if (this.node.x >= this.node.parent.width && speed > 0 || this.node.x <= 0 && speed < 0) speed = 0;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed, 0);
    },
});
