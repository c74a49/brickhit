function Norm() {
    let sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        sum += arguments[i] * arguments[i];
    }
    return Math.sqrt(sum);
};
function dot() {
    let sum = 0;
    let length = arguments.length / 2;
    for (var i = 0; i < length; i++) {
        sum += arguments[i] * arguments[i + length];
    }
};
let angle = 3;
function angle2radian(angle) {
    return angle / 180 * Math.PI;
}
var common = require("Common");
let maxSpeed = 2500;
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

/*    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.node.position = cc.v2(360,270);//初始化位置
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(800,800);//初始化速度
    }, */

    onBeginContact:function(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                other.node.getComponent("Brick").onContacked();
                audioManager.play("hitBrick", true);
                //this.gameCtl.onBallContactBrick(self.node, other.node);
                break;
            case 2://球碰到地面
                //this.gameCtl.onBallContactGround(self.node, other.node);
                break;
            case 3://球碰到托盘
                //this.gameCtl.onBallContactPaddle(self.node, other.node);
                break;
            case 4://球碰到墙
                //this.gameCtl.onBallContactWall(self.node, other.node);
                break;
            case 5:
                //console.log("touch food");
                other.node.getComponent("Food").onContacked(self, other);
                //other.node.getComponent("Brick").onContacked();
        }
    },
    setSpeed : function(x, y){
        this.speed = cc.v2(x, y);
        this.id = common.getIdentifier();
    },
    ctor: function(){
        //this.id = common.getIdentifier();
    },
    onLoad : function() {
        this.node.group = "ball";
        //this.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame();
        
    },

    /*
    getSpriteFrame: function(){
        let data = getUsrData();
        return this.spriteFrames[data.dress];
    },*/
    onEnable: function () {
        this.getComponent(cc.RigidBody).linearVelocity = this.speed;
    },
    onDisable : function() {
        //this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    },
    update: function () {
        
        let x = this.getComponent(cc.RigidBody).linearVelocity.x;
        let y = this.getComponent(cc.RigidBody).linearVelocity.y;
        if(Norm(x, y) >= maxSpeed){
            let speedVec = common.normalizev([x, y]).map((a)=>a * maxSpeed);
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(speedVec[0], speedVec[1]);
        }
        /*
        if (Math.abs(Math.atan(y / x)) < 0.01) {
            this.setDirection(cc.v2(x, Math.tan(angle2radian(angle)) * x));
        }
        else this.setDirection(cc.v2(x, y));
        */
    },
    onDestroy: function () {
        //cc.audioEngine.stop(this.current);
    },
});