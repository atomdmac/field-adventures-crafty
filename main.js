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
				this.collision([0,0], [32,0], [32,32], [0,32]);
				
				// Camera should follow this entity.
				Crafty.viewport.follow(this);
				
				// Listen for collisions.
				this.bind('Moved', function(from) {
					var col = this.hit("Collision");
					if(col){
						console.log(col);
						this.attr({x: from.x, y:from.y});
					}
				});
				
				// Make this chainable.
				return this;
			}
		});
		
		// Create and load the map.
		this.currentMap = Crafty.e("2D, DOM, TiledLevel")
			.tiledLevel("data/test-map.json", "DOM");
	}
}