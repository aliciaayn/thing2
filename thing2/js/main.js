
var isHardPause = false; 
function hardPause() { // when the user clicks away from the canvas or clicks "p"
	if (!isHardPause) // if it's already paused, don't draw)
	{
		var ctx = myWorld.context;
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		ctx.fillRect(5, 5, myWorld.canvas.width -10, myWorld.canvas.height-10);
		ctx.textAlign="center";
		ctx.font="100px Arial"; 
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillText("paused",  myWorld.canvas.width/2,  myWorld.canvas.height/2, myWorld.canvas.width-20);
	}
	isHardPause=true;
}
function unHardPause() {
	isHardPause=false;
}
 
function startSplash() { // when the user clicks away from the canvas or clicks "p"

	var ctx = myWorld.context;
	ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
	ctx.fillRect(5, 5, myWorld.canvas.width -10, myWorld.canvas.height-10);
	
	ctx.fillStyle = "rgba(0, 255, 0, .9)";
	ctx.textAlign="left";
	ctx.font="30px Courier New"; 
	ctx.fillText("math_monsters --h",  30, 100, myWorld.canvas.width-20);
	ctx.fillText(" - hack the mainframe",  30, 150, myWorld.canvas.width-20);
	ctx.fillText(" - don't get DESTROYED",  30, 200, myWorld.canvas.width-20);
	ctx.fillText("_click to begin",  30, 300, myWorld.canvas.width-20);

	
	

	isHardPause=true;
}

function startThing() {
	myWorld.init();
	startSplash();

	messageQueue.addMessage( new message("hello world", 3000));
	myWorld.start(); 
	
	
	myChalkboard = new chalkboard();
	
	img = new Image();
    img.src = "./img/robot_sprite_3.png";
	myHero = new hero();
	myHero.img = img;
	
	
	
	myMainframe= new mainframe();
	
	myWorld.addObject(myMainframe);
	
	spookyMonster = new monster();
	myWorld.addObject(spookyMonster);
	
	myWorld.addObject(myHero);
	
	ground = new object(true, true, 0, myWorld.canvas.height-10,myWorld.canvas.width,10);
	ground.color="rgba(0,0,0,0)";
	myWorld.addObject(ground);
	
	
	
}



var myWorld = {
	canvas : document.createElement("canvas"), 
	init: function() {
		this.canvas.width = 600;
		this.canvas.height = 400;
		this.canvas.setAttribute("tabindex", 0);
		this.context = this.canvas.getContext("2d");
		this.canvas.addEventListener("blur", hardPause);
		this.canvas.addEventListener("focus", unHardPause);
		this.canvas.addEventListener('keydown', function(e) {canvas_keydown(e);});
		this.canvas.addEventListener('keyup', function(e) {canvas_keyup(e);});
		//this.canvas.addEventListener("keydown", keydown(event), true);
		this.backgroundArray=new Array();
		
		this.backgroundArray.push("./img/server_room.png");
		this.backgroundArray.push("./img/server_room2.png");
		
		this.backgroundArrayIndex=0;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]); 
		this.fps = 120;
		this.mspf = 1000/this.fps;
		//this.interval = setInterval(updateWorld, this.mspf); //20ms per frame.. i.e. 50 fps
		this.background_counter=0;
	},
	start : function () {
		updateWorld();
		
	},
	clear : function() {
		this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
	},
	forceOfGravity : 620, 
	objects : [], // filled with references to world objects
	updateObjects : function(dt) {
	
			
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].vy =this.objects[i].vy + this.forceOfGravity * dt/1000;
			
			
		
	 		for (var j = i+1 ; j < this.objects.length; j++) 
			{
				//if (i==j) continue;
				if (isCollision(this.objects[i], this.objects[j])) {
						if ((this.objects[i]==myHero || this.objects[j]==myHero) && myHero.vy<0){}else{
							this.objects[i].vy=(-this.objects[i].bounce)*this.objects[i].vy;
							this.objects[j].vy=(-this.objects[i].bounce)*this.objects[j].vy;
						}
				}
				
				if (Math.abs(this.objects[i].vy)<10) this.objects[i].vy = 0;
				
			}
			
			
			
			this.objects[i].update(dt);
			
			
			
		}
	},
	
	drawObjects : function(dt) {
		//this.updateBackgroundImg(dt);
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].draw(this.context);

		}
	},
	addObject(objExt /* anything that extends the (custom) object class */) 
	{
		this.objects.push(objExt);
	}/*,
	
	updateBackgroundImg : function(dt) {
		this.background_counter+=dt;
		
		
		if (this.background_counter>(1000/6)) {
			//change 6 times a second
			var myimg = new Image();
			myimg.src=this.backgroundArray[this.backgroundArrayIndex];
			
			myimg.onload=function(){
			myWorld.context.drawImage(myimg,myWorld.canvas.width, myWorld.canvas.height);
			}
			
			
			if (this.backgroundArrayIndex==this.backgroundArray.length-1) {
				
				this.backgroundArrayIndex=0;
			}
			else {
				this.backgroundArrayIndex++;
			}
		}
	}*/
}


