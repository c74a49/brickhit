// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var self = null
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
        image:{
            default:null,
            type:cc.Node,
        },
        nameUser:{
            default:null,
            type:cc.Node,
        },
        score:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
    },

    start () {

    },
    init(data,index){
        self = this;
        var nameLabel = self.nameUser.getComponent(cc.Label)
        var scoreLabel = self.score.getComponent(cc.Label)
        var sprite = self.image.getComponent(cc.Sprite)
        var ranks = cc.find("rank",self.node)
        ranks = ranks.getComponent(cc.Label)
        
        ranks.string = index + 4
        //console.log(data)
        nameLabel.string = data.name || "";
        scoreLabel.string = data.score || 0 ;

        //获取人物头像
        var texture = data.portrait;
        if (!texture){
            return
        }
        texture = texture.split("/0",1); 
        texture = texture + "/64";
        cc.loader.load({url:texture, type:'png'},function(err,texture){
            //console.log("loadUrl",texture instanceof cc.Texture2D)
            var spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(texture)
            sprite.spriteFrame = spriteFrame

        })
    }

    // update (dt) {},
});
