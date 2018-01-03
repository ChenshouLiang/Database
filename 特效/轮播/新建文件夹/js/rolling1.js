(function(){
	//得到元素
	var rolling = document.getElementById("rolling1");	//大盒子
	var m_unit = document.getElementById("m_unit1");		//运动单位
	var listul = m_unit.getElementsByTagName("ul")[0];	//ul
	var imgs = listul.getElementsByTagName("img");		//img

	//图片的原来数量
	var zhefandian;	//折返点

	//复制一倍的li
	listul.innerHTML += listul.innerHTML;
	//得到所有li，包括新li
	var lis = listul.getElementsByTagName("li");	
	//所有li的个数，包括新li	
	var lislength = lis.length;		

	//现在我们要计算折返点，但是每个li的宽度都不一样，所以现在假火车的开头元素的offsetLeft就是折返点。这个元素是lis[lislength / 2];比较麻烦的是，由于Chrome的机理，如果要读取offsetLeft值必须保证所有图片加载完毕。
	for(var i = 0 , count = 0 ; i < imgs.length ; i++){
		imgs[i].onload = function(){
			count++;
			if(count == imgs.length){
				//所有图片加载完毕了，就有折返点了：
				zhefandian = lis[lislength / 2].offsetLeft;
				//所有图片加载完毕了，再开始运动
				move();
			}
		}
	}

	//信号量
	var nowleft = 0;
	var timer;

	//鼠标进入
	rolling.onmouseover = function(){
		clearInterval(timer);
	}

	//鼠标离开
	rolling.onmouseout = function(){
		move();
	}

	function move(){
		clearInterval(timer);
		//运动
		timer = setInterval(function(){
			nowleft -= 5;
			if(nowleft < -zhefandian){
				nowleft = 0;
			}
			m_unit.style.left = nowleft + "px";
		},20);
	}

})();