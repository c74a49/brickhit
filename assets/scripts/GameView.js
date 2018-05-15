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
        this.updateScore(gameScore);
    },
    start: function () {
        this.scoreLabel.string = window.gameScore;
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
        //this.bestLabel.string = val;
    },
});
