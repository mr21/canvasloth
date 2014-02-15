Assets.prototype.Images = function() {
	this.array = [];
};

Assets.prototype.Images.prototype = {
	load: function(imgs, callback) {
		var i = 0, img, self = this,
			nbImagesToLoad = imgs.length;
		for (; i < imgs.length; ++i) {
			img = new Image();
			img.src = imgs[i];
			img.onload = function() {
				self.array.push(this);
				if (--nbImagesToLoad === 0 && callback)
					callback();
			};
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
