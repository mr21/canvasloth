Canvasloth.prototype.Images = function() {
	this.images = {
		imgs: [],
		load: function(imgs, callback) {
			if (!imgs || imgs.length === 0) {
				if (callback)
					callback();
			} else {
				var self = this,
					nbImagesToLoad = imgs.length;
				for (var i = 0, img; i < imgs.length; ++i) {
					img = new Image();
					img.src = imgs[i];
					img.onload = function() {
						var name = this.src.substr(this.src.lastIndexOf('/') + 1);
						name = name.substr(0, name.lastIndexOf('.'));
						self.imgs[name] = this;
						if (--nbImagesToLoad === 0 && callback)
							callback();
					};
				}
			}
		},
		find: function(name) {
			return this.imgs[name];
		}
	};
};

