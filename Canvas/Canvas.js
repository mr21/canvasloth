Canvasloth.Canvas = function(canvasloth, container) {
	this.container = container;
	// <canvas>
	this.canvas = document.createElement('canvas');
	container.appendChild(this.canvas);
	// <div.canvasloth-mouse>
	this.catchMouse = document.createElement('div');
	this.catchMouse.className = 'canvasloth-mouse';
	container.appendChild(this.catchMouse);
	this.catchMouse.oncontextmenu = function() { return false; };
	// Events
	var c = canvasloth;
	this.catchMouse._addEvent('mousedown', function(e) {
		if (c.app.mousedown && c.active) {
			var cam = c.getCtx()._V2cam; // tmp
			c.app.mousedown.call(c.app,
				e.button,
				e.layerX - cam.x,
				e.layerY - cam.y
			);
		}
		c.focus(e);
	});
	if (c.app.mouseup)
		this.catchMouse._addEvent('mouseup', function(e) {
			if (c.active) {
				var cam = c.getCtx()._V2cam; // tmp
				c.app.mouseup.call(c.app,
					e.layerX - cam.x,
					e.layerY - cam.y
				);
			}
		});
	if (c.app.mousemove)
		this.catchMouse._addEvent('mousemove', function(e) {
			if (c.active) {
				var cam = c.getCtx()._V2cam; // tmp
				c.app.mousemove.call(c.app,
					e.layerX - cam.x,
					e.layerY - cam.y,
					offsetMouse.xRel,
					offsetMouse.yRel
				);
			}
		});
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
