var globalFunc ={
    getTextext(text){
        if(!!!text || !!!text["title"] || text.title.length === 0){
            return "";
        }
        console.log(text);
        var num = text.title.indexOf('#');
        if(num == -1){
            return text.title;
        }
        var nextNum = text.title.indexOf('#',num + 1);
        if(nextNum == -1){
            return text.title;
        }
        var beforeStr = text.title.slice(0,num);
        var curStr = text.title.slice(num+1,nextNum);
        var nextStr = text.title.slice(nextNum+1);
        console.log(beforeStr,"curStr",curStr,"next",nextStr);
        text.title = beforeStr+ text[curStr] + nextStr;
        console.log(text.title);
        return text.title;
    }

}

module.exports = globalFunc;