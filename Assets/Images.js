Canvasloth.Assets.Images = function() {
	this.array = [];
};

Canvasloth.Assets.Images.prototype = {
	load: function(imgs, callback) {
		if (!imgs || imgs.length === 0) {
			callback();
		} else {
			var self = this,
				nbImagesToLoad = imgs.length;
			for (var i = 0, img; i < imgs.length; ++i) {
				img = new Image();
				img.src = imgs[i];
				img.onload = function() {
					self.array.push(this);
					if (--nbImagesToLoad === 0 && callback)
						callback();
				};
			}
		}
	},
	find: function(path) {
		var i, img;
		if (path === undefined)
			img = this.array[0];
		else if (!isNaN(i = parseInt(path)))
			img = this.array[i];
		else
			for (i = 0; (img = this.array[i]) && img.src.indexOf(path) === -1; ++i) {}
		return img || null;
	}
};
