/*game 2048*/
//事件处理对象
var EventUtil={
    //添加事件
    addHandler:function(element,type,handler){
      if(element.addEventListener){
        element.addEventListener(type,handler,false);
      }else if(element.attachEvent){
        element.attachEvent("on"+type,handler);
      }else{
        element["on"+type]=handler;
      }
    },
    //获取事件对象
    getEvent:function(event){
      return event?event:window.event;//兼容ie
    }
  }
  function Game(tileContainer,scoreEle,bestScoreEle){
    this.tileContainer=tileContainer;
    this.scoreEle=scoreEle;
    this.bestScoreEle=bestScoreEle;
    this.tiles=new Array(4);//创建存方块数值与dom对象的数组
  }
  Game.prototype={
    //初始化游戏
    init:function(){
      this.posArray=[];//创建存空白方块坐标的数组
      for(var i=0,len=this.tiles.length;i<len;i++){
        this.tiles[i]=[];
        for(var j=0;j<len;j++){
          this.tiles[i][j]={num:0}; //初始化存方块数值与dom对象的数组
          this.posArray.push({"x":i,"y":j});//初始化存方块坐标的数组
        }
      }
      this.deleteTile(true);//清空全部方块
      this.score=0;//初始化分数
      this.bestScore=this.bestScore||0;//初始化最佳分数，第一次为0
      this.newTile();//随机创建一个方块
      this.newTile();
    },
    //创建一个方块
    newTile:function(){
      var tile=document.createElement("div"),
          pos=this.randomPos(),//随机新方块位置
          num=Math.random()<0.9?2:4;//随机新方块数值2或4
      this.tiles[pos.x][pos.y]={num:num,tile:tile};//将新方块的数值与dom对象存入数组
      this.setTile(tile,num,pos.x,pos.y);//设置方块属性产生移动与淡入效果
      this.tileContainer.appendChild(tile);
    },
    //设置方块class和显示的数字，
    setTile:function(element,num,x,y){
      element.innerHTML=num;
      element.className="tile tile-"+num+" tile-pos-"+x+"-"+y;
    },
    //随机一方块的位置
    randomPos:function(){
      var index=Math.floor(Math.random()*this.posArray.length);
      var pos=this.posArray[index];
      this.posArray.splice(index,1);//将新方块的位置从存空白坐标的数组中删除
      return pos;
    },
    //方块移动处理
    moveTile:function(keyCode){
      var len=this.tiles.length,
          merge;//存合并状态
      switch(keyCode){
        //左移
        case 37:
          for(var i=1;i<len;i++){
            for(var j=0;j<len;j++){
              if(this.tiles[i][j].num!=0&&this.leftMove(i,j)){//值不为0且可移动
                merge=this.merge(i,j);//合并
              }
            }
          }
          break;
        //右移
        case 39:
          for(var i=len-2;i>=0;i--){
            for(var j=0;j<len;j++){
              if(this.tiles[i][j].num!=0&&this.rightMove(i,j)){
                merge=this.merge(i,j);
              }
            }
          }
          break;
        //上移
        case 38:
          for(var i=0;i<len;i++){
            for(var j=1;j<len;j++){
              if(this.tiles[i][j].num!=0&&this.upMove(i,j)){
                merge=this.merge(i,j);
              }
            }
          }
          break;
        //下移
        case 40:
          for(var i=0;i<len;i++){
            for(var j=len-2;j>=0;j--){
              if(this.tiles[i][j].num!=0&&this.downMove(i,j)){
                merge=this.merge(i,j);
              }
            }
          }
          break;
      }
      if(merge){
        this.newTile();//合并之后创建一个方块  
      }else if(this.posArray.length==0&&this.gameOverTest()){//当存空白位置的数组为空且没有一个方向可移动，游戏结束
        this.gameOver();
      }
    },
    //方块左移动
    leftMove:function(i,j){
      this.num=this.tiles[i][j].num;
      this.moveI=undefined;
      this.moveJ=undefined;
      for(var n=i-1;n>=0;n--){
        if(this.tiles[n][j].num==0){
          this.moveI=n;
        }else if(this.tiles[n][j].num==this.num){
          this.num*=2;
          this.moveI=n;
          if(this.num==2048){
            this.gameWin();
          }
          this.getScore(this.num);
          break;
        }else{
          break;
        }
      }
      this.moveJ=j;
      if(!(this.moveI+1)||!(this.moveJ+1)){
        return;
      }
      return true;
    },
    //方块右移动
    rightMove:function(i,j){
      var len=this.tiles.length;
      this.num=this.tiles[i][j].num;
      this.moveI=undefined;
      this.moveJ=undefined;
      for(var n=i+1;n<len;n++){
        if(this.tiles[n][j].num==0){
          this.moveI=n;
        }else if(this.tiles[n][j].num==this.num){
          this.num*=2;
          this.moveI=n;
          if(this.num==2048){
            this.gameWin();
          }
          this.getScore(this.num);
          break;
        }else{
          break;
        }
      }
      this.moveJ=j;
      if(!(this.moveI+1)||!(this.moveJ+1)){
        return;
      }
      return true;
    },
    //方块上移动
    upMove:function(i,j){
      this.num=this.tiles[i][j].num;
      this.moveI=undefined;
      this.moveJ=undefined;
      for(var n=j-1;n>=0;n--){
        if(this.tiles[i][n].num==0){
          this.moveJ=n;
        }else if(this.tiles[i][n].num==this.num){
          this.moveJ=n;
          this.num*=2;
          if(this.num==2048){
            this.gameWin();
          }
          this.getScore(this.num);
          break;
        }else{
          break;
        }
      }
      this.moveI=i;
      if(!(this.moveI+1)||!(this.moveJ+1)){
        return;
      }
      return true;
    },
    //方块下移动
    downMove:function(i,j){
      var len=this.tiles.length;
      this.num=this.tiles[i][j].num;
      this.moveI=undefined;
      this.moveJ=undefined;
      for(var n=j+1;n<len;n++){
        if(this.tiles[i][n].num==0){
          this.moveJ=n;
        }else if(this.tiles[i][n].num==this.num){
          this.moveJ=n;
          this.num*=2;
          if(this.num==2048){
            this.gameWin();
          }
          this.getScore(this.num);
          break;
        }else{
          break;
        }
      }
      this.moveI=i;
      if(!(this.moveI+1)||!(this.moveJ+1)){
        return;
      }
      return true;
    },
    //合并方块
    merge:function(i,j){
      var me=this;
      if(this.num>this.tiles[i][j].num){
        //this.num的值变化，即遇到相同值的方块，可移动到其位置，只需删除被覆盖的方块
        this.deleteTile(false,this.tiles[this.moveI][this.moveJ].tile);
        //将移到相同值的方块的位置上的方块的原始位置添加到存空白坐标的数组中
        this.posArray.push({x:i,y:j});
      }else if(this.num==this.tiles[i][j].num){
        //值未变化，即遇到空白方块。只需将空白数组中该空白方块的坐标改为移动的方块的原始坐标
        this.posArray.forEach(function(item){
          if(item.x==me.moveI&&item.y==me.moveJ){
            item.x=i;
            item.y=j;
          }
        });
      }
      //设置将移动的方块的属性，产生移动效果
      this.setTile(this.tiles[i][j].tile,this.num,this.moveI,this.moveJ);
      //在存方块数值与dom对象的数组中将移动的方块的值设为空白值(即num：0)，被覆盖的方块的值设为将移动的方块的值
      this.tiles[this.moveI][this.moveJ]={num:this.num,tile:this.tiles[i][j].tile};
      this.tiles[i][j]={num:0};
      return true;
    },
    //删除dom节点
    deleteTile:function(all,tile){
      if(all){
        this.tileContainer.innerHTML="";//清空所有
      }else{
        this.tileContainer.removeChild(tile);//删除单个
      }
    },
    //得分计算
    getScore:function(score){
      this.score+=score;
      this.scoreEle.innerHTML=this.score;
      if(this.score>this.bestScore){
        this.bestScore=this.score//当前分数大于最佳分数，覆盖最佳分数
        this.bestScoreEle.innerHTML=this.bestScore;
      }
    },
    //当出现2048即win，可继续挑战
    gameWin:function(){
      var me=this;
          win=document.createElement("div"),
          continueBtn=document.createElement("button");
      continueBtn.className="game-win-again";
      win.className="game-win";
      win.appendChild(continueBtn);
      this.tileContainer.appendChild(win);
      EventUtil.addHandler(continueBtn,"click",function(){
        me.deleteTile(false,win);
      });
    },
    //游戏结束测试
    gameOverTest:function(){
      var len=this.tiles.length;
      for(var i=0;i<len;i++){
        for(var j=0;j<len;j++){
          if(this.leftMove(i,j)||this.rightMove(i,j)||this.upMove(i,j)||this.downMove(i,j)){
            return;//只要有一个方向可移动即退出
          }
        }
      }
      return true;//没有一个方向可移动即游戏结束
    },
    //游戏结束消息
    gameOver:function(){
      var message=document.createElement("div");
      message.className="game-over";
      this.tileContainer.appendChild(message);
    },
    //添加事件处理程序
    initEvent:function(){
      var me=this;
      //添加键盘弹起事件，限制一直按下重复触发
      EventUtil.addHandler(window,"keyup",function(event){
        me.moveTile(EventUtil.getEvent(event).keyCode);
      });
    },
    //用于移动端，判断toustart的开始坐标是否在游戏区域gameContainer内
    touchPosTest:function(startX,startY){
      var container=document.getElementById("container"),
      gameContainer=document.getElementById("game-container");
      //container与gameContainer宽度一致，即gameContainer的offsetLeft是其已定位父元素container的offsetLeft
      var gameContainerStartX=container.offsetLeft,
          gameContainerStartY=container.offsetTop+gameContainer.offsetTop,
          gameContainerEndX=gameContainerStartX+gameContainer.offsetWidth,
          gameContainerEndY=gameContainerStartY+gameContainer.offsetHeight;
      return (startX>=gameContainerStartX&&startX<=gameContainerEndX)&&(startY>=gameContainerStartY&&startY<=gameContainerEndY)?true:false;
    },
    //移动端滑动
    slidMove:function(startX,startY,endX,endY){
      var dx=endX-startX,
          dy=endY-startY;
      var deg=Math.atan2(dy,dx)*180/Math.PI;//反正切值求滑动角度
      if(deg>=-45&&deg<=45){//右
        this.moveTile(39);
      }else if(deg<135&&deg>45){//下
        this.moveTile(40);
      }else if((deg>=135&&deg<=180)||(deg<=-135&&deg>=-180)){//左
        this.moveTile(37);
      }else if(deg>-135&&deg<-45){//上
        this.moveTile(38);
      }
    },
  };
  window.onload=function(){
    var btn=document.getElementById("newGame"),
        tileContainer=document.getElementById("tile-container"),
        scoreEle=document.getElementById("game-score"),
        bestScoreEle=document.getElementById("game-best-score"),
        startX,startY,endX,endY;
    var game=game||new Game(tileContainer,scoreEle,bestScoreEle);
    game.initEvent();//初始化事件处理
    game.init();//初始化游戏
    EventUtil.addHandler(btn,"click",function(){
      game.init();//newgame按钮被点击，初始化游戏，最佳分数保留直至刷新页面
    });
  　//移动端触摸开始事件
    EventUtil.addHandler(document,"touchstart",function(event){
      event.preventDefault();
      startX=event.touches[0].clientX;
      startY=event.touches[0].clientY;
    });
    //移动端触摸滑动事件
    EventUtil.addHandler(document,"touchend",function(event){
      event.preventDefault();
      endX=event.changedTouches[0].clientX;
      endY=event.changedTouches[0].clientY;
      //只有toustart的开始坐标在游戏区域gameContainer内才出发方块四个方向滑动
      if(game.touchPosTest(startX,startY)){
        game.slidMove(startX,startY,endX,endY);
      }
    });
  }