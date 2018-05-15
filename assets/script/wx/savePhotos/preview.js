var config = require('config');

const previewImage = function () {
    var urls = config.officalAccount.urls;
    var url = urls[Math.floor(Math.random() * (urls.length))];
    var temp = [url]; //切换为[url]
    wx.previewImage({
        // current: this.data.imgalist, // 当前显示图片的http链接    
        urls: temp // 需要预览的图片http链接列表   
    })
}

const loadRes = function () {
    var width = config.officalAccount.width;
    var deviation=(640-width)*0.5;
    cc.loader.loadRes("wx/savePhotos/officalBtn", cc.Prefab, function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        var canvas = cc.find("Canvas");
        canvas.addChild(newNode);
        if (config.officalAccount.direction == "left") {
            newNode.x = -(280-deviation);
        } else {
            newNode.x = 280-deviation;
        }
        newNode.y = (config.officalAccount.percent - 0.5) * config.officalAccount.height;
        var bigger = cc.scaleBy(3, 2);
        // var smaller=bigger.reverse();
        var seq = cc.repeat(
            cc.sequence(
                cc.moveBy(0.5, 30, 0),
                cc.moveBy(0.5, -30, 0),
                cc.scaleBy(0.4, 1.2),
                cc.scaleBy(0.4, 0.8)
            ), 1);
        newNode.runAction(seq);
    })
}

const officalAccLoad=function(){
    cc.loader.loadRes("wx/savePhotos/officalAccount", cc.Prefab, function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        var canvas = cc.find("Canvas");
        canvas.addChild(newNode);
    })
}

module.exports = {
    previewImage: previewImage,
    loadRes: loadRes,
    officalAccLoad:officalAccLoad,
}