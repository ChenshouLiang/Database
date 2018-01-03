var form = document.getElementById("form");
var shoujihaoTxt = document.getElementById("shoujihao");
var qqTxt = document.getElementById("qq");

//当表单提交的时候
form.onsubmit = function(){
	var shoujihao = shoujihaoTxt.value;
	var qq = qqTxt.value;

	if(!/^1[\d]{10}$/.test(shoujihao)){
		alert("请输入正确的手机号");
		return false;
	}

	if(!/^[\d]{5,11}$/.test(qq)){
		alert("请输入正确的QQ号");
		return false;
	}

	return true;
}