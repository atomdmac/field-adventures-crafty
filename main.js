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
				this.requires("2D, DOM, Multiway, Image, Collision");
				
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
				
				// Listen for mouse event.
				this.bind("GlobalMouseDown", function(e) {
					console.log("MouseDown!", e);
				});
				
				// Make this chainable.
				return this;
			}
		});
		
		/**
		 * MouseInput
		 * Allows for global mouse input.  Anytime the user clicks/taps on the
		 * viewport, a Crafty-generated mouse event will be triggered.
		 */
		Crafty.c("MouseInput", {
			init: function() {
				// Get a reference to the stage element.
				var stage = Crafty.stage.elem;
				
				// Create an overlay to catch mouse events.
				var overlayMarkup = "<div id='mouseinput-overlay'></div>";
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
			},
		});
		
		// Create and load the map.
		this.currentMap = Crafty.e("2D, DOM, TiledLevel")
			.tiledLevel("data/test-map.json", "DOM");
			
		// Make a test entity for MouseMovement.
		var mm = Crafty.e("MouseInput");
	}
}