import { version } from "punycode";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

/* 
 * 
 */
window.identifier = 1;
var Hex2rgb = function (xs, hex) {
	if (hex.length < 2) return xs;
	let x = parseInt("0x" + hex.slice(0, 2));
	return Hex2rgb(xs.concat(x), hex.slice(2));
};
//Funcotr f :: (a -> b) -> [a] -> [b] 
var map = (f, arr) => arr.map(f);
//compose :: (b -> c) -> (a -> b) -> (a -> c)
var compose = (fbc, fab) => ((a) => fbc(fab(a)));
//head:: [a] -> a
var head = (arr) => arr.slice(0, 1)[0];
//tail:: [a] -> [a]
var tail = (arr) => arr.slice(1);
//sum:: Number -> [Number] -> Number
var sum = (s, arr) => head(arr) == undefined ? s : sum(s + head(arr), tail(arr));
//var sum = (s, arr) => {console.log(head(arr), tail(arr)); return head(arr) == undefined ? s : sum(s + head(arr), tail(arr));}
//square :: Number -> Number
var square = (x) => x * x;
const sqrt = Math.sqrt;
let self = {
    //规格化
    //normalize:: [Number] -> [Number] 
    normalizev: (v) =>{
		if(!v){console.log("error ", v,);return;}
		//sumi:: [Number] -> Number
		var sumi = (arr) => sum(0, arr);
		//sqrtSquareSum:: [Number] -> Number;
		//var squareSum = compose(sumi, (arr)=>map(square, arr));
		var sqrtSquareSum = compose(sqrt, compose(sumi, (arr)=>map(square, arr)));
		//return map((x) => x / sqrtSquareSum(v), v);
		return map((x)=>self.normalize(sqrtSquareSum(v), x), v);
	},
	//
	getIdentifier:()=>{
		if(window.identifier) return window.identifier++;
		return window.identifier = 1;
	},
	_flyText: function (parentNode, str) {
		var textNode = new cc.Node;
		textNode.addComponent(cc.Label);
		textNode.addComponent(cc.LabelOutline);
		var text = textNode.getComponent(cc.Label);
		text.string = str;
		text.fontSize = 32;
		text.lineHeight = 32;
		textNode.color = cc.color(255, 255, 255, 255);
		var textOutLine = textNode.getComponent(cc.LabelOutline);
		textOutLine.color = cc.color(63, 2, 2, 255);
		textOutLine.width = 2;
		parentNode.addChild(textNode);
		var size = parentNode.getContentSize();
		//textNode.setPosition(size.width/2,size.height);
		var fadeOut = cc.fadeOut(0.2);
		var move = cc.moveBy(0.2, cc.p(0, 200));
		textNode.runAction(cc.sequence(cc.delayTime(0.3), cc.spawn(fadeOut, move), cc.callFunc(function () {
			textNode.destroy();
		}, parentNode)))
	},
	getStorageSync: function (key) {
		//if (cc.sys.platform == cc.sys.WECHAT_GAME) {
		//    let data = wx.getStorageSync(key)
		//    if(data) return JSON.parse(data);
		//}
		let data = cc.sys.localStorage.getItem(key);
		if (data) return JSON.parse(data);

	},
	setStorageSync: function (key, value) {
		//if (cc.sys.platform == cc.sys.WECHAT_GAME) {
		//    return wx.setStorageSync(key, JSON.stringify(value));
		//}
		//console.log(value, JSON.stringify(value))
		cc.sys.localStorage.setItem(key, JSON.stringify(value));
	},
	rgb2hsv: function (rgb) {
		let r = rgb[0], g = rgb[1], b = rgb[2];
		let max = Math.max(r, g, b);
		let min = Math.min(r, g, b);
		let h = 0.0;
		let s = 0.0;
		let v = max;
		let delta = max - min;
		if (max > 0.0)
			s = delta / max;
		else {
			//r == g == b == 0.0;
			s = 0.0;
			h = -1.0;
			return [h, s, v];
		}
		if (r == max) h = (g - b) / delta;  // between yellow & magenta
		else if (g == max)
			h = 2.0 + (b - r) / delta;      // between cyan & yellow
		else
			h = 4 + (r - g) / delta;      // between magenta & cyan
		h *= 60.0;      // degrees
		if (h < 0.0)
			h += 360.0;
		return [h, s, v];
	},
	hsv2rgb: function (hsv) {
		let h = hsv[0], s = hsv[1], v = hsv[2];
		let r = 0.0, g = 0.0, b = 0.0;
		if (s <= 0.0) {
			// achromatic (grey)
			r = g = b = v;
			return [r, g, b]
		}
		h /= 60.0;            // sector 0 to 5
		let i = Math.floor(h);
		let f = h - i;          // factorial part of h
		let p = v * (1 - s);
		let q = v * (1 - s * f);
		let t = v * (1 - s * (1 - f));
		switch (i) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			default:        // case 5:
				r = v;
				g = p;
				b = q;
				break;
		}
		return [r, g, b];
	},
	//normalize :: Int -> Int -> Float;
	normalize: function (domainSize, x) {
		return x / domainSize;
	},
	//rnormalize :: Int -> Int -> Float;
	rnormalize: function (domainSize, x) {
		return x * domainSize;
	},
	//hex2rgb :: String -> [Int]
	hex2RGB: (hex) => Hex2rgb([], hex),


	wxBversionLess: (vs) => {
		if (cc.sys.platform == cc.sys.WECHAT_GAME) {
			let bVersion = wx.getSystemInfoSync().SDKVersion;
			var vs2vn = (vs) => {
				return parseInt(vs.split(".").join("").slice(0, 3));
			}
			return vs2vn(bVersion) < vs2vn(vs);
		}
		return true;
	},
	//@func1 success callBack
	//@func2 fail callBack
	playAd: (func1, func2) => {
		if (cc.sys.platform == cc.sys.WECHAT_GAME) {
			if (!self.wxBversionLess("2.0.4") && window.flashAd) {
				let videoAd = wx.createRewardedVideoAd({
					adUnitId: 'adunit-0cc4ea5c4452afef'
				})
				let callBack = () => {
					videoAd.offClose(callBack);
					if (typeof func1 == "function") func1();
				}
				videoAd.load()
					.then(() => { videoAd.onClose(callBack); return videoAd.show() })
					.catch(err => { //fail
						if (typeof func2 == "function") func2();
						console.log(err.errMsg);
					})
			} else{	//基础库低于2.0.4 || 关闭视频激励广告 fail
				if (typeof func2 == "function") func2();
			}
		}
		else {	//非微信平台，success
			if (typeof func1 == "function") func1();
		}
	},
}
module.exports = self;
