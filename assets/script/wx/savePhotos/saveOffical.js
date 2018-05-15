
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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.active = true;
    },

    saveOffical() {
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.saveImageToPhotosAlbum({
                filePath: 'res/raw-assets/resources/wx/savePhotos/res/offical.png',
                success(result) {
                    console.log("success");
                    console.log(result)
                    wx.showModal({
                        title: '怎么扫描二维码？',
                        content: '图片保存相册后，点击微信中的扫一扫，然后点击右上角的相册，从相册中选取这张图片即可！',
                        showCancel: false,
                        success: function (res) {
                        }
                    });
                }, fail(result) {
                    console.log(result);
                    wx.getSetting({
                        success(res) {
                            if (!res.authSetting['scope.writePhotosAlbum']) {
                                wx.showModal({
                                    title: '保存失败',
                                    content: '是否打开保存相册权限？',
                                    success: function (res) {
                                        if (res.confirm) {
                                            wx.openSetting({
                                            })
                                        }
                                    }
                                })
                            }else{
                                //保存失败
                                wx.showModal({
                                    title: '保存失败',
                                    showCancel: false,
                                    success: function (res) {
                                    }
                                });
                            }
                        }
                    })
                }
            })
        }
    },
    closeEvent() {
        this.node.active = false;
    }

    // update (dt) {},
});
