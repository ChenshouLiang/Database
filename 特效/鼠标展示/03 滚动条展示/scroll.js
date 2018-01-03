
function $(id) {return document.getElementById(id);}
function show(obj) { obj.style.display = "block";}
function hide(obj) { obj.style.display = "none";}
function scroll() {
    if(window.pageYOffset != null)  //  ie9+ 和其他浏览器
    {
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    }
    else if(document.compatMode == "CSS1Compat")  // 声明的了 DTD
    // 检测是不是怪异模式的浏览器 -- 就是没有 声明<!DOCTYPE html>
    {
        return {
            left: document.documentElement.scrollLeft,
            top: document.documentElement.scrollTop
        }
    }
    return { //  剩下的肯定是怪异模式的
        left: document.body.scrollLeft,
        top: document.body.scrollTop
    }
}
//获取内容宽高
function $(id) {return document.getElementById(id);}
function innerWH() {
    return {
        w:window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth,

        h:window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight
    }
}


//获取鼠标点边框外到body最顶部或者body最左边的距离
function getAllTop(obj){
    var allTop = obj.offsetTop;
    var currentObj = obj;
    while(currentObj = currentObj.offsetParent){
        allTop += currentObj.offsetTop;
    }
    return allTop;
}
function getAllLeft(obj){
	var allTop = obj.offsetLeft;
	var currentObj = obj;
	while(currentObj = currentObj.offsetParent){
		allTop += currentObj.offsetLeft;
	}
	return allTop;
}
