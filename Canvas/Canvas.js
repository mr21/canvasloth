Canvasloth.Canvas = function(container) {
	this.container = container;
	this.canvas = document.createElement('canvas');
	container.appendChild(this.canvas);
};

Canvasloth.Canvas.prototype = {
	getContext: function(type) { return this.canvas.getContext(type); },
	width:  function() { return this.canvas.width;  },
	height: function() { return this.canvas.height; },
	resize: function() {
		this.canvas.width  = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
	}
};
