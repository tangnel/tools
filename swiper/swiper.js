/**
 *   imgArr：图片数组
 *   isChangeBtn：是否存在左右按钮
 *   isShowIndex：是否存在下标
 *   isAuto: 是否自动轮播
 *   wrapperWidth：轮播图最外层的宽度
 *   wrapperHeight：轮播图最外层的高度;
 *   imgNum: 一次轮播几张图片
 *   duration：图片切换的时间
 *   animateType：图片动画类型：轮播或者是幻灯片;
 *   direction：轮播图的方向;
 *   cirColor:下标初始化颜色;
 *   cirActiveColor:下标高亮时的颜色
 *   imgWidth: 需要进行轮播的图片的宽度;
 *   imgHeight: 需要进行轮播的图片的高度;
 *   imgArrLen:图片参数列表个数
 */

(function(){

    function Swiper(options){
        this.wrap = options.wrap;
        this.imgArr = options.imgArr;
        this.isChangeBtn = options.isChangeBtn;
        this.isShowIndex = options.isShowIndex;
        this.isAuto = options.isAuto;
        this.wrapperWidth = options.wrapperWidth || $(this.wrap).width();
        this.wrapperHeight = options.wrapperHeight || $(this.wrap).height();
        this.imgNum = options.imgNum || 1;
        this.duration = options.duration || '3000'
        this.animateType = options.animateType || 'fade';
        this.direction = options.direction || 'RightToleft';
        this.cirColor = options.cirColor || '#fff';
        this.cirActiveColor = options.cirActiveColor || "red";
        this.imgWidth =  this.wrapperWidth / this.imgNum;
        this.imgHeight = this.wrapperHeight / this.imgNum;
        this.imgArrLen = this.imgArr.length;
        this.index = 0;
        this.lock = true;
        this.timer = null;
        this.cirLiLen = 0;        
        this.init = function(){
            this.cirLiLen = this.getCirLen();
            this.createDom();
            this.initStyle();
            this.bindEvent();
            if(this.isAuto){
                this.autoPlay();
            }
        };
    }

    Swiper.prototype.createDom = function(){
        var oWrap = $("<div class='wrapper'></div>");
        var oUl = $("<ul class='swiperBox'></ul>");
        
        // //图片大小和外面li大小一样，即一个li里面就一张图片
        if(this.imgNum == 1){
            this.imgArr.forEach(function(img) {
                $("<li><img src='"+img+"'/></li>").appendTo(oUl);
            });
            //动画为无缝轮播时
            if(this.animateType == "animate"){
                oUl.append("<li><img src='"+this.imgArr[0]+"'/></li>")
            }
        }else{//图片大小和外面li大小不一样，即一个li里面多张图片
            this.cirLiLen = this.getCirLen();
            for(var i = 0; i < this.cirLiLen; i++){
                var oli = $("<li></li>");
                for(var j = 0; j < this.imgNum; j++){
                    var index = i*this.imgNum+j;
                    $("<img src='"+this.imgArr[index]+"' width='"+this.imgWidth+"'/>").appendTo(oli);
                }
                
                oUl.append(oli);
            }

            //动画为无缝轮播时
            if(this.animateType == "animate"){
                var olastli = $("<li></li>");
                for(var z = 0; z < this.imgNum; z++){
                    $("<img src='"+this.imgArr[z]+"' width='"+this.imgWidth+"'/>").appendTo(olastli);
                }
                oUl.append(olastli);
            }
            
        }

        oWrap.append(oUl);

        // 创建左右按钮
        if(this.isChangeBtn){
            var leftBtn = $("<div class='btn leftBtn'>&lt;</div>");
            var rightBtn = $("<div class='btn rightBtn'>&gt;</div>");
            oWrap.append(leftBtn).append(rightBtn);
        }

        //创建小圆点下标
        if(this.isShowIndex){
            var sUl = $("<ul class='indexBox'></ul>");
            for(var i = 0; i < this.cirLiLen; i++){
                $("<li class='cirBtn'></li>").appendTo(sUl);
            }
            oWrap.append(sUl);
        }

        $(this.wrap).append(oWrap);
    }

    Swiper.prototype.initStyle = function(){
        $(".wrapper",this.wrap).css({
            width: this.wrapperWidth,
            height: this.wrapperHeight,
            position:"relative",
            overflow:"hidden",
            marginTop: ($(this.wrap).height() - this.wrapperHeight) / 2,
        }).find(".swiperBox").css({
            width: this.wrapperWidth * this.cirLiLen,
            height: '100%',
            position:"absolute",
            left:0
        }).find("li").css({
            width: this.wrapperWidth,
            height: this.wrapperHeight,
            // float:"left",
        }).find("img").css({
            width: this.imgWidth,
            height: this.imgHeight,
        }).end().end().end().find(".btn").css({
            width:30,
            height:50,
            textAlign:"center",
            lineHeight:"50px",
            color:"#fff",
            backgroundColor:"rgba(0,0,0,0.5)",
            position:"absolute",
            top:"50%",
            cursor:"pointer",
            transform:"translateY(-50%)",
        }).end().find(".rightBtn").css({
            right:0
        }).end().find(".indexBox").css({
            width:100,
            height:20,
            position:"absolute",
            bottom:10,
            left:"50%",
            transform:"translateX(-50%)"
        }).find("li").css({
            width:6,
            height:6,
            borderRadius:"50%",
            marginLeft:5,
            float:"left",
            cursor:"pointer",
            backgroundColor:this.cirColor
        }).eq(this.index).css({
            backgroundColor:this.cirActiveColor
        }).addClass("cirActive");
        if(this.animateType == "animate"){
            $(".wrapper",this.wrap).find(".swiperBox").css({
                width: this.wrapperWidth * (this.cirLiLen +1),
            }).find("li").css({
                float:"left",
                marginTop: (this.wrapperHeight - this.imgHeight) / 2
            })
        }else if(this.animateType == "fade"){
            $(".wrapper",this.wrap).find(".swiperBox").find("li").css({
                // position:"absolute",
                // top:0,
                // left:0
            })
        }
    }

    Swiper.prototype.bindEvent = function(){
        var self = this;
        //点击向右按钮,如果存在定时器，则关闭定时器
        $(".rightBtn",this.wrap).click(function(){
            if(self.timer){
                clearInterval(self.timer);
            }
            if(self.lock){
                self.lock = false;
                self.index ++;
                self.changeIndex(self.index);
            }
        })
        // 点击向左按钮,如果存在定时器，则关闭定时器
        $(".leftBtn",this.wrap).click(function(){
            if(self.timer){
                clearInterval(self.timer);
            }
            if(self.lock){
                self.lock = false;
                self.index--;
                if (self.index == -1 && self.animateType == "animate") {
                    self.index = self.cirLiLen - 1;
                    $(".swiperBox", self.wrap).css({
                        left: "-" + (self.cirLiLen) * self.wrapperWidth + "px",
                    })
                }
                self.changeIndex(self.index);
            }
            
        })

        //点击下标小圆点,如果存在定时器，则关闭定时器
        $(".indexBox",this.wrap).on("click","li",function(){
            if(self.timer){
                clearInterval(self.timer);
            }
            var nowIndex = $(this).index();
            var activeIndex = $(this).siblings(".cirActive").index();
            if(self.lock){
                self.lock = false;
                if (self.animateType == "animate") {
                    //无缝轮播
                    if (nowIndex == 0 && activeIndex == (self.imgArr.length - 1)) {
                        self.index = self.imgArr.length;
                    } else {
                        self.index = nowIndex;
                    }
                } else {
                    self.index = nowIndex;
                }
                self.changeIndex(self.index);
            }
            
        })

        $(".wrapper",this.wrap).on("mouseenter",function(){
            if(self.timer){
                clearInterval(self.timer);
            }
        }).on("mouseleave",function(){
            if(self.isAuto){
                self.autoPlay();
            }
        })

    }

    Swiper.prototype.changeIndex = function(index){
        var self = this;
        if(this.animateType == "fade"){
            if(index == this.imgArrLen){
                this.index = 0;
            }else if( (index + 1) == 0){
                this.index = this.imgArrLen -1;
            }else{
                this.index = index;
            }
            $(".swiperBox li",this.wrap).fadeOut(this.duration)
                            .eq(this.index).fadeIn(this.duration,function(){
                                self.lock = true;
                            });
        }else{
            var imgLen = $(".swiperBox",this.wrap).children().size();
            $(".swiperBox",this.wrap).animate({
                left:"-"+this.index * this.wrapperWidth+"px",
            },this.duration,function(){
                if(index >= imgLen -1){
                    $(".swiperBox",self.wrap).css({
                        left:0
                    })
                }else if( (index + 1) == 0){
                    $(".swiperBox",self.wrap).css({
                        left:"-"+imgLen * this.wrapperWidth+"px",
                    })
                }
                self.lock = true;
            });
            if(index >= imgLen -1){
                self.index = 0;
            }else if( (index + 1) == 0){
                this.index = this.imgArrLen -1;
            }else{
                self.index = index;
            }
        }
        
        $(".indexBox",this.wrap).find("li").css({
            backgroundColor:this.cirColor,
        }).removeClass("cirActive").eq(this.index).css({
            backgroundColor:this.cirActiveColor,
        }).addClass("cirActive")
    }

    Swiper.prototype.autoPlay = function(){
        var self = this;
        this.timer = setInterval(function(){
            if (self.lock) {
                self.lock = false;
                self.index++;
                self.changeIndex(self.index);
            }
        },self.duration)
    }

    Swiper.prototype.getCirLen = function(){
        //图片大小和外面li大小一样，即一个li里面就一张图片
        if(this.imgNum == 1){
            this.cirLiLen = this.imgArrLen;
        }else{//图片大小和外面li大小不一样，即一个li里面多张图片
            var i;
            if(this.imgArrLen <= this.imgNum){ //传入图片列表少于设置的展示图片数
                this.cirLiLen = 2;
                i = this.cirLiLen * this.imgNum - this.imgArrLen;
            }else{
                this.cirLiLen = Math.ceil(this.imgArrLen / this.imgNum);
                i = Math.ceil(this.imgArrLen / this.imgNum) * this.imgNum -this.imgArrLen;
            }
            for(;i>0;i--){
                this.imgArr.push(this.imgArr[0]);
            }
            this.imgArrLen = this.imgArr.length;
            return this.cirLiLen;
        }
    }

    $.fn.extend({
        swiper : function(options){
            options.wrap = this;
            var obj = new Swiper(options);
            obj.init();
        }
    })
}())