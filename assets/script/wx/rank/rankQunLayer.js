// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//var rank = require('./rank')
var config = require('config');
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
        listItem :{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self._listData = new Array();
        self._bestsData = new Array();
        self._weekRankTitle = cc.find('top/Title',self.node).getComponent(cc.Label);
        self._loopScrollView = cc.find('rankScroll',self.node).getComponent('uiloopscrollview');
        self._initLoopScrollView();
        self._rankShowWidget = new Array();
        for(var i = 0; i < 3 ; i++){
            var index = i+1;
            self._rankShowWidget[i] = cc.find("top/rank_"+index,self.node);
        }
        self.register()
    },
    maskTouch(event,cusData){
        if(event){
            event.stopPropagation();
        }
    },
    loadTexture(list,textureDatas){
        for(var i = 0 ; i < list.length; i++){
            var texture = list[i].portrait;
            if (!texture){
                continue;
            }
            texture = texture.split("/0",1); 
            texture = texture + "/64";
            cc.loader.load({url:texture, type:'png'},function(err,texture){
                var spriteFrame = new cc.SpriteFrame();
                //spriteFrame.setTexture(texture)
                textureDatas.push(spriteFrame);    
            })            
        }
    },
    register(){
        var backbtn = cc.find("top/backBtn",self.node);
        backbtn.on('click',function(event){
            if(self._callBack){
                self._callBack()
            }
            self.node.active = false
        },self)
    },
    start () {

    },
    createItem(i,info){
        var _item = cc.instantiate(self.listItem);
        var itemJs = _item.getComponent('item')
        itemJs.init(info,i);
        return _item ;
    },
    //处理new 出来的数据
    clearList(list){
        for(var i = 0; i< list.length; i++){
            list[i].destroy();
            list[i] = 0;
        }       
    },
    init(data,callbacks,isWeek){
        console.log("qundata",data)
        if(isWeek){
            self._weekRankTitle.string = '群排行榜'
        }else{
            self._weekRankTitle.string = '群排行榜' 
        }
        self._listData.splice(0,self._listData.length)
        var value = data;
        for(let i = 0; i< value.length; i++){
            self._listData[i] = value[i];
            console.log("myUID",config.UID,value[i].uid)
            if(value[i].uid == config.UID){
                
                self._myRank = i + 1;  
            }
        }
        //self._myRank = data.myRank
        self._callBack = callbacks
        //我的排名
        var myRnakWidget = cc.find("myRankBg/myRank",self.node)
        if(self._myRank){
            myRnakWidget.getComponent(cc.Label).string = "我的排名："+ self._myRank;
        }else{
            myRnakWidget.getComponent(cc.Label).string = "我的排名：未上榜";    
        }
        self.initBestsData()
        //self._initScroll(self.rankScroll,self._listData.length,self._listData);
        self._loopScrollView.setTotalNum(self._listData.length);
        
    },
    initBestsData()
    {
        self._bestsData.splice(0,self._bestsData)
        for(let i = 0; i < 3 ; i++){
            var value = self._listData.shift()
            if(typeof(value) !="undefined"){ 
                self._bestsData.push(value) 
            }
        }
        self._initBestsView(self._bestsData)
    },
    _initBestsView(list){
        for(let i = 0; i < 3 ; i++){
            var value = list[i];
            if(typeof(value) !="undefined"){ 
                self._initBest(i +1,value)
                self._rankShowWidget[i].active = true;
            }else{
                self._rankShowWidget[i].active = false ;            
            }
        }      
    },
    _initBest(index, value){
        var path = "top/rank_"+index
        //这些都无用
        var _rank = cc.find(path,self.node);
        var name = cc.find("name",_rank);
        name = name.getComponent(cc.Label)
        var grade = cc.find("star/grade",_rank);
        grade = grade.getComponent(cc.Label)
        var location = cc.find("location",_rank);
        location = location.getComponent(cc.Label)
        var image = cc.find("mask/image",_rank);
        image = image.getComponent(cc.Sprite)

        name.string = value.name || "";
        grade.string = value.score || 0 ;
        if(value["city"]){
            location.string = "地区:"+value.city;
        }    
        //获取人物头像
        var texture = value.portrait;
        if (!texture){
            return
        }
        texture = texture.split("/0",1); 
        texture = texture + "/64";
        cc.loader.load({url:texture, type:'png'},function(err,texture){
            var spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(texture)
            image.spriteFrame = spriteFrame

        })

    },
    _initLoopScrollView(){
        self._loopScrollView.registerCreateItemFunc(function(){
            var itemNode = cc.instantiate(self.listItem);
            return itemNode;
        });
        self._loopScrollView.registerUpdateItemFunc(function(cell,index){
            var js = cell.getComponent('item');
            js.init(self._worldsData[index],index);
        });
    },
    // _initScroll(_scroll, num, data){
    //     var _height = 0
    //     var content = _scroll
        
    //     for(let i = 0 ; i < num;i ++){
    //         var item = self.createItem(i,data[i])       
    //         content.addChild(item)
    //         if (_height === 0){
    //             _height = item.getContentSize().height
    //         }
    //         item.setPosition(0,- i * _height - _height/2)
    //     };
    //     var contentSize = content.getContentSize()
    //     if (_height*num > contentSize.height){
    //         content.setContentSize (contentSize.width, _height*num)
    //     }
    //     contentSize = content.getContentSize()
    // },
    // update (dt) {},
});
