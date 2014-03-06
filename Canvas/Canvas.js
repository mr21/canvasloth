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
	// Events
	this.catchMouse._addEvent('mousedown', function(e) { canvasloth.focus(e); });
	if (canvasloth.app.mousedown) this.addEvent('mousedown', this, this.mouseDown);
	if (canvasloth.app.mouseup)   this.addEvent('mouseup',   this, this.mouseUp);
	if (canvasloth.app.mousemove) this.addEvent('mousemove', this, this.mouseMove);
};

Canvasloth.Canvas.prototype = {
	getContext: function(type) { return this.canvas.getContext(type); },
	cursor: function(c) { this.catchMouse.style.cursor = c; },
	width:  function() { return this.canvas.width;  },
	height: function() { return this.canvas.height; },
	resize: function() {
		this.canvas.width  = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
	},
	addEvent: function(event, obj, fn) {
		var c = this.canvasloth;
		var cb = function(e) {
			if (c.active)
				fn.call(obj, e);
		};
		this.catchMouse._addEvent(event, cb);
		return cb;
	},
	delEvent: function(event, cb) {
		this.catchMouse._delEvent(event, cb);
	},
	mouseDown: function(e) {
		var c = this.canvasloth;
		if (c.active) {
			var cam = c.getCtx()._V2cam; // tmp
			c.btnBool[e.button] = true;
			c.app.mousedown.call(c.app,
				e.button,
				e.layerX - cam.x,
				e.layerY - cam.y
			);
		}
		c.focus(e);
	},
	mouseUp: function(e) {
		var c = this.canvasloth;
		if (c.active) {
			var cam = c.getCtx()._V2cam; // tmp
			c.btnBool[e.button] = false;
			c.app.mouseup.call(c.app,
				e.button,
				e.layerX - cam.x,
				e.layerY - cam.y
			);
		}
	},
	mouseMove: function(e) {
		var c = this.canvasloth;
		if (c.active) {
			var cam = c.getCtx()._V2cam; // tmp
			c.app.mousemove.call(c.app,
				e.layerX - cam.x,
				e.layerY - cam.y,
				offsetMouse.xRel,
				offsetMouse.yRel
			);
		}
	}
};
