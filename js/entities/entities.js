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