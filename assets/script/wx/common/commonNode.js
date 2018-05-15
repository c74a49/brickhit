var self = null;
var TAG = 2100;
var commonNode = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (commonNode.instance == null) {
                commonNode.instance = new commonNode();
            }else{
                let scene = cc.director.getScene();
                let node = scene.getChildByTag(TAG);
                if(!!!node){
                    let tagSize = scene.getContentSize();
                    console.log("addNode",scene,tagSize);
                    scene.addChild(self._commonNode,1,TAG);
        
                    var _size = self._commonNode.getContentSize();
                    var scaleX = tagSize.width/_size.width;
                    var scaleY = tagSize.height/_size.height;
                    if(scaleX || scaleY){
                        var _scale = scaleX;
                        if(scaleX > scaleY){
                            _scale = scaleY;  
                        }
                        self._commonNode.setScale(scaleX,scaleY);
                        self.adapterHeight("mask",self._commonNode,scaleX,scaleY,_scale);                  
                    }         
                    self._commonNode.setPosition(_size.width/2,_size.height/2)       
                }
            }
            return commonNode.instance;
        }
    },
    ctor(){
        self = this;
        self.addNode();
        
    },
    addNode(){
        cc.loader.loadRes("wx/common/commonNode",cc.Prefab,function(err,prefab){
            self._commonNode = cc.instantiate( prefab ) ;
            console.log(self._commonNode);
            //self._js = self._commonNode.getComponent("commonLayer");
            let scene = cc.director.getScene();
            let canvas = cc.find('Canvas');

            let tagSize = canvas.getContentSize();
            console.log("addNode",scene,tagSize);
            scene.addChild(self._commonNode,1,TAG);

            var _size = self._commonNode.getContentSize();
            var scaleX = tagSize.width/_size.width;
            var scaleY = tagSize.height/_size.height;
            if(scaleX || scaleY){
                var _scale = scaleX;
                if(scaleX > scaleY){
                    _scale = scaleY;  
                }
                self._commonNode.setScale(scaleX,scaleY);
                self.adapterHeight("mask",self._commonNode,scaleX,scaleY,_scale);                  
            }         
            self._commonNode.setPosition(_size.width/2,_size.height/2)
        })
    },
    adapterHeight : function(name,widget,scaleX,scaleY,_scale,isNeedSetContent = false){
        var _widget = cc.find(name,widget);
        if(_widget){
            _widget.setScale(1/scaleX * _scale,1/scaleY *_scale);
            if(isNeedSetContent){
                self.adapterHeightContent(name,widget,scaleX,scaleY,_scale);
                self.adapterHeightContent("viewport",_widget,scaleX,scaleY,_scale);             
            }
        }       
    },
    adapterHeightContent : function(name,widget,scaleX,scaleY,_scale){
        var _widget = cc.find(name,widget);
        if(_widget){
            var _widgetSize = _widget.getContentSize();
            _widgetSize.height = _widgetSize.height*scaleY/_scale;
            _widget.setContentSize(_widgetSize.width,_widgetSize.height);
        }                  
    },
});