class chalkboard {
	constructor() {
		this.q_txt="1 + 1 = ";
		this.a_txt="";
		this.a_val=2;
	}
	
	generateQuestion() {
		var a = Math.floor(Math.random()*10);
		var b = Math.floor(Math.random()*10);
		this.q_txt = a.toString() +" + " + b.toString() + " = ";
		this.a_txt="";
		this.a_val = a+b;
	}

	draw() {
		var ctx = myWorld.context;
		ctx.fillStyle = "darkslategrey";
		ctx.fillRect(5, 5, 200, 40);

		ctx.font = "30px Comic Sans MS";
		ctx.fillStyle = "limegreen";
		ctx.textAlign = "left";

		ctx.fillText(this.q_txt + this.a_txt, 10, 35, 180); 

		//ctx.fillText(this.text, 480,this.y + this.boxHeight - 5); 
	}
}

function message(text, displayMs)  {
	// message to add to upright queue
	this.text = text;
	
	
	this.displayMs = displayMs;
	this.displayedMs = 0; // number of seconds displayed so far; 
	var ctx = myWorld.context;
	ctx.font = "12px Arial";
	ctx.fillStyle = "DarkSlateGray";
	ctx.textAlign = "left";
	var h = 16; // 12px font + 2px padding
	
	var words = this.text.split(' ');
	var line = '';
	var lines = [];
	var linesCnt = 0;
	
	for (var i = 0; i<words.length; i++) {
		var testLine = line + words [i] +' ';
		var metrics = ctx.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > 100 && i>0) {
			lines[linesCnt] = line;
			linesCnt++;
			line = words[i] + ' ';
		}
		else {
			line = testLine;
		}
	}
	lines[linesCnt]=line;
	linesCnt++;
	
	this.boxHeight = h*linesCnt + 10; // 5 padding on either side
	
	
	
	//this.boxHeight = h*lines + 10;

	this.x = myWorld.canvas.width -100-30;
	this.y = 20;

	this.draw = function(startBoxHeight) {
				
		ctx.fillStyle = "lightgray";
		ctx.fillRect(this.x-10, startBoxHeight, 100+20, this.boxHeight);

		ctx.font = "12px Arial";
		ctx.fillStyle = "DarkSlateGray";
		ctx.textAlign = "left";
		for (var i=0; i<linesCnt; i++) {
			ctx.fillText(lines[i], this.x,startBoxHeight +  10 + i*h  + h/2); 
		}
		//ctx.fillText(this.text, 480,this.y + this.boxHeight - 5); 
	}
	
}

var messageQueue = {
	queue : [],
	addMessage: function(msg) {
		this.queue.push(msg);
	},
	update : function(dt) {
		// dt is ms since last called
		// for message in message queue
		// pop expired messages amd move up
		var startBoxHeight = 20; 
		var toSplice = [];
		for (var i = 0; i<this.queue.length; i++) // backwards because of splicing
		{
			this.queue[i].displayedMs+=dt; 
			if (this.queue[i].displayedMs >=this.queue[i].displayMs) {
				// splice it later
				toSplice.push(i);
				//
			}
			else {
				if (this.queue[i].displayMs - this.queue[i].displayedMs <1000) {
					this.queue[i].x += 20;
				}
				
				this.queue[i].draw(startBoxHeight);
				startBoxHeight += (this.queue[i].boxHeight +10);
			}
		}
		
		for (var i = toSplice.length - 1; i>=0; i--){
			this.queue.splice(toSplice[i],1);
		}
	}
}








var keyState = {};

