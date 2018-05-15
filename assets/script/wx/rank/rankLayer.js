//import { text } from './C:/Users/wu/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/body-parser';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var rank = require('./rank');
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
        tongle1:{
            default:null,
            type:cc.Toggle,
        },
        tongle2:{
            default:null,
            type:cc.Toggle,
        },
        listItem :{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        self._friendsData = new Array();
        self._worldsData = new Array();
        self._friendsBests = new Array();
        self._worldsBests = new Array();

        self._weekRankTitle = cc.find('top/Title',self.node).getComponent(cc.Label);
        self._myRank = 0;
        self._scroll2 = cc.find("rankScroll2",self.node);
        self._content2 = self._scroll2.getComponent('uiloopscrollview');
        self._c2 = cc.find("rankScroll2/viewport/content",self.node);
        self._cc2 = cc.find("rankScroll2/viewport",self.node);
        self._scroll1 = cc.find("rankScroll",self.node);
        self._content1 = self._scroll1.getComponent('uiloopscrollview');
        self._c1 = cc.find("rankScroll/viewport/content",self.node);
        self._cc1 = cc.find("rankScroll/viewport",self.node);
        self._initLoopScrollView1(self._content1);
        self._initLoopScrollView2(self._content2);

        self._checkToggle1 = cc.find("top/check/toggle1",self.node).getComponent(cc.Toggle);
        self._rankShowWidget = new Array();
        for(var i = 0; i < 3 ; i++){
            var index = i+1;
            self._rankShowWidget[i] = cc.find("top/rank_"+index,self.node);
        }
        self.register()
    },
    //终止 touch 传递
    maskTouch(event,cusData){
        if(event){
            event.stopPropagation();
        }
    },

    qunRankBtn(){
        
        var parent = self.node.parent;
        var js = parent.getComponent('wxAddLayer');
        if(!!!js){
            return;   
        }
        if(config.shareTicket){ 
            self.node.active = false;
            js.getOpenDataQunRankBtn();

        }else{
            js.shareBtn();          
        }
       
    },

    register(){
        var backbtn = cc.find("top/backBtn",self.node);
        backbtn.on('click',function(event){
            if(self._callBack){
                self._callBack()
            }
            self.node.active = false;
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
    init(res,callbacks,isWeek){
        console.log("rankLayer",res);
        if(isWeek){
            self._weekRankTitle.string = '周排行榜'
        }else{
            self._weekRankTitle.string = '周排行榜' 
        }
        self._friendsData.splice(0,self._friendsData.length);
        self._worldsData.splice(0,self._worldsData.length);
        //console.log("inittas",res.friendRank,res.worldRank)
        self._friendsData = res.friendRank;
        self._worldsData = res.worldRank;
        // for(var i = 0; i< 100; i++){
        //     self._friendsData[i] = res.friendRank[0];
        //     self._worldsData[i] = res.worldRank[0];
        // }
        self._myRank = res.myRank;
        self._callBack = callbacks;

        //我的排名
        var myRnakWidget = cc.find("myRankBg/myRank",self.node)
        if(self._myRank){
            myRnakWidget.getComponent(cc.Label).string = "我的排名："+ self._myRank;
        }else{
            myRnakWidget.getComponent(cc.Label).string = "我的排名：未上榜";    
        }
        
        self.initBestsData();
         self._resetLoopScrollView(self._content1,self._friendsData.length);
        // console.log("self._friendsData.length",self._friendsData.length,self._scroll1.active);
        // self._resetLoopScrollView(self._content2,self._worldsData.length);
        // console.log("self._worldsData.length",self._worldsData.length,self._scroll2.active)
        self._scroll2.active = false;
        self._checkNum = 0;
        self._checkToggle1.check();
        
    },
    initBestsData()
    {
        self._friendsBests.splice(0,self._friendsBests.length)
        self._worldsBests.splice(0,self._worldsBests.length)
        for(let i = 0; i < 3 ; i++){
            let value = self._friendsData.shift();
            let value2 = self._worldsData.shift();
            if(typeof(value) !="undefined"){ 
                if(value["score"] && value.score != 0){
                    self._friendsBests.push(value)  
                }    
            }
            if(typeof(value2) !="undefined"){ 
                if(value2["score"] && value2.score != 0){
                    self._worldsBests.push(value2)   
                }      
            }
        }
        self._initBestsView(self._friendsBests)
    },
    _initBestsView(list){
        for(let i = 0; i < 3 ; i++){
            var value = list[i];
            if(typeof(value) !="undefined"){ 
                self._initBest(i +1,value);
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
            location.string = '地区:'+value.city;
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
    _initLoopScrollView1(_scroll,num,data){
       
        _scroll.registerCreateItemFunc(function(){
            var itemNode = cc.instantiate(self.listItem);
            return itemNode;
        });
        _scroll.registerUpdateItemFunc(function(cell,index){
            var js = cell.getComponent('item');
            js.init(self._friendsData[index],index);
        });

    },
    _resetLoopScrollView(_scroll,num){
        //_scroll.moveToFront(0.1);
        _scroll.setTotalNum(num);
        _scroll.resetView();
    },
    _initLoopScrollView2(_scroll,num,data){
       
        _scroll.registerCreateItemFunc(function(){
            var itemNode = cc.instantiate(self.listItem);
            return itemNode;
        });
        _scroll.registerUpdateItemFunc(function(cell,index){

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
    // },
    checkTongle1(){
        console.log("check1")

        self._initBestsView(self._friendsBests);
        self._scroll1.active = true;
        self._scroll2.active = false;
        self._c1.active = true; 
        self._cc1.active =true;   
        // if(self._checkNum< 2)         
        // {
        //     self._resetLoopScrollView(self._content1,self._friendsData.length); 
        // }
        // self._checkNum ++; 
        
    },
    checkTongle2(){
        console.log("check2")
        self._initBestsView(self._worldsBests) 
        self._scroll1.active = false;
        self._scroll2.active = true;
        self._c2.active = true;
        self._cc2.active =true;
        self._checkNum ++;
        if(self._checkNum<= 1)         
        {
            self._resetLoopScrollView(self._content2,self._worldsData.length); 
        }
         
        
    }
    // update (dt) {},
});
