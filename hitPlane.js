// 获取开始界面和主界面
var mainDiv = document.getElementById('mainDiv');
var startDiv =document.getElementById('startDiv');

// 获取显示分数界面
var scoreDiv = document.getElementById('scorediv');
var scoreLabel = document.getElementById('label');
var enddiv = document.getElementById('enddiv');
var planscore = document.getElementById('planscore');


var tid; //定时器
var backgroundPositionY = 0;//背景移动的距离
var time1 = 0;
var time2 = 0;
var enemys = []; //敌方飞机的数组
var bullets = [];//子弹数组

var scores = 0;//初始化的分数
function jixu(){
	location.reload(true);
}

function begin(){ 
	 startDiv.style.display = "none"; //隐藏开始界面
	 mainDiv.style.display = "block"; //显示主界面

    // 定时器的创建
    tid = setInterval(start,30);

}
// 定时器调用的函数
function start(){

	// 1 背景移动
	mainDiv.style.backgroundPositionY = backgroundPositionY+'px';
	backgroundPositionY+=2;

	// 2  创建敌方飞机
	time1++;
	if (time1==20) { //0.6s
		// 创建飞机
		time2++;
		if (time2%5 == 0) { //3s
			// 创建中型飞机
			var midEnemy = new Enemy(25,286,'image/enemy3_fly_1.png',3,"image/中飞机爆炸.gif",46,60,360,6,5000);
            enemys.push(midEnemy);
			if (time2 == 20) { //12s

				// 创建大型飞机
             enemys.push(new Enemy(57,216,'image/enemy2_fly_1.png',2,"image/大飞机爆炸.gif",110,114,540,12,30000));   

				time2 ==0;
			}

		}else{
			// 创建小型小飞机
            enemys.push(new Enemy(19,286,'image/enemy1_fly_1.png',4,"image/小飞机爆炸.gif",34,24,360,1,1000));   
		}

     time1 =0;
	}

	// 移动敌方飞机
	for (var i = 0; i < enemys.length; i++) {
		var enemy =  enemys[i];
		enemy.planeMove();
  
       //飞机超出界面
       if (enemys[i].imageNode.offsetTop>568) {
        
        // 在主界面删除对应节点
       	mainDiv.removeChild(enemys[i].imageNode);
       	enemys.splice(i,1);//从飞机数组中移除对应元素

       } 
       // 飞机判定死亡
       if (enemys[i].isdie == true) {
        // 需要经过一段时间后，再清除敌机
        enemys[i].planedietimes+=20;  //
          if (enemys[i].planedietimes>=enemys[i].planedietime) {

          	mainDiv.removeChild(enemys[i].imageNode);
	       	enemys.splice(i,1);//从飞机数组中移除对应元素
          }


       	  	

       }




	}

	// 3 创建子弹
	if (time1%5 ==0) {  //.15s
		// 创建子弹
		// 30 ：我方飞机宽度的一半
		var bullet = new Bullet(ourPlane.imageNode.offsetLeft+30,
			ourPlane.imageNode.offsetTop-10,"image/bullet1.png");
        bullets.push(bullet);
	}

	// 移动子弹
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].bulletMove();

	}

	// 4 碰撞判断
	for (var k = 0;k<bullets.length;k++){
		// k = 0, b1 b2 b3
		for (var j = 0;j<enemys.length;j++){
               // 子弹和飞机的碰撞判断
               if((bullets[k].bulletImageNode.offsetLeft+6>enemys[j].imageNode.offsetLeft)&&(bullets[k].bulletImageNode.offsetLeft<enemys[j].imageNode.offsetLeft+enemys[j].planeWidth)){
						if(bullets[k].bulletImageNode.offsetTop<=enemys[j].imageNode.offsetTop+enemys[j].planeHeight&&bullets[k].bulletImageNode.offsetTop+14>=enemys[j].imageNode.offsetTop){
						 


						 //敌方飞机的血量减去子弹的攻击力
						 enemys[j].planehp = enemys[j].planehp-1;
                          //当敌机的血量为0时，敌机才爆炸
						 if (enemys[j].planehp == 0) {

                             // 0 敌方飞机的图片改成爆炸的图片
						     enemys[j].imageNode.src = enemys[j].boomSrc;

						      //1 删除敌方飞机
						      enemys[j].isdie = true;

                                // 计分

						      scores = scores+enemys[j].planescore;
						      scoreLabel.innerHTML = scores;

						 }


                         //2 删除子弹
                         mainDiv.removeChild(bullets[k].bulletImageNode);
                         bullets.splice(k,1);
					    }

                }




                // 判断本方飞机的碰撞(敌方飞机和我方飞机的)
                	if (enemys[j].isdie == false) {
						if (enemys[j].imageNode.offsetLeft+enemys[j].planeWidth>=ourPlane.imageNode.offsetLeft&&
							enemys[j].imageNode.offsetLeft<=ourPlane.imageNode.offsetLeft+ourPlane.planeWidth) {
							if (enemys[j].imageNode.offsetTop+enemys[j].planeHeight>=ourPlane.imageNode.offsetTop+40&&
								enemys[j].imageNode.offsetTop<=ourPlane.imageNode.offsetTop-20+ourPlane.planeHeight) {


								// 碰撞本飞机
							    ourPlane.imageNode.src = "image/本方飞机爆炸.gif";
							    clearInterval(tid); //停止定时器
							    mainDiv.removeEventListener("mousemove",move,true);
                                
                                // 结束界面，并且统计分数
                                enddiv.style.display = "block";
                                planescore.innerHTML = scores;

							}
						}
					}



		}


	}

}

