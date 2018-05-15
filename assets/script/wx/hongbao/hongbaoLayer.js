// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var hongbao = require('./hongbao');
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
        priceEidt :{
            default:null,
            type: cc.EditBox,
        },
        priceNumEdit:{
            default:null,
            type: cc.EditBox,         
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self.init()
    },
    init(){
        self.priceEidt.string = 0;
        self.priceNumEdit.string = 0
    },

    btnClick(){
        
        var price = Math.floor( parseFloat(self.priceEidt.string)*100);
        var num = parseInt(self.priceNumEdit.string);

        console.log(price,num)

        if (isNaN(price) || isNaN(num))
        {
          return;
        }
        //领取人数不得小于1，大于100，总金额不得小于1分
        if (price < 1 || num < 1)
        {
            return;
        }
    
        //每人可领取金额必须大于等于1分
        if (price / num < 1)
        {
            return;
        }  
        hongbao.createHongbao(price,num) ;
        self.node.active = false;
    },
  
    start () {

    },

    // update (dt) {},
});