function canvas_keyup(event) {
	keyState[event.keyCode || event.which] = false;
	console.log(event.keyCode.toString());
    if (event.keyCode == 80) {
		if (isHardPause) unHardPause();
		else hardPause();
	}
	else if	(event.keyCode == 96 || event.keyCode==48) {
		myChalkboard.a_txt = myChalkboard.a_txt + "0";
	}
	else if	(event.keyCode == 97 || event.keyCode==49) {
		myChalkboard.a_txt = myChalkboard.a_txt +"1";
	}
	else if	(event.keyCode == 98 || event.keyCode==50) {
		myChalkboard.a_txt = myChalkboard.a_txt + "2";
	}
	else if	(event.keyCode == 99 || event.keyCode==51) {
		myChalkboard.a_txt = myChalkboard.a_txt +"3";
	}
	else if	(event.keyCode == 100 || event.keyCode==52) {
		myChalkboard.a_txt = myChalkboard.a_txt + "4";
	}
	else if	(event.keyCode == 101 || event.keyCode==53) {
		myChalkboard.a_txt = myChalkboard.a_txt + "5";
	}
	else if	(event.keyCode == 102 || event.keyCode==54) {
		myChalkboard.a_txt = myChalkboard.a_txt + "6";
	}
	else if	(event.keyCode == 103 || event.keyCode==55) {
		myChalkboard.a_txt = myChalkboard.a_txt + "7";
	}
	else if	(event.keyCode == 104 || event.keyCode==56) {
		myChalkboard.a_txt = myChalkboard.a_txt + "8";
	}
	else if	(event.keyCode == 105 || event.keyCode==57) {
		myChalkboard.a_txt = myChalkboard.a_txt + "9";
	}
	else if	(event.keyCode == 8) {
		messageQueue.addMessage(new message("nope >:)", 3000));
	}
	else if (event.keyCode==13) {
		if (parseInt(myChalkboard.a_txt) == myChalkboard.a_val) {
			//attack!
			myChalkboard.generateQuestion();
			//myHero.stand();
			//myHero.kick();
			myHero.punch(myHero.direction);
			if (isCollision(myHero, spookyMonster) && spookyMonster.currentAction != spookyMonster.getAction("dead")) {
				//spookyMonster.takeDamage(3);
				myHero.comboCounter++;
				if(myHero.comboCounter>10){
					messageQueue.addMessage(new message("10 IN A ROW!! SUPER PUNCH!!!!!", 2000));
					spookyMonster.takeDamage(10);
				} 
				else if(myHero.comboCounter>3){
					spookyMonster.takeDamage(3);
				} 
				else{
					spookyMonster.takeDamage(1);
				}
			}
			else if (isCollision(myHero, myMainframe) && spookyMonster.currentAction == spookyMonster.getAction("dead")) {
				//spookyMonster.takeDamage(3);
				console.log("hack");
			}
		}
		else {
			if (myChalkboard.a_txt=="") {
				messageQueue.addMessage(new message("Answer the math to attack!", 2000));
			} else {
				myChalkboard.generateQuestion();
				myHero.beParalyzed(myHero.direction);
				console.log("SDF");
				myHero.comboCounter=0;
				messageQueue.addMessage(new message("WRONG, you dumb dumb idiot!", 2000));
			}
		}
	}
	
	event.preventDefault();
}

function canvas_keydown(event) {
	keyState[event.keyCode || event.which] = true;
	// see handlePressedKeys
	
	event.preventDefault();
	
}





var time;
var collisionCounter=0;
function updateWorld() {
	
	requestAnimationFrame(updateWorld);
	
	
	var now = new Date().getTime();
	dt = now-(time || now);
	time = now;
	

		
	if (!isHardPause) {

		myWorld.clear();
		//myWorld.updateBackgroundImg(dt);
		if (isCollision(spookyMonster,myHero) && spookyMonster.currentAction!=spookyMonster.getAction("dead") && spookyMonster.currentAction!=spookyMonster.getAction("die")) {
			//var collisionCounter=collisionCounter || 0;
			collisionCounter+=dt;
			if (collisionCounter>=2000) {
				//myHero.isVisible=false;
				spookyMonster.bite();
				collisionCounter=0;
			} 
			if ( spookyMonster.currentAction==spookyMonster.getAction("bite")) {
				collisionCounter=0;
			}
		} else {
			collisionCounter=0;
		}
		myWorld.updateObjects(dt);
		myWorld.drawObjects(dt);
		messageQueue.update(dt);	
		myChalkboard.draw();
	}

}








/****** object *****/
class object {
	
	constructor (isFixed, isVisible, x, y, w, h) {
        this.isFixed = isFixed;
		this.isVisible = isVisible;
		this.x = x;
		this.y= y;
		this.w = w;
		this.h = h;
		this.vy=0;
		this.vx=0;
		this.bounce=1/2; //  0<=bounce<1.. the lower, the less bouncy
		
		this.color="darkSlateGrey";
		this.collisions=new Array();// indexes in the object array 
	}
	
	update(dt) {
		if (!this.isFixed) {
			this.x += this.vx * dt/1000;
			this.y += this.vy * dt/1000;
		}
	}
	
	draw() { 
		if (this.isVisible) {
			if (this.img) {
				myWorld.context.drawImage(this.img, this.x,this.y, this.w, this.h)
			}
			else {
				myWorld.context.fillStyle = this.color; 
				myWorld.context.fillRect(this.x, this.y, this.w, this.h);
			}
		}
	}
}

class lifeBar {
	constructor(life) {
		this.origLife=life;
		this.lifeLeft=life;
	}
	
	takeDamage(damage) {
		this.lifeLeft = this.lifeLeft-damage;
		if (this.lifeLeft<0) this.lifeLeft=0;
	}
	
