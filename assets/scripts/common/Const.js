// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

module.exports = {
    version: "v0.1.1",
    coinsKey: "coins",
    bestKey: "bestScore",
    usrData: "usrData",
    bannerWidth: 300,
    bannerTop: 100,
    PHYSICIS_TAG: {
        TAG_BALL: 0,
        TAG_WALL: 4,
        TAG_GROUND: 2,
        TAG_PADDLE: 3,
        TAG_BRICK: 1,
        TAG_FOOD: 5,
        TAG_BUFF: 6,
    },

    FOOD_TYPE: {
        TYPE_BOOM: 1,         //炸弹
        TYPE_BALL: 2,         //分裂
        TYPE_BUFF :3,         //BUFF

        TYPE_BRICK:100,        //砖块
        TYPE_NULL: 101,         //空

    },

    BUFF_TYPE:{
        LANG15: 1,  //  1.5倍长度
        SHORT15: 2, //  1/1.5 倍长度
        REVERSE: 3, //  反向操作
    },
};
