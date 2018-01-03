/**
 * carousel函数，用来制作传统轮播
 * @param carouselID : 最大盒子的ID
 * @param autotime : 自动轮播的间隔时间
 * @param width : 宽度
 * @param animatetime : 动画运动的时间
 */
function carousel(carouselID,autotime,width,animatetime){
	var $carousel = $("#" + carouselID);
	var $m_unit = $carousel.find(".m_unit");
	var $imageLis = $carousel.find(".m_unit li");
	var $cilclesLis = $carousel.find(".circles ol li");
	var $rightBtn = $carousel.find(".rightBtn");
	var $leftBtn = $carousel.find(".leftBtn");

	var length = $imageLis.size();
	//克隆图片第1张
	$carousel.find(".m_unit ul").append($imageLis.eq(0).clone());

	//信号量
	var idx = 0;

	//定时器
	var timer = setInterval(rightBtnHandler, autotime);
	//鼠标进入定时器停止
	$carousel.mouseenter(function(){
		clearInterval(timer);
	});
	$carousel.mouseleave(function(){
		timer = setInterval(rightBtnHandler, autotime);
	});

	//监听
	$rightBtn.click(rightBtnHandler);

	function rightBtnHandler(){
		//函数截流
		if($m_unit.is(":animated")) return;
		//具体业务
		idx++;
		$m_unit.animate({"left" : -width * idx},animatetime,function(){
			if(idx > length - 1){
				idx = 0;
				$m_unit.css("left",0);
			}
		});
		changeCircle();
	}


	//监听
	$leftBtn.click(function(){
		//函数截流
		if($m_unit.is(":animated")) return;
		//具体业务
		idx--;
		if(idx < 0){
			idx = length - 1;
			$m_unit.css("left",-length * width);
		}
		$m_unit.animate({"left" : -width * idx},animatetime);
		changeCircle();
	});


	//小圆点的监听
	$cilclesLis.click(function(){
		//你点击第几个小圆点，信号量就是多少
		idx = $(this).index();
		//拉动
		$m_unit.animate({"left" : -width * idx},animatetime);
		//更改小圆点
		changeCircle();
	});


	//更改小圆点
	function changeCircle(){
		var n = idx <= length - 1 ? idx : 0;
		//让信号量那个小圆点有cur，其他小圆点没有cur
		$cilclesLis.eq(n).addClass("cur").siblings().removeClass("cur");
	}
}