	draw(x,y) {
		//bar is always 50x10
		myWorld.context.fillStyle  ="white";
		myWorld.context.fillRect(x, y, 50, 10);
		var lifeWidth = Math.floor(this.lifeLeft/this.origLife*46);

		if (lifeWidth > 23) {
			myWorld.context.fillStyle ="green";
		} else if (lifeWidth > 10) {
			myWorld.context.fillStyle ="yellow";
		} else {
			myWorld.context.fillStyle="red";
		}
		
		myWorld.context.fillRect(x+2, y+2, lifeWidth, 6);
	}
}


class monster extends object {
	constructor() {
		super(true, true, 335, myWorld.canvas.height-10-70, 50, 70);
		img = new Image();
		img.src = "./img/spooky_monster_2.png";
		this.img = img;
		this.life = 10;
		this.myLifeBar = new lifeBar(this.life);
		
		 
	   	this.iterate = false;
		this.ms_since_flip=0;
		
		this.actions=new Array();
		
		var standFrames = new Array() ;
		standFrames.push(new frame(80, 100, 300, 420));		
		standFrames.push(new frame(480, 100, 300, 420));		
		var stand = new action ("stand", standFrames, 8, false, true);
		this.currentAction = stand;
		this.currentFrame=stand.frames[0];
		/*var spitFrames = newArray();
		standFrames.push(new frame(1900, 1410, 300, 630));	
		var spit = new action ("spit", spitFrames, 8, true, false);*/
		
		var dieFrames = new Array() ;
		dieFrames.push(new frame(80, 100, 300, 420));		
		dieFrames.push(new frame(480, 100, 300, 420));
		dieFrames.push(new frame(80, 100, 300, 420));		
		dieFrames.push(new frame(480, 100, 300, 420));
		dieFrames.push(new frame(80, 100, 300, 420));		
		dieFrames.push(new frame(480, 100, 300, 420));
		dieFrames.push(new frame(80, 100, 300, 420));		
		dieFrames.push(new frame(480, 100, 300, 420));
		dieFrames.push(new frame(480, 1000, 300, 420));	
		dieFrames.push(new frame(880, 1000, 300, 420));	
		dieFrames.push(new frame(1280, 1000, 300, 420));
		dieFrames.push(new frame(1580, 1000, 300, 420));	
		var die = new action ("die", dieFrames, 8, true, true);
		
		var deadFrames = new Array() ;	
		deadFrames.push(new frame(1580, 1000, 300, 420));
		var dead = new action ("dead", deadFrames, 8, false, true);
		
		
		var biteFrames = new Array();
		biteFrames.push(new frame(860, 100, 300, 420));	
		biteFrames.push(new frame(2450, 60, 300, 420));
		biteFrames.push(new frame(2040, 100, 350, 420));
		biteFrames.push(new frame(1230, 100, 300, 420));
		biteFrames.push(new frame(1650, 80, 330, 460));
		biteFrames.push(new frame(860, 100, 300, 420));	
		biteFrames.push(new frame(80, 100, 300, 420));		
		biteFrames.push(new frame(480, 100, 300, 420));
		biteFrames.push(new frame(80, 100, 300, 420));	
		biteFrames.push(new frame(860, 100, 300, 420));	
		//biteFrames.push(new frame(1650, 80, 330, 460));
		biteFrames.push(new frame(1230, 100, 300, 420))
		//biteFrames.push(new frame(2040, 100, 350, 420));
		biteFrames.push(new frame(860, 100, 300, 420));	
		var bite = new action ("bite", biteFrames, 8, true, false);
		
		this.actions.push(stand);
		this.actions.push(die);
		this.actions.push(dead);
		this.actions.push(bite);
	}
	
	die() {
		if (this.currentAction==this.getAction("die")) {
			//continue dieing
			//if (this.currentFrame == this.currentAction.
			if (this.ms_since_flip > 1000/this.currentAction.fps) {
					this.currentFrame = this.currentAction.getNextFrame();
					if (!this.currentFrame) {
						this.currentAction=this.getAction("dead");
						this.currentFrame= this.currentAction.getFirstFrame();
					}
					this.ms_since_flip=0;
					
				if (this.currentAction.currentFrameIndex==10) {
					console.log("here");
					messageQueue.addMessage(new message("You defeated the SPOOKIEST MONSTER, all because of MATH!",3000));
					this.life=0;
				}
			}
			
			
			
		} else {
			this.currentAction = this.getAction("die");
			this.currentFrame= this.currentAction.getFirstFrame();
		}
	}
	
