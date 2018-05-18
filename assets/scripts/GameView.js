cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        bestLabel: cc.Label,
        goldLabel: cc.Label,
        help4Gold: cc.Node, 
    },
    onLoad:function(){
        this.wxAddLayer = this.getComponent("wxAddLayer");
        //
    },
    update:function(){
        //this.updateScore(gameScore);
        this.updateScore(gameScore1);
    },
    start: function () {
        this.updateScore(gameScore1);
        this.updateBest(this.wxAddLayer.getScore());
        //this.help4Gold.active = this.wxAddLayer.checkScore();
        this.help4Gold.active = false;
    },
    updateScore: function (score) {
        this.scoreLabel.string = score;
    },
    updateGold: function(val){
        //this.goldLabel.string = val;
    },
    updateBest: function (val) {
        this.bestLabel.string = val;
    },
});
