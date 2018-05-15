var self = null;
var myAssist = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (myAssist.instance == null) {
                myAssist.instance = new myAssist();
            }
            return myAssist.instance;
        }
    },

    ctor: function () {
        self = this;
        //this._loadMyssistWidget();
    },
    _loadMyssistWidget(callBack){
        cc.loader.loadRes("wx/myAssit/assistWiiget",cc.Prefab,function(err,prefab){
            self._myAssistWidgetPrefab = prefab;
            if(callBack){
                callBack();
            }
        })
    },
    loadMyAssistWidget : function(target,name){
        cc.loader.loadRes("wx/myAssit/assistWiiget",cc.Prefab,function(err,prefab){
                var rankWidget = cc.instantiate(prefab);
                target.node.addChild(rankWidget);
                //适配高 宽
                var _size = rankWidget.getContentSize();
                var tagSize = target.node.getContentSize();

                var scaleX = tagSize.width/_size.width;
                var scaleY = tagSize.height/_size.height;
                if(scaleX || scaleY){
                    var _scale = scaleX;
                    if(scaleX > scaleY){
                        _scale = scaleY;  
                    }
                    rankWidget.setScale(scaleX,scaleY);
                    self.adapterHeight("ui",rankWidget,scaleX,scaleY,_scale);
                    // self.adapterHeight("myRankBg",rankWidget,scaleX,scaleY,_scale);
                    // self.adapterHeight("rankSp",rankWidget,scaleX,scaleY,_scale);                   

                }else{
                    rankWidget.setContentSize(tagSize.width,tagSize.height);  
                }
            
                rankWidget.setPosition(cc.p(0,0))
                
                rankWidget.active = false;
                name = name || "myAssistWidget";
                target[name] = rankWidget;
            // var loadFunc = function(){
            //     var rankWidget = cc.instantiate(self._myAssistWidgetPrefab);
            //     target.node.addChild(rankWidget);
            //     //适配高 宽
            //     var _size = rankWidget.getContentSize();
            //     var tagSize = target.node.getContentSize();

            //     var scaleX = tagSize.width/_size.width;
            //     var scaleY = tagSize.height/_size.height;
            //     if(scaleX || scaleY){
            //         var _scale = scaleX;
            //         if(scaleX > scaleY){
            //             _scale = scaleY;  
            //         }
            //         rankWidget.setScale(scaleX,scaleY);
            //         // self.adapterHeight("top",rankWidget,scaleX,scaleY,_scale);
            //         // self.adapterHeight("myRankBg",rankWidget,scaleX,scaleY,_scale);
            //         // self.adapterHeight("rankSp",rankWidget,scaleX,scaleY,_scale);                   

            //     }else{
            //         rankWidget.setContentSize(tagSize.width,tagSize.height);  
            //     }
            
            //     rankWidget.setPosition(cc.p(0,0))
                
            //     rankWidget.active = false;
            //     name = name || "myAssistWidget";
            //     target[name] = rankWidget;
            // }
            // if(!!!self._myAssistWidgetPrefab){
            //     self._loadMyssistWidget(loadFunc); 
            // }else{
            //     loadFunc();
            // }

        })
    },
    loadAssistLayerTwo : function(target,name){
        cc.loader.loadRes("wx/myAssit/assistLayerTwo",cc.Prefab,function(err,prefab){
                var rankWidget = cc.instantiate(prefab);
                target.node.addChild(rankWidget);
                //适配高 宽
                var _size = rankWidget.getContentSize();
                var tagSize = target.node.getContentSize();

                var scaleX = tagSize.width/_size.width;
                var scaleY = tagSize.height/_size.height;
                if(scaleX || scaleY){
                    var _scale = scaleX;
                    if(scaleX > scaleY){
                        _scale = scaleY;  
                    }
                    rankWidget.setScale(scaleX,scaleY);
                    self.adapterHeight("ui",rankWidget,scaleX,scaleY,_scale);
                    // self.adapterHeight("myRankBg",rankWidget,scaleX,scaleY,_scale);
                    // self.adapterHeight("rankSp",rankWidget,scaleX,scaleY,_scale);                   

                }else{
                    rankWidget.setContentSize(tagSize.width,tagSize.height);  
                }
            
                rankWidget.setPosition(cc.p(0,0))
                
                rankWidget.active = false;
                name = name || "assistLayerTwo";
                target[name] = rankWidget;

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
})