	bite() {
		//NEEDS ACCESS TO MYHERO
		// it would be aparameter, but the update() funciton needs it too... 
		if (this.currentAction==this.getAction("bite")){
			// continue biting
				if (this.ms_since_flip > 1000/this.currentAction.fps) {
				this.currentFrame = this.currentAction.getNextFrame();
				if (!this.currentFrame) {
					if (this.life<=0) {
						this.currentAction=this.getAction("dead");
						this.currentFrame = this.currentAction.getNextFrame();
					} else {
						//myHero.isVisible=true;
						this.currentAction=this.getAction("stand");
						this.currentFrame = this.currentAction.getNextFrame();
					}
					//this.stand(this.direction);
				} else if (this.currentAction.currentFrameIndex==11) {
					myHero.isVisible=true;
					myHero.takeDamage(10);
				} else if (this.currentAction.currentFrameIndex==2) {
					myHero.isVisible=false;
				}
				this.ms_since_flip=0;
			}
		} else {
			this.currentAction = this.getAction("bite");
			this.currentFrame=this.currentAction.getFirstFrame(); 	

			//myHero.isVisible=false;
			console.log(myHero);
		}
	}
	
	getAction(name) {
		for (var i=0; i<this.actions.length; i++) {
			if (this.actions[i].name==name) return this.actions[i]; 
		}
	}
	
	takeDamage(damage) {
		this.myLifeBar.takeDamage(damage);
		this.life = this.life-damage;
		if (this.life<=0) {
			//die
			
			this.die();
		}

	}
	
	update(dt) {
			this.last_x=this.x;
			this.last_y=this.y;
			
			super.update(dt);
			
			if (this.currentAction == this.getAction("bite")) {this.bite();} 
			else if (this.currentAction == this.getAction("die")){this.die();}
			else {
			
				if (this.ms_since_flip > 1000/this.currentAction.fps) {
					this.currentFrame = this.currentAction.getNextFrame();
					if (!this.currentFrame) {
						if (this.life<=0) {
							this.currentAction=this.getAction("dead");
							this.currentFrame = this.currentAction.getNextFrame();
						} else {
							this.currentAction=this.getAction("stand");
						}
						//this.stand(this.direction);
					}
					this.ms_since_flip=0;
				}
			
			}
			this.ms_since_flip += dt;
	}
	
	draw () {
		if (this.isVisible) {
			myWorld.context.drawImage(this.img, this.currentFrame.sx, this.currentFrame.sy, this.currentFrame.sw, this.currentFrame.sh, this.x, this.y, this.w, this.h);
			//myWorld.context.drawImage(this.img, this.x,this.y, this.w, this.h);
			this.myLifeBar.draw(this.x, this.y-12);
		}
	}
	
	
}

class mainframe extends object {
	constructor() {
		super(true, true, 400,  myWorld.canvas.height-10-250, 150,250);
		this.img = new Image();
		this.img.src = "./img/the_mainframe_2.png";
		
		this.actions=new Array();
		
		var frames = new Array() ;
		frames.push(new frame(5, 0, 720, 1025));	
		frames.push(new frame(685, 0, 720, 1025));	
		frames.push(new frame(1335, 0, 720, 1025));
		frames.push(new frame(3, 1026, 720, 1025));	
		frames.push(new frame(2015, 0, 720, 1025));
		frames.push(new frame(685, 1026, 720, 1025));	
		frames.push(new frame(1333, 1026, 720, 1025));
		frames.push(new frame(5, 0, 720, 1025));	
		frames.push(new frame(5, 0, 720, 1025));	
		frames.push(new frame(2015, 1026, 720, 1025));	
		frames.push(new frame(5, 0, 720, 1025));	
		frames.push(new frame(2015, 1026, 720, 1025));	
		frames.push(new frame(5, 0, 720, 1025));	
		frames.push(new frame(2015, 1026, 720, 1025));	
		frames.push(new frame(5, 0, 720, 1025));	
		frames.push(new frame(5, 0, 720, 1025));	
		frames.push(new frame(1333, 1026, 720, 1025));
		frames.push(new frame(685, 1026, 720, 1025));
		frames.push(new frame(2015, 0, 720, 1025));
		frames.push(new frame(3, 1026, 720, 1025));	
		frames.push(new frame(1335, 0, 720, 1025));
		frames.push(new frame(685, 0, 720, 1025));
		frames.push(new frame(5, 0, 720, 1025));	
		//frames.push(new frame(480, 100, 300, 420));		
		var stand = new action ("stand", frames, 10, false, false);
		this.currentAction = stand;
		this.currentFrame=stand.frames[0];
		
		this.msSinceFlip=0;
		
	}
	
	
	update(dt) {
		this.msSinceFlip+=dt;
		
		if (this.msSinceFlip>1000/this.currentAction.fps) {
			
			this.currentFrame = this.currentAction.getNextFrame();
			this.msSinceFlip=0;
		}
	}
	
	draw() {
		myWorld.context.drawImage(this.img, this.currentFrame.sx, this.currentFrame.sy, this.currentFrame.sw, this.currentFrame.sh, this.x, this.y, this.w, this.h);
			
	}
}


