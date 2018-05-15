//var config  = require('config');
var localStorage = require('localStorage');
var Global = {
    //记录游戏开始次数
   gameStartTimes: parseInt( cc.sys.localStorage.getItem('GameStartTimes')) || 0,
   //randStrList: cc.sys.localStorage.getItem("RandomString"),
   //好友助力 是否有 进入游戏随机字符串
   enterGameRandStr: false,
   // 游戏内 好友助力 
   shareAssist: false,

   //低分不复活 次数记录
   //lowScoreTimes: parseInt(localStorage.getLocalStorage("lowScoreTimes")) || 0,

   userDataInfo : {},
   setUserDataInfo : function(useData){
        this.userDataInfo = useData;
   },
   //获得用户信息
   getUserDataInfo : function(){
       return this.userDataInfo;
   },
   //获得数据 by name
   getUserDataInfoByName : function(name){
        if(this.userDataInfo && this.userDataInfo[name]){
            return this.userDataInfo[name]
        }
        return null;
   },
   //设置数据
   setUserDataInfoByName : function(name,value){
        this.userDataInfo[name] = value
   },
   /**
    * 是否同一周？
    */
   isWeekTime : function (_time) {
    _time = _time ||　0;
    var now = this.getTimestamp();
    var weekTime = now - (now - 316800) % 604800;
    var _weekTime = _time - (_time- 316800)%604800;

    console.log("timeTamp",_weekTime,weekTime);
    if(_time && _weekTime === weekTime){
        return true;
    }
    return false;
  },  
  /**
   * 获得时间戳
   */
  getTimestamp:function(){
    var d = new Date();
    d.setDate(d.getDate());
    var timestamp = Date.parse(d);
    var d2 = new Date(timestamp); 
    var now = timestamp/1000;
    
    return now;
  },
    /**
     *  飘字
     * @param {*} target 
     * @param {*} _text 
     * @param {*} color 
     * @param {*} strokeColor 
     */
  flyText(target,_text,color,strokeColor,time){
    var textNode = new cc.Node;
    textNode.addComponent(cc.Label);
    textNode.addComponent(cc.LabelOutline);
    textNode.setContentSize(500,200);
    var text = textNode.getComponent(cc.Label);
    text.string = _text || "" ;//"飘字";
    text.fontSize = 40;
    text.lineHeight = 40;
    text.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
    textNode.color = color || cc.color(247,255,43,255);
    var textOutLine = textNode.getComponent(cc.LabelOutline);
    textOutLine.color = strokeColor || cc.color(63,2,2,255);
    textOutLine.width = 2;
    target.addChild(textNode);
    var anchor = target.getAnchorPoint();
    var size = target.getContentSize();
    textNode.setPosition((0.5- anchor.x)*size.width/2, (0.5 -anchor.y)*size.height);

    var fadeOut = cc.fadeOut(0.2);
    var move = cc.moveBy(0.2,cc.p(0,200));
    time = time || 0.3;
    textNode.runAction(cc.sequence(cc.delayTime(time), cc.spawn( fadeOut,move),cc.callFunc(function(){
        textNode.destroy();
    })))
},
    addStartGameTimes(num){
        num = num || 1;
        
        this.gameStartTimes +=num;
        cc.sys.localStorage.setItem('GameStartTimes',this.gameStartTimes);
    },
    getStartGameTimes(){
        let times = cc.sys.localStorage.getItem('GameStartTimes');
        if(!!!times){
            cc.sys.localStorage.setItem('GameStartTimes',0);
            this.gameStartTimes = 0
        }else{
            this.gameStartTimes = parseInt(times);
        }
        return this.gameStartTimes;
    },
    //是否是相同 随机串
    IsRepeatRandString(str){
        console.log("IsRepeatRandString");
        let _string = cc.sys.localStorage.getItem("RandomString");
        let strList = null;
        if(!!!_string){
            return  false;
        }else{
            strList = JSON.parse(_string);
        }
        console.log(_string);
        for(let i = 0; i< strList.length; i ++){
            if(str == strList[i]){
                return true;
            }
        }
        return false;
    },
    addRandString(str){
        let _string = cc.sys.localStorage.getItem("RandomString");
        let strList = null;
        if(!!!_string){
            strList = new Array();
            strList.push(str);
            cc.sys.localStorage.setItem("RandomString",JSON.stringify(strList));
        }else{
            strList = JSON.parse(_string);
            strList.push(str);
            cc.sys.localStorage.setItem("RandomString",JSON.stringify(strList));
        }     
    },
    getEnterGameRandStr(){
        return this.enterGameRandStr;
    },
    setEnterGameRandStr(flag){
        this.enterGameRandStr = flag;
    },
    getShareAssist(){
        return this.shareAssist;
    },
    setShareAssist(flag){
        this.shareAssist = flag;
    },
    // 低分不复活 次数记录
    getLowScoreTimes(){
       let times =  parseInt(localStorage.getLocalStorage("lowScoreTimes")) || 0;
       return times;
    },
    setLowScoreTimes(){
        let times =  parseInt(localStorage.getLocalStorage("lowScoreTimes")) || 0;
        localStorage.setLocalStorage("lowScoreTimes",times+1);
    },
    // 高分分不复活 次数记录
    getHeightScoreTimes(){
        let times =  parseInt(localStorage.getLocalStorage("heightScoreTimes")) || 0;
        return times;
     },
     setHeightScoreTimes(){
         let times =  parseInt(localStorage.getLocalStorage("heightScoreTimes")) || 0;
         localStorage.setLocalStorage("heightScoreTimes",times+1);
     },
};

module.exports = Global;