// ------------------构造函数----------------
// （1） 飞机的构造函数
function Plane(x,y,imageSrc,speed,boomSrc,width,height,dietime,hp,score){ //speed:下落的速度

// hp:飞机的血量   score：打爆飞机的得分
	this.x = x;
	this.y = y;
	this.imageSrc = imageSrc;
	this.speed = speed;
	this.boomSrc = boomSrc;
	this.planeWidth = width;
	this.planeHeight = height;
    this.isdie = false;
    this.planedietime = dietime;//该飞机的死亡持续时间
    this.planedietimes = 0;//累计时间

    this.planehp = hp;
    this.planescore = score;

	this.imageNode = null;
	this.init = function(){ //创建节点
		this.imageNode = document.createElement('img');
		this.imageNode.style.position = "absolute";
		this.imageNode.style.top = this.y+'px';
		this.imageNode.style.left =this.x+'px';
		this.imageNode.src  =imageSrc;
		mainDiv.appendChild(this.imageNode); //将节点添加到mainDiv

	}

	this.init();

	// 飞机移动的方法
	this.planeMove = function(){
        // this.imageNode.style.top--->XXX px
        // this.imageNode.offsetTop ===>XXX

		this.imageNode.style.top = this.imageNode.offsetTop+this.speed+'px';

	}

}

//（2）  构造自己的飞机 函数
function OurPlane(x,y){
   
   // f.call(o,a,b); 对象o调用函数f,函数f的实参是a,b
	Plane.call(this,x,y,"image/我的飞机.gif",0,"image/本方飞机爆炸.gif",66,80,660,1,0);


}

// （3）构造敌方飞机的函数
function Enemy(a,b,imageSrc,speed,boomSrc,width,height,dietime,hp,score){  //a b：x轴方向的取值范围

	Plane.call(this,random(a,b),100,imageSrc,speed,boomSrc,width,height,dietime,hp,score);
}

// 返回min~max之间的一个随机数
function random(min,max){
	return Math.floor((min+Math.random()*(max-min))); 
}

// 返回一个100~300的随机数
 // 100+随机数*（300-100）；

// 子弹的构造函数
function Bullet(x,y,imageSrc){ //speed:下落的速度
// bulletImageNode
	this.x = x;
	this.y = y;
	this.bulletImageSrc = imageSrc;
	this.bulletImageNode = null;
	this.init = function(){ //创建节点
		this.bulletImageNode = document.createElement('img');
		this.bulletImageNode.style.position = "absolute";
		this.bulletImageNode.style.top = this.y+'px';
		this.bulletImageNode.style.left =this.x+'px';
		this.bulletImageNode.src  =imageSrc;
		mainDiv.appendChild(this.bulletImageNode); //将节点添加到mainDiv

	}

	this.init();

	// 子弹移动的方法
	this.bulletMove = function(){
        // this.imageNode.style.top--->XXX px
        // this.imageNode.offsetTop ===>XXX

		this.bulletImageNode.style.top = this.bulletImageNode.offsetTop-20+'px';

	}

}





 var move = function(){
 	//飞机随着鼠标的坐标而移动
 	var oevent =window.event||arguments[0];//兼容（IE）
 	var selfPlanX =oevent.clientX-300;
 	var selfPlanY =oevent.clientY;

    ourPlane.imageNode.style.left = selfPlanX - 33+'px';
    ourPlane.imageNode.style.top= selfPlanY -40 +'px';

 }

// 给主界面添加鼠标事件
mainDiv.addEventListener("mousemove",move,true);

// ------------------对象----------------

// 创建自己的飞机对象
var ourPlane =new OurPlane(120,485); 


