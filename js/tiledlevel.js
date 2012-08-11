(function () {
	Crafty.c("TiledLevel", {
		// An array of tileset objects imported from the map.
		tilesets: null,
		
		/** 
		 * Create tile components to be added to tile entities via makeLayer().
		 * @param ts The tilesets that this map contains.
		 * @param drawType The rendering engine that Crafty should draw the map with.
		 * @return Void
		 */
		makeTiles : function (ts, drawType) {
			
			var components,
			i,
			posx,
			posy,
			sMap,
			sName,
			tHeight,
			tName,
			tNum,
			tWidth,
			tsHeight,
			tsImage,
			tsProperties,
			tsWidth,
			xCount,
			yCount,
			_ref;
			tsImage = ts.image,
			tNum = ts.firstgid,
			tsWidth = ts.imagewidth;
			tsHeight = ts.imageheight,
			tWidth = ts.tilewidth,
			tHeight = ts.tileheight;
			tsProperties = ts.tileproperties;
			xCount = tsWidth / tWidth | 0;
			yCount = tsHeight / tHeight | 0;
			sMap = {};
			for (i = 0, _ref = yCount * xCount; i < _ref; i += 1) {
				posx = i % xCount;
				posy = i / xCount | 0;
				sName = "tileSprite" + tNum;
				tName = "tile" + tNum;
				sMap[sName] = [posx, posy];
				components = "2D, " + drawType + ", " + sName + ", MapTile";
				
				// TODO: Figure out what's going on here... using tNum as an index for tsProperties doesn't really work since it's a GID.
				if (tsProperties) {
					if (tsProperties[tNum - 1]) {
						if (tsProperties[tNum - 1]["components"]) {
							components += ", " + tsProperties[tNum - 1]["components"];
						}
					}
				}
				
				// TODO: This works but...goddamn is it ugly.
				try{
					
					// Account for collision.
					if(tsProperties[i].type == "solid") {
						components += ", Collidable";
					}
				} catch(e) {
					/* Empty */ 
				};
				
				Crafty.c(tName, {
					comp : components,
					init : function () {
						this.addComponent(this.comp);
						return this;
					}
				});
				tNum++;
			}
			
			Crafty.sprite(tWidth, tHeight, tsImage, sMap);
			return null;
		},
		
		/**
		 * Renders a layer by applying the tile components created in
		 * makeTiles() to new entities.
		 * @param layer An Object describing the layer to be created.
		 * @param tilesets An Array of the tilesets that this map contains.
		 * @return Void
		 */
		makeLayer : function (layer, tilesets) {
			var i,
			lData,
			lHeight,
			lWidth,
			tDatum,
			tile,
			_len;
			lData = layer.data,
			lWidth = layer.width,
			lHeight = layer.height;
			
			// Create a tile layer.
			if(layer.type == "tilelayer") {
				for (i = 0, _len = lData.length; i < _len; i++) {
					tDatum = lData[i];
					if (tDatum) {
						tile = Crafty.e("tile" + tDatum);
						tile.x = (i % lWidth) * tile.w;
						tile.y = (i / lWidth | 0) * tile.h;
					}
				}
			}
			
			// Create an entity/object layer.
			else if(layer.type == "objectgroup") {
				for (i = 0, _len = layer.objects.length; i < _len; i++) {
					tDatum = layer.objects[i];
					if (tDatum) {
						// Create a component using the object's type property.
						var obj = Crafty.e(tDatum.type);
						
						// Call initializer function.
						// NOTE: Expected to be an all lowercase version of the component name.
						obj[tDatum.type.toLowerCase()](tilesets[tDatum.properties.image].image);
						
						// Position that stuff!
						obj.x = tDatum.x;
						obj.y = tDatum.y;
					}
				}
			}
			return null;
		},
		
		/**
		 * Load the map at the specified URL.
		 * @param levelURL A String that describes the URL to load the map from.
		 * @param drawType A String that describes which rendering engine to use.
		 * @return Void
		 */
		tiledLevel : function (levelURL, drawType) {
			var _this = this;
			$.ajax({
				type : 'GET',
				url : levelURL,
				dataType : 'json',
				data : {},
				async : false,
				success : function (level) {
					var lLayers,
					ts,
					tsImages,
					tss;
					lLayers = level.layers,
					tss = level.tilesets;
					
					// Store tilesets for later with named keys.
					_this.tilesets = {};
					for(var a in level.tilesets) {
						var key = level.tilesets[a].name;
						_this.tilesets[key] = level.tilesets[a];
					}
					
					drawType = drawType != null ? drawType : "Canvas";
					tsImages = (function () {
						var _i,
						_len,
						_results;
						_results = [];
						for (_i = 0, _len = tss.length; _i < _len; _i++) {
							ts = tss[_i];
							_results.push(ts.image);
						}
						return _results;
					})();
					Crafty.load(tsImages, function () {
						var layer,
						ts,
						_i,
						_j,
						_len,
						_len2;
						for (_i = 0, _len = tss.length; _i < _len; _i++) {
							ts = tss[_i];
							_this.makeTiles(ts, drawType);
						}
						for (_j = 0, _len2 = lLayers.length; _j < _len2; _j++) {
							layer = lLayers[_j];
							_this.makeLayer(layer, _this.tilesets);
						}
						return null;
					});
					return null;
				}
			});
			return this;
		},
		
		init : function () {
			// Create "Collidable" component.
			Crafty.c("Collidable", {
				init: function() {
					// EMPTY.
				}
			});
			return this;
		}
	});
	
}).call(this);
