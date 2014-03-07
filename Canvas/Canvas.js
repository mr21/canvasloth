Canvasloth.Canvas = function(canvasloth, container) {
	this.canvasloth = canvasloth;
	this.container = container;
	// <canvas>
	this.canvas = document.createElement('canvas');
	container.appendChild(this.canvas);
	// <div.canvasloth-mouse>
	this.catchMouse = document.createElement('div');
	this.catchMouse.className = 'canvasloth-mouse';
	container.appendChild(this.catchMouse);
	this.catchMouse.oncontextmenu = function() { return false; };
};

Canvasloth.Canvas.prototype = {
	getContext: function(type) { return this.canvas.getContext(type); },
	cursor: function(c) { this.catchMouse.style.cursor = c; },
	width:  function() { return this.canvas.width;  },
	height: function() { return this.canvas.height; },
	resize: function() {
		this.canvas.width  = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
	}
};
