var TEST_DEBUG = false;
var _base_url = "https://gamecenter.phonecoolgame.com";
if (TEST_DEBUG){
    _base_url = "https://192.168.2.24";
    
}

const base_url = _base_url;
var url_login = base_url + "/login"; //用户登录
var url_user = base_url + "/user"; //用户信息
var url_hongbao = base_url + "/hongbao"; //红包信息
var url_pay = base_url + "/pay/unifiedOrder"; //支付
var url_match = base_url + "/match"; //比赛活动
var url_lottery = base_url + "/lottery"; //开奖
var url_share = base_url + "/share";// 分享
var url_advert=base_url+"/advert/activate"; //设备激活接口


///////////////这个是SDKDemo的参数，需要填自己的参数/////////////
var config_appid = "wx20efd16081f0673d";
var config_appsecret = "3cfdf451dbe25c76f3d90cec80391d7d";



/////////////游戏主场景，需要根据自己的情况修改//////////////
var loginScene = "start"; // 登录 scene
/////////////////////////////////////////////////////////////

///////////////////////连接gameCenter服务器 开关/////////////////////////////////////////
var gamecenter_link = false;
////////////////////////////////////////////////////////////////////////////

////////////////share分享Title/////////////////////////
/////////////////1为正常分享文字，2 为 分数分享文字  （#score#） 必须固定格式 /////////////
var shareTitles = {"1":[{title:"有人@我 谈什么恋爱，弹弹珠才是正经事！"},
                        {title:"有人@我 抖音最火爆游！没玩弱爆了！"},
                ],
                   "2":[{title:"有人@我 我已达到#score#分！你敢挑战我吗？"},
                        {title:"有人@我 巅峰对决！我已达#score#分！赶快来！" },
                        {title:"有人@我已达到 #score# 分，你敢来弹我一下？"},
                   ],
                   "3":[{title:"有人@我 来帮我助力赚金币吧，点进来大家都能拿~"},
                        {title:"有人@我 这这游戏太好玩，帮我点下得金币！"},
                        {title:"有人@我 这游戏太魔性了，快帮我点下得金币啊！"},
                    ]
                }
/////////////////////////////////////////////////////

var rankTag= 2005; // 排行榜target
const getParam = function(){
    var util = require('util');
    return {
        appid: config_appid,
        logintype: "wx",//freein 为测试用 不用校验微信登录信息
        noncestr: util.randomString(),
      };
}

module.exports = {
    topScore: 30,
    myAssist: 10,
	gold:10,
    urls: {
        login: url_login,
        user: url_user,
        hongbao: url_hongbao,
        pay: url_pay,
        match: url_match,
        lottery: url_lottery,
        share: url_share,
        advert:url_advert
    },
    config: {
        appid: config_appid,
        appsecret: config_appsecret
    },

    getParam:getParam,
    
    userInfo:'',
    loginScene:loginScene,
    rankTag:rankTag,
    gamecenter_link: gamecenter_link,
    //暂时替代资源
    useName:'',
    UID :'',
    sessionkey:'',
    // 群进入的shareTickey 和  通过服务器解析出的 groupOpenGID
    shareTicket:'',
    groupOpenGID:'',
    shareGroupTime:0,
    shareTitles:shareTitles,
    officalAccount: {
        show: true,
        width:640,
        height:1136,
        direction: "left",
        percent: 0.8,
        urls: ['https://img.phonecoolgame.com/wx_game/20180424/1524554646586.jpg', 'https://img.phonecoolgame.com/wx_game/20180424/1524554725298.jpg'/*, 'https://img.phonecoolgame.com/wx_game/20180424/1524554816301.jpg'*/, 
            'http://img.phonecoolgame.com/wx_game/20180426/1524748262399.jpg', 'http://img.phonecoolgame.com/wx_game/20180426/1524748253288.jpg', 'http://img.phonecoolgame.com/wx_game/20180426/1524748239073.jpg', ]
        // 飞刀：https://img.phonecoolgame.com/wx_game/20180424/1524554646586.jpg
        // 贪吃蛇：https://img.phonecoolgame.com/wx_game/20180424/1524554725298.jpg
        // 弹珠：https://img.phonecoolgame.com/wx_game/20180424/1524554816301.jpg
        //物理弹珠 http://img.phonecoolgame.com/wx_game/20180426/1524748262399.jpg
        //数字点点消：http://img.phonecoolgame.com/wx_game/20180426/1524748253288.jpg
        //六六六消除：http://img.phonecoolgame.com/wx_game/20180426/1524748239073.jpg
    }
}