// the thing that moves with wasd
class hero extends object {
	
	constructor () {
		//super(false, true, 0, 0, 48, 54);
		super(false, true, 0, 0, 70, 100);
		this.bounce=0;
		this.direction=1;
	   
	   	this.iterate = false;
		this.ms_since_flip=0;
		
		this.last_x = 0; 
		this.last_y = 0;
		this.last_vy = 0;

		this.actions=new Array();
		
		this.comboCounter=0;

		
		//this.img.src = "./img/test_2.png"
		
		var standFrames = new Array();
		//standFrames.push(new frame(48,56,48,55));

		standFrames.push(new frame(310, 10, 300, 630));	
		var stand = new action ("stand", standFrames, 1, false, true);
		this.currentAction = stand;
		this.currentFrame=stand.frames[0];
		
		var standLeftFrames = new Array();
		standLeftFrames.push(new frame(1900, 1410, 300, 630));	
		var standLeft = new action ("standLeft", standLeftFrames, 1, false, true);
		
		
		var punchFrames = new Array();
		/*punchFrames.push(new frame(610, 10, 300, 630));	
		punchFrames.push(new frame(310, 10, 300, 630));	
		punchFrames.push(new frame(10, 10, 300, 630));	
		punchFrames.push(new frame(10, 10, 300, 630));
		punchFrames.push(new frame(10, 10, 300, 630));*/
		punchFrames.push(new frame(1600, 10, 300, 630));
		punchFrames.push(new frame(1960, 10, 300, 630));	
		punchFrames.push(new frame(1960, 10, 300, 630));	
		var punch = new action ("punch", punchFrames, 8, true, false);
		
		var punchLeftFrames = new Array();
		punchLeftFrames.push(new frame(1600, 1410, 300, 630));	
		punchLeftFrames.push(new frame(1900, 1410, 300, 630));	
		punchLeftFrames.push(new frame(2200, 1410, 300, 630));	
		punchLeftFrames.push(new frame(2200, 1410, 300, 630));
		punchLeftFrames.push(new frame(2200, 1410, 300, 630));
		var punchLeft = new action ("punchLeft", punchLeftFrames, 8, true, false);
		
		
		var walkFrames = new Array();
		walkFrames.push(new frame(10, 730, 390, 650));
		walkFrames.push(new frame(510, 730, 390, 650));
		walkFrames.push(new frame(910, 730, 330, 650));
		walkFrames.push(new frame(1310, 680, 310, 670));
		walkFrames.push(new frame(1720, 660, 390, 670));
		walkFrames.push(new frame(2120, 670, 370, 650));
		walkFrames.push(new frame(1600, 10, 300, 630));
		walkFrames.push(new frame(1960, 10, 300, 630));		
		
		var walk = new action ("walk", walkFrames,10, false, true);
		
		var walkLeftFrames = new Array();
		walkLeftFrames.push(new frame(2100, 2130, 390, 650));
		walkLeftFrames.push(new frame(1600, 2130, 390, 650));
		walkLeftFrames.push(new frame(1200, 2130, 390, 650));
		walkLeftFrames.push(new frame(900, 2090, 330, 650));
		walkLeftFrames.push(new frame(390, 2070, 310, 670));
		walkLeftFrames.push(new frame(0, 2080, 370, 650));
		walkLeftFrames.push(new frame(560, 1410, 300, 630));
		walkLeftFrames.push(new frame(200, 1410, 300, 630));		
		
		var walkLeft = new action ("walkLeft", walkLeftFrames,10, false, true);
		
		var paralyzedFrames = new Array() ;
		paralyzedFrames.push(new frame(610, 10, 300, 630));
		paralyzedFrames.push(new frame(510, 730, 390, 650));
		paralyzedFrames.push(new frame(510, 730, 390, 650));
		paralyzedFrames.push(new frame(610, 10, 300, 630));
		paralyzedFrames.push(new frame(510, 730, 390, 650));
		var beParalyzed = new action ("beParalyzed", paralyzedFrames, 4, true, false);
		
		var jumpFrames = new Array() ;
		jumpFrames.push(new frame(310, 10, 300, 630));		
		jumpFrames.push(new frame(310, 10, 300, 630));	
		jumpFrames.push(new frame(310, 10, 300, 630));	
		jumpFrames.push(new frame(310, 10, 300, 630));	
		jumpFrames.push(new frame(310, 10, 300, 630));	
		jumpFrames.push(new frame(310, 10, 300, 630));	
		jumpFrames.push(new frame(310, 10, 300, 630));	
		jumpFrames.push(new frame(310, 10, 300, 630));	
		var jump = new action ("jump", jumpFrames, 8, true, false);
		
		var jumpLeftFrames = new Array() ;
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));		
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));	
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));		
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));	
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));	
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));	
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));	
		jumpLeftFrames.push(new frame(1900, 1410, 300, 630));	
		var jumpLeft = new action ("jumpLeft", jumpLeftFrames, 8, true, false);
		
		
		
		this.actions.push(stand);
		this.actions.push(standLeft);
		this.actions.push(punch);
		this.actions.push(punchLeft);
		this.actions.push(walk);
		this.actions.push(walkLeft);
		this.actions.push(beParalyzed);
		this.actions.push(jump);
		this.actions.push(jumpLeft);
		
		this.myLifeBar = new lifeBar(100);
    }
	
	getAction(name) {
		for (var i=0; i<this.actions.length; i++) {
			if (this.actions[i].name==name) return this.actions[i]; 
		}
	}
	
	/*
	kick(direction) {
		this.currentAction="kick";
		var fps = 5;
		this.img.src = "./img/test_2.png";
		if (this.ms_since_flip>(1000/fps))
		{
			this.currentAction="stand";
			this.stand(1);
		}
		
	}*/
	
	

	
	// stand is the defaul action, but do not stand if we're in the middle of another finite action (such as attack)
	stand(direction) {
		this.direction=direction;
		if (this.direction ==1) {
			//if (!(this.currentAction=="kick" ||this.currentAction=="jump")) {	
			//if (this.currentAction.name=="stand") {
			if (this.currentAction.name=="stand") {
				//continue standing
				
				
			} else {
				// start standing
				this.currentAction=this.getAction("stand");
				this.currentFrame=this.currentAction.getFirstFrame(); 	
				this.ms_since_flip=0;
			}
		}
		else {
			//if (!(this.currentAction=="kick" ||this.currentAction=="jump")) {	
			//if (this.currentAction.name=="stand") {
			if (this.currentAction.name=="standLeft") {
				//continue standing
				
				
			} else {
				// start standing
				this.currentAction=this.getAction("standLeft");
				this.currentFrame=this.currentAction.getFirstFrame(); 	
				this.ms_since_flip=0;
			}
		}

	}
	
	punch(direction) {
		this.direction=direction;
		if (this.direction==1) {			
			if (this.currentAction.name=="punch") {
				// continue punching (should probably do this in update)
				/*if (this.ms_since_flip > 1000/this.currentAction.fps) {
					this.currentFrame = this.currentAction.getNextFrame();
					this.ms_since_flip =0;
				}*/
				//stand();
			}
			else {
				// start punching
				this.currentAction=this.getAction("punch");
				this.currentFrame=this.currentAction.getFirstFrame(); 	
				this.ms_since_flip=0;
			}
		} else {
				if (this.currentAction.name=="punchLeft") {
				// continue punching (should probably do this in update)
				/*if (this.ms_since_flip > 1000/this.currentAction.fps) {
					this.currentFrame = this.currentAction.getNextFrame();
					this.ms_since_flip =0;
				}*/
				//stand();
			}
			else {
				// start punching
				this.currentAction=this.getAction("punchLeft");
				this.currentFrame=this.currentAction.getFirstFrame(); 	
				this.ms_since_flip=0;
			}
		}
	}
	
	
	
	jump(direction) {
		this.direction=direction;
		if (this.direction==1) {
			if (this.currentAction.name =="jump") {
				// continue
				
				
			} else {
				this.vy=-300;
				this.currentAction = this.getAction("jump");
				this.currentFrame = this.currentAction.getFirstFrame();
			}
		} else {
			if (this.currentAction.name =="jumpLeft") {
				// continue			
			} else {
				this.vy=-300;
				this.currentAction = this.getAction("jumpLeft");
				this.currentFrame = this.currentAction.getFirstFrame();
			}
		}			
		
	}
	
	walk(direction) {
		this.direction=direction;
		this.x= this.x + (direction * 5);
		if (this.direction==1) {		
		
			if (this.currentAction.name =="walk") {
				// continue walking
				
			} else {
				// start walking
				if (this.currentAction.name=="jump") {
					//ignore
					
				}
				else {
					this.currentAction = this.getAction("walk");
					this.currentFrame = this.currentAction.getFirstFrame();
				}
				
			}
		} else {
			if (this.currentAction.name =="walkLeft") {
				// continue walking	
				
			} else {
				// start walking
				if (this.currentAction.name=="jump") {
					//ignore
					
				}
				else {
					this.currentAction = this.getAction("walkLeft");
					this.currentFrame = this.currentAction.getFirstFrame();
				}
				
			}
		}
	}
	
	beParalyzed(direction) {
		this.direction=direction;
		if (this.currentAction.name =="beParalyzed") {
			// continue being paralyzed
			
			
		} else {
			// start being paralyzed

				this.currentAction = this.getAction("beParalyzed");
				this.currentFrame = this.currentAction.getFirstFrame();
			
			
		}
	}
	
	takeDamage(damage){
		// damage is an int
		this.myLifeBar.takeDamage(damage);
		this.life = this.life-damage;
		if (this.life<=0) {
			//die
			
			
			this.life=0;
			this.isVisible=false;
			//this.die();
		}
		
	}
	
	
	
	update(dt) {
			if (this.isVisible) {
				this.last_x=this.x;
				this.last_y=this.y;
				
				super.update(dt);
				
				if (this.ms_since_flip > 1000/this.currentAction.fps) {
					this.currentFrame = this.currentAction.getNextFrame();
					if (!this.currentFrame) {
						this.stand(this.direction);
					}
					this.ms_since_flip=0;
				}
				
				if (this.currentAction.interruptible) {
				// handle pressed keys
					if ((keyState[37] || keyState[65]) && (keyState[39] || keyState[68])){
							//do nothing
					}
					else if (keyState[38] || keyState[87] ){
						this.jump(this.direction);
					}
					else if (keyState[37] || keyState[65])
					{
						this.walk(-1);
						
					}
					else if (keyState[39] || keyState[68]) {
						
						this.walk(1);
						
					}
					else if (keyState[38] || keyState[87])
					{
						//crouch
					}
					else {
						if (this.currentAction.name == "walk" || this.currentAction.name=="walkLeft") {
							this.stand(this.direction);
						}
					}
				}
				
				this.ms_since_flip=this.ms_since_flip+dt;
				/*
				if (this.currentAction=="kick") {
					this.kick(this.direction);
				}
				else if (this.currentAction=="stand") {
					this.stand(this.direction);
				}
				else if (this.currentAction=="walk") {
					//this.walk(this.direction);
				}
				else if (this.currentAction=="jump") {
					this.jump(this.direction);
				}
				else {
					this.stand(this.direction);
				}
				*/
			}

	}
	
	draw() {
		//this.img.src = "./img/dude_sprite_sheet.png";
		if (this.isVisible) {
			this.myLifeBar.draw(this.x, this.y-12);
			myWorld.context.drawImage(this.img, this.currentFrame.sx, this.currentFrame.sy, this.currentFrame.sw, this.currentFrame.sh, this.x, this.y, this.w, this.h);
		}
	}
	
}


