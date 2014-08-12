//Menu
game.TitleScreen = me.ScreenObject.extend({
	onResetEvent : function() {
		me.game.world.addChild(new me.SpriteObject(0,0,me.loader.getImage('title_screen')),1);
        me.game.world.addChild(new (me.Renderable.extend ({
        	init : function() {
        		this.parent(new me.Vector2d(0, 0), me.game.viewport.width, me.game.viewport.height);
        		game.TitleScreen = me.ScreenObject.extend({
        			onResetEvent : function() {
        				me.game.world.addChild(new me.SpriteObject (0,0,me.loader.getImage('title_screen')),1);
        				me.game.world.addChild(new (me.Renderable.extend ({
        					init : function() {
        						this.parent(new me.Vector2d(0, 0), me.game.viewport.width, me.game.viewport.height);
        						this.font = new me.BitmapFont("32x32_font", 32);
        						this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
        						this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
        						this.scrollerpos = 600;
        					},
        					scrollover : function() {
        						this.scrollerpos = 640;
        						this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
        					},
        					update : function (dt) {return true;},
        					draw : function (context) {
        						this.font.draw (context, "PRESS ENTER TO PLAY", 20, 240);
        						this.font.draw(context, this.scroller, this.scrollerpos, 440);
        					},
        					onDestroyEvent : function() {this.scrollertween.stop();}
        				})), 2);
        				me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        				me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);
        				this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
        					if (action === "enter") {
        						me.audio.play("cling"); 
        						me.state.change(me.state.PLAY);    
        					}
        				});
        			},
        			/*leaving this screen*/
        			onDestroyEvent : function() {
        				me.input.unbindKey(me.input.KEY.ENTER);
        				me.input.unbindPointer(me.input.mouse.LEFT);
        				me.event.unsubscribe(this.handler);
        			}
        		});// font for the scrolling text
                this.font = new me.BitmapFont("32x32_font", 32);
                this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
                this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
                this.scrollerpos = 600;
            },
            scrollover : function() {
            	this.scrollerpos = 640;
            	this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
            },
            update : function (dt) {return true;},
            draw : function (context) {
            	this.font.draw (context, "PRESS ENTER TO PLAY", 20, 240);
            	this.font.draw(context, this.scroller, this.scrollerpos, 440);
            },
            onDestroyEvent : function() {this.scrollertween.stop();}
        })), 2);
        // change to play state on press Enter or click/tap
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
        	if (action === "enter") {
        		// play something on tap / enter
        		// this will unlock audio on mobile devices
        		me.audio.play("cling");
        		me.state.change(me.state.PLAY);
        	}
        });
	},
	/*leaving this screen (state change)*/
	onDestroyEvent : function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindPointer(me.input.mouse.LEFT);
		me.event.unsubscribe(this.handler);
	}
});
// Player
game.PlayerEntity = me.ObjectEntity.extend({
	//constructor
	init: function(x,y,settings){
		//llama al constructor
		this.parent(x,y,settings);
		//setea velocidad
		this.setVelocity(3,15);
		//setea el seguimiento de pantalla para seguir nuestra posicion
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	//actualizar posicion
	update: function(dt){
		if(me.input.isKeyPressed('left')){
			//espejar sprite horizontalmente
			this.flipX(true);
			//refrescar velocidad
			this.vel.x-=this.accel.x*me.timer.tick;
		}else if(me.input.isKeyPressed('right')){
			//volver a orientacion normal el srpite
			this.flipX(false);
			//refresca velocidad
			this.vel.x+=this.accel.x*me.timer.tick;
		}else {this.vel.x=0;}
		if(me.input.isKeyPressed('jump')){
			//que no este en el aire
			if(!this.jumping&&!this.falling){
				//maxima velocidad-gravedadxtick
				this.vel.y=-this.maxVel.y*me.timer.tick;
				//ahora esta saltando
				this.jumping=true;
				me.audio.play("jump");
			}
		}
		this.updateMovement();
		var res=me.game.world.collide(this);
		if(res){
			if(res.obj.type==me.game.ENEMY_OBJECT){
				if(res.y>0&&!this.jumping){
					this.falling=false;
					this.vel.y=-this.maxVel.y*me.timer.tick;
					this.jumping=true;
					me.audio.play("stomp");
				}else this.renderable.flicker(750);
			}
		}
		if(this.vel.x!=0||this.vel.y!=0){
			this.parent(dt);
			return true;
		}
		return false;
	}
});
//Coin
game.CoinEntity=me.CollectableEntity.extend({
	init:function(x,y,settings){this.parent(x,y,settings);},
	onCollision: function(){
		me.audio.play("cling");
		game.data.score+=250;
		this.collidable=false;
		me.game.world.removeChild(this);
	}
});
//Enemy

game.EnemyEntity=me.ObjectEntity.extend({
	init:function(x,y,settings){
		settings.image="wheelie_right";
		var width= settings.width;
		var height= settings.height;
		settings.spritewidth=settings.width=64;
		settings.spritewidth=settings.height=64;
		this.parent(x,y,settings);
		x=this.pos.x;
		this.startX=x;
		this.endX=x+width - settings.spritewidth;
		this.pos.x=x+width - settings.spritewidth;
		this.setVelocity(4,6);
		this.collidable=true;
		this.type=me.game.ENEMY_OBJECT;
	},
	onCollision: function(res,obj){
		if(this.alive&&(res.y>0)&&obj.falling){
			this.renderable.flicker(750);
		}
	},
	update:function(dt){
		if(!this.inViewport) return false;
		if(this.alive){
			if(this.walkLeft&&this.pos.x<=this.startX) this.walkLeft=false;
			else if(!this.walkLeft&&this.pos.x>=this.endX) this.walkLeft=true;
			this.flipX(this.walkLeft);
			this.vel.x+=(this.walkLeft)?-this.accel.x*me.timer.tick:this.accel.x*me.timer.tick;
		} else this.vel.x=0;
		this.updateMovement();
		if(this.vel.x!=0 ||this.vel.y!=0) {
			this.parent(dt);
			return true;
		}
		return false;
	}
	});