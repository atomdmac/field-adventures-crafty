GAME = {
	currentMap: null,
	init: function() {
		Crafty.init(500, 500);
		
		// Initialize game components.
		Crafty.c("Player", {
			player: function(image) {
				this.image(image);
			},
			init: function() {
				this.requires("2D, DOM, Multiway, Image, Collision, WiredHitBox");
				
				// Initialize sub-components.
				this.multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
				
				// Create a bounding box as big as a tile (32x32 in this case).
				this.collision([0,0], [32,0], [32,32], [0,32]);
				
				// Camera should follow this entity.
				Crafty.viewport.follow(this);
				
				console.log("Player: ", this);
				
				// Listen for collisions.
				this.bind('Moved', function(from) {
					var col = this.hit("Collision");
					if(col){
						var x = 0;
						var y = 0;
						
						// Are all collisions in the same column/row on the map?
						var samex = true;
						var samey = true;
						
						var lastx = col[0].obj._x;
						var lasty = col[0].obj._y;
						
						for(var i in col) {
							var cur = col[i];
							var obj = cur.obj;
							
							console.log("last: ", lastx, lasty, " | cur: ", obj._x, obj._y);
							
							if(obj._x != lastx) samex = false;
							lastx = obj._x;
							if(obj._y != lasty) samey = false;
							lasty = obj._y;
							
							console.log("samex? ", samex, " | samey? ", samey);
							
							var overlap = Math.abs(cur.overlap);
							x += cur.normal.x * overlap;
							y += cur.normal.y * overlap;
						}	
						
						console.log("Col: ", col);
						console.log("Vec: ", x, y);
						
						// Clamp speed to maximum speed.
						if(x >  this._speed.x) x =  this._speed.x;
						if(x < -this._speed.x) x = -this._speed.x;
						if(y >  this._speed.y) y =  this._speed.y;
						if(y < -this._speed.y) y = -this._speed.y;
						
						// If all collisions are happening in the same column,
						// don't bother adjusting on the y axis.
						if(samex) y = 0;
						// If all collisions are happening in the same row,
						// don't bother adjusting on the x axis.
						if(samey) x = 0;
						
						this.attr({
							"x": this.x + x,
							"y": this.y + y
						});
					}
				});
				
				// Make this chainable.
				return this;
			}
		});
		
		// Create and load the map.
		this.currentMap = Crafty.e("2D, DOM, TiledLevel")
			.tiledLevel("data/test-map.json", "DOM");
	},
	
	touchControls: function(container) {
		var container = $("#"+container);
		
		var up = $("<button>UP</button>").appendTo(container);
		var down = $("<button>DOWN</button>").appendTo(container);
		var left = $("<button>LEFT</button>").appendTo(container);
		var right = $("<button>RIGHT</button>").appendTo(container);
	}
}