class action {
	
	constructor(name, frames, fps, finite, interruptible) {
		this.frames = frames; // array of frames
		this.name=name;
		this.fps = fps;
		
		this.finite = finite || false;
		this.interruptible=interruptible || false;
		
		
		this.currentFrameIndex = 0;
	}
	
	getFirstFrame() {
		this.currentFrameIndex = 0;
		
		
		return this.frames[this.currentFrameIndex];
		// returns frame or false
	}
	
	
	getNextFrame() {

		if (this.currentFrameIndex >= this.frames.length-1) {
			if (this.finite) return false;
			this.currentFrameIndex=0;
			
		} else {
			this.currentFrameIndex++;
		}
		
		return this.frames[this.currentFrameIndex];
		// returns frame or false
	}
}

class frame {
	constructor(sx, sy, sw, sh) {
		this.sx=sx; //The x coordinate where to start clipping
		this.sy=sy; //The y coordinate where to start clipping
		this.sw=sw; //The width of the clipped image
		this.sh=sh; //The height of the clipped image
	}
}

/**
Handles collision detection but returning boolean, but also ensures that objects never overlap
*/
function isCollision (obj1, obj2) {
	//if (!(obj1.isVisible && obj2.isVisible)) return false; // can't collide with something that's not there
	if ((obj1.x+obj1.w < obj2.x) || (obj2.x+obj2.w < obj1.x)) {
		return false;
	}

	if (obj2.y >= obj1.y && obj2.y <= obj1.y + obj1.h) {
		// object 2 is colliding from below
		if (obj1.isFixed) {
			//obj2.y= obj1.y+obj1.h;
		}
		else {
			// object 2 may or may not be fixed... Either way, we'll just manipulate obj
			//obj1.y = obj2.y-obj1.h;
		}

		return true;
	}
	else if (obj1.y >= obj2.y && obj1.y <= obj2.y + obj2.h) {
		// object 2 is colliding from above
		if (obj2.isFixed) {
			//obj1.y = obj2.y+obj2.h;
			
		}
		else {
			// object 1 may or may not be fixed... Either way, we'll just manipulate obj2
			//obj2.y= obj1.y-obj2.h;
		}
		return true;
	}
	
	return false;

}

function getRelativeDistance(obj1, obj2) {
// returns x, y - the distance from center of obj1 to obj2
// if x is negative, object 2's center is to the left of object 1's
// if y is negative, object 1's center is below object 2's 

	var x= obj2.x - obj1.x;
	var y = obj2.y - obj1.y;

	return {x,y};
}

