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