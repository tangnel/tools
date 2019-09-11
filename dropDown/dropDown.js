(function(){
    // 创建下拉列表对象
    function DropDown(options){
        this.father = options.father;
        this.menuList = options.menuList;
        this.direction = options.direction || "y";
        this.dropDownWidth = options.dropDownWidth;
        this.colWidth = options.colWidth;
        this.curCity = options.curCity;
        this.init = function(){
            this.createDom();
            this.initStyle();
            this.bindEvent();
        }
    }

    DropDown.prototype.createDom = function(){
        var $oDiv = $("<div class='my-dropDown'></div>");
        this.menuList.forEach(function(menu){
            var $oDl = $("<dl></dl>");
            if(menu.title){
                $("<dt>"+menu.title+"</dt>").appendTo($oDl)
            } 
            menu.items.forEach(function(item){
                if(item.iconUrl){
                    $("<dd><svg class='icon' aria-hidden='true'><use xlink:href='#"+item.iconUrl+"'></use></svg><a href="+item.href+">"+item.name+"</a></dd>").appendTo($oDl);
                }else{
                    if(this.curCity == item.name){
                        $("<dd><a class='active' href="+item.href+">"+item.name+"</a></dd>").appendTo($oDl); 
                    }else{
                        $("<dd><a href="+item.href+">"+item.name+"</a></dd>").appendTo($oDl); 
                    }
                }
            })
            if(menu.menuWidth){
                $oDl.css({
                    width:menu.menuWidth
                })
            }
            if(menu.colWidth){
                $oDl.find("dd").css({
                    width:menu.colWidth
                })
            }
            //某一块列表为城市的时候，添加class
            if(menu.dropDownType){
                $oDiv.addClass("locDropDown");
                $oDl.find("dd").find("a").addClass("cityLink");
            }
            $oDl.appendTo($oDiv);

        });

        $(this.father).append($oDiv);
    }

    DropDown.prototype.initStyle = function(){
        $(this.father).css({
            position:"relative",
        })
        $(".my-dropDown",this.father).css({
            width:this.dropDownWidth,
            position:"absolute",
            left:-1,
            backgroundColor:"#fff",
            border: "1px solid #ccc",
            borderTop:"none",
            display:"none",
            zIndex:1
        }).find("dl").css({
            padding: "10px 0 10px 15px",
            overflow: "hidden",
            borderBottom:"1px solid #f1f1f1",
            float:"left",
            borderLeft:"1px solid #eee"
        }).end().find("dd").css({
            width:this.colWidth,
            float:"left",
            whiteSpace: "nowrap"
        }).end().find("dt").css({
            fontWeight:"bold",
            color:"#666"
        });
        //排列方向为横向的时候
        if(this.direction == "x"){
            $(".my-dropDown",this.father).css({
                left:"auto",
                right:-70,
                padding:"15px 0"
            }).find("dl").css({
                padding:"0 0 0 15px",
                borderBottom:"none",
                borderLeft:"1px solid #eee"
            })
        }
        //位置下拉列表特殊处理      
        $(".locDropDown",this.father).css({
            padding:"10px",
        }).find("dl").css({
            padding:0,
            borderLeft:"none",
            borderBottom:"dotted 1px #eee",
        }).find("a").css({
            padding:"3px 8px"
        }).end().find("dt").css({
            fontWeight:"normal",
            width:this.dropDownWidth
        })
          
        //当前城市特殊样式
        $("a.active",this.father).css({
            backgroundColor:"#f10215",
            color:"#fff"
        })
    }

    DropDown.prototype.bindEvent = function(){
        //鼠标放在列表目录上，出现下拉框
        $(this.father).hover(function(){
            $(this).css({
                borderBottom:"1px solid #fff",
                borderLeft:"1px solid #ccc",
                borderRight:"1px solid #ccc",
                backgroundColor:"#fff",
            }).find(".my-dropDown").show();
        },function(){
            $(this).css({
                borderBottom:"1px solid transparent",
                borderLeft:"1px solid transparent",
                borderRight:"1px solid transparent",
                backgroundColor:"transparent",
            }).find(".my-dropDown").hide();
        });
        //a标签hover特效
        $(this.father).find("a").hover(function(){
            this.color = $(this).css("color");
            $(this).css({
                color:"#e33333",
            })
        },function(){
            $(this).css({
                color:this.color,
            })
        });
        //城市a标签hover特殊效果,排除当前城市的hover效果
        $("a.cityLink", this.father).hover(function(){
            if(!$(this).hasClass("active")){
                this.color = $(this).css("color");
                this.backgroundColor = $(this).css("backgroundColor");
                $(this).css({
                    backgroundColor:"#f4f4f4",
                    color:"#e33333"
                })
            }else{
                $(this).css({
                    backgroundColor:"#f10215",
                    color:"#fff"
                })
            }
        },function(){
            if(!$(this).hasClass("active")){
                $(this).css({
                    backgroundColor:this.backgroundColor,
                    color:"#999"
                })
            }else{
                $(this).css({
                    backgroundColor:"#f10215",
                    color:"#fff"
                })
            }
            
        })
        

        //点击某个城市，更新当前的城市
        $("a.cityLink", this.father).click(function(){
            $(this).parent().parent("dl").find(".cityLink").css({
                backgroundColor:"#fff",
                color:"#999"
            }).removeClass("active")
            $(this).css({
                backgroundColor:"#f10215",
                color:"#fff"
            }).addClass("active");
            // $(this.father).prev().text($(this).text())
            $(this).parents(".locDropDown").prev().text($(this).text())
        })
    }

    $.fn.extend({
        addDropDown:function(options){
            options.father = this;
            var obj = new DropDown(options);
            obj.init();
        }
    })
}())