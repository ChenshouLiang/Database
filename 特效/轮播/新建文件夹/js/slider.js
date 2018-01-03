(function(){
    // 只接受一个参数，JSON类型的参数
    window.Slider = Slider = function(argsJSON) {
        //参数检验
        if (!argsJSON.ID) {
            throw new Error("对不起，传入的参数中必须有ID");
            return;
        }

        this.carousel = document.getElementById(argsJSON.ID);   //最大的盒子
        //创建DOM
        this.init();
        //初始化
        this.leftBtn = this._findMyElemsByClassName("leftBtn").length ? this._findMyElemsByClassName("leftBtn")[0] : null;
        this.rightBtn = this._findMyElemsByClassName("rightBtn").length ? this._findMyElemsByClassName("rightBtn")[0] : null;
        
        this.imageList = this._findMyElemsByClassName("imageList")[0];
        this.imageLis = this.imageList.getElementsByTagName("li");
        this.circles = this._findMyElemsByClassName("circles")[0];
        this.imageLength = this.imageLis.length;
        this.circleLis = this.circles.getElementsByTagName("li");

        //定时器的间隔时间
        this.interval = argsJSON.interval || 20;

        //自动轮播的事件
        this.autoplayinterval = argsJSON.autoplayinterval || 2000;

        //缓冲公式，用户可以传进来，也可以不传进来用默认的：
        this.tween = argsJSON.tween || function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }

        //信号量
        this.idx = 0;

        //绑定监听
        this._bindEvent();

        //自动运行
        this._autoplay();
    }
    Slider.prototype.init = function(){
        this.carousel.innerHTML = [
            "<div class='btns'>",
            "   <a href='javascript:;' class='leftBtn'></a>",
            "   <a href='javascript:;' class='rightBtn'></a>",
            "</div>",
            "<div class='imageList'>",
            "   <ul>",
            "       <li class='first'><a href='#'><img src='images/0.jpg' alt='' /></a></li>",
            "       <li><a href='#'><img src='images/1.jpg' alt='' /></a></li>",
            "       <li><a href='#'><img src='images/2.jpg' alt='' /></a></li>",
            "       <li><a href='#'><img src='images/3.jpg' alt='' /></a></li>",
            "       <li><a href='#'><img src='images/4.jpg' alt='' /></a></li>",
            "   </ul>",
            "</div>",
            "<div class='circles'>",
            "   <ol>",
            "       <li class='cur'></li>",
            "       <li></li>",
            "       <li></li>",
            "       <li></li>",
            "       <li></li>",
            "   </ol>",
            "</div>"
        ].join("");
    }

    // 这个方法是函数自己的方法，函数自己内部使用的方法，外部不用实例来调用。习惯上这种内部使用的方法要加上_开头
    Slider.prototype._findMyElemsByClassName = function(className) {
        var arr = [];
        //先得到这个元素的所有后代，然后筛选谁身上有className属性
        var elems = this.carousel.getElementsByTagName("*");
        //正则，百度来的，看看元素的类名是不是有这个className独立部分
        var reg = new RegExp("(^" + className + " | " + className + " | " + className + "$|^" + className + "$)", "g");

        //遍历所有的后代，看看谁有这个类名
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].nodeType == 1 && reg.test(elems[i].className) == true) {
                arr.push(elems[i]);
            }
        }
        //返回的数组。即使只有一个结果，也返回的是数组
        return arr;
    }
    //切换为下一张图片
    Slider.prototype._next = function () {
        //函数截流，这里我们介绍第三种函数截流的方式。定时器是对象自己的属性，如果这个属性已经有值了，比如1、2、3、4……那么就return
        if (this.timer) {
            return;
        }
        //信号量的改变
        var oldidx = this.idx;
        this.idx++;
        if (this.idx > this.imageLength - 1) {
            this.idx = 0;
        }
        //这里神奇的是，不需要瞬移“就位”，因为我们的内部_animate函数会在第0帧的时候，将元素瞬移就位。
        this._animate([
            {
                "obj": this.imageLis[oldidx],
                "start": 0,
                "target": -560
            },
            {
                "obj": this.imageLis[this.idx],
                "start": 560,
                "target": 0
            }
        ], 1000);

        this._changeCircle();
    }
    //上一张
    Slider.prototype._prev = function () {
        if (this.timer) {
            return;
        }
        //信号量的改变
        var oldidx = this.idx;
        this.idx--;
        if (this.idx < 0) {
            this.idx = this.imageLength - 1;
        }
        //这里神奇的是，不需要瞬移“就位”，因为我们的内部_animate函数会在第0帧的时候，将元素瞬移就位。
        this._animate([
            {
                "obj": this.imageLis[oldidx],
                "start": 0,
                "target": 560
            },
            {
                "obj": this.imageLis[this.idx],
                "start": -560,
                "target": 0
            }
        ], 1000);

        this._changeCircle();
    }
    //跳转到某个图片去
    Slider.prototype._goto = function (num) {
        //信号量的改变
        var oldidx = this.idx;
        this.idx = num;

        if (this.idx > oldidx) {
            this._animate([
                {
                    "obj": this.imageLis[oldidx],
                    "start": 0,
                    "target": -560
                },
                {
                    "obj": this.imageLis[this.idx],
                    "start": 560,
                    "target": 0
                }
            ], 1000);
        } else if (this.idx < oldidx) {
            this._animate([
                {
                    "obj": this.imageLis[oldidx],
                    "start": 0,
                    "target": 560
                },
                {
                    "obj": this.imageLis[this.idx],
                    "start": -560,
                    "target": 0
                }
            ], 1000);
        }

        this._changeCircle();
    }
    //建议运动框架，只能更改obj的style.left属性，改不了别的属性
    Slider.prototype._animate = function (arr, time) {
        //备份一下this
        var self = this;
        //当前帧编号
        var currentFrame = 0;
        //总帧数
        var maxFrame = parseInt(time / this.interval);

        //设表先关
        clearInterval(this.timer);
        //定时器
        this.timer = setInterval(function () {
            //帧数加1
            currentFrame++;
            if (currentFrame >= maxFrame) {
                clearInterval(self.timer);
                self.timer = null;
            }
            //改变数组中的每个元素的位置
            for (var i = 0; i < arr.length; i++) {
                arr[i].obj.style.left = self.tween(currentFrame, arr[i].start, arr[i].target - arr[i].start, maxFrame) + "px";
            }
        }, this.interval);
    }
    //改变小圆点，让信号量那个小圆点有cur
    Slider.prototype._changeCircle = function () {
        for (var i = 0; i < this.circleLis.length; i++) {
            this.circleLis[i].className = "";
        }

        this.circleLis[this.idx].className = "cur";
    }

    Slider.prototype._bindEvent = function () {
        //备份this
        var self = this;
        //按钮
        if(this.rightBtn != null){
            this.rightBtn.onclick = function () {
                self._next();
            }
        }

        if(this.leftBtn != null){
            this.leftBtn.onclick = function () {
                self._prev();
            }
        }
        //循环添加监听，小圆点的点击
        for (var i = 0; i < this.circleLis.length; i++) {
            this.circleLis[i].index = i;
            //点击事件
            this.circleLis[i].onclick = function () {
                self._goto(this.index);
            }
        }

        //鼠标进入的时候timer2应该清除，
        this.carousel.onmouseover = function () {
            clearInterval(self.timer2);
        }
        //鼠标离开的时候重新设置
        this.carousel.onmouseout = function () {
            self._autoplay();
        }
    }

    Slider.prototype._autoplay = function () {
        var self = this;
        this.timer2 = setInterval(function () {
            self._next();
        }, this.autoplayinterval);
    }
 
})();