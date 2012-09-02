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
		
		Crafty.c("TouchControls", {
			init: function() {
				
				var controlDepth = 50;
			
				// Get a reference to the stage element.
				var stage = Crafty.stage.elem;
				
				// Create an overlay to catch mouse events.
				var overlayMarkup = "<div id='touchcontrols-overlay'></div>";
				this._overlay = $(overlayMarkup).appendTo(stage);
				this._overlay.css({
					"position": "absolute",
					"width": Crafty.viewport.width + 100,
					"height": Crafty.viewport.height,
					"z-index": 2
				});
				
				// Listen for mouse events.
				// TODO: Add listeners for all event types.
				this._overlay.click(function(e){
					Crafty.trigger("GlobalClick", e);
				});
				this._overlay.mousedown(function(e){
					Crafty.trigger("GlobalMouseDown", e);
				});
				
				// Function to convert taps to keyboard keys.
				function tap2key(x, y) {
					
					// Shortcut to the viewport object.
					var v = Crafty.viewport;
				
					// Left edge.
					if(x > 0 && x < controlDepth) return {key: "A"};
					
					// Right edge
					if (x > (v.width - controlDepth)) && x < 
					// Top edge.
					
					// Bottom edge.
				}
			},
		});
		
		// Create and load the map.
		this.currentMap = Crafty.e("2D, DOM, TiledLevel")
			.tiledLevel("data/test-map.json", "DOM");
	}
}