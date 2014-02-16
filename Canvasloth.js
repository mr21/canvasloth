function Canvasloth(container, images, fns) {
	var self = this;
	this.canvas = document.createElement('canvas');
	container.appendChild(this.canvas);
	this.catchMouse = document.createElement('div');
	this.catchMouse.className = 'canvasloth-mouse';
	container.appendChild(this.catchMouse);
	this.container = container;
	this.ctx       = this.canvas.getContext('2d');
	this.fns       = fns;
	this.time      = new Time();
	this.vectView  = new Vector2D(0, 0);
	this.keyBool   = [];
	this.active = false;
	window  ._addEvent('blur',      function() { self.unfocus() });
	document._addEvent('mousedown', function() { self.unfocus() });
	this.pages = new Canvasloth.Pages(this);
	this.assets = new Canvasloth.Assets(this.ctx, this.time);
	this.assets.images.load(images, function() { self.launch() });
}

Canvasloth.prototype = {
	launch: function() {
		var self = this;
		var fns  = this.fns;
		// Events
		// -- keyboard
		if (fns.keydown) document._addEvent('keydown', function(e) { if (self.active && !self.keyBool[e.keyCode]) { e.preventDefault(); self.keyBool[e = e.keyCode] = 1; fns.keydown(e) }});
		if (fns.keyup)   document._addEvent('keyup',   function(e) { if (self.active &&  self.keyBool[e.keyCode]) { e.preventDefault(); self.keyBool[e = e.keyCode] = 0; fns.keyup  (e) }});
		// -- mouse
		if (fns.mousedown) this.catchMouse._addEvent('mousedown', function(e) { if (self.active) fns.mousedown(e.layerX - self.vectView.x, e.layerY - self.vectView.y); self.focus(e); });
		if (fns.mouseup)   this.catchMouse._addEvent('mouseup',   function(e) { if (self.active) fns.mouseup  (e.layerX - self.vectView.x, e.layerY - self.vectView.y); });
		if (fns.mousemove) this.catchMouse._addEvent('mousemove', function(e) { if (self.active) fns.mousemove(e.layerX - self.vectView.x, e.layerY - self.vectView.y, offsetMouse.xRel, offsetMouse.yRel) });
		// -- resize
		window._addEvent('resize', function() { self.updateResolution(); self.render(); });
		this.updateResolution();
		fns.load();
		this.focus();
		this.time.reset();
		this.intervId = window.setInterval(function() {
			self.loop();
		}, 1000 / 40);
	},
	cursor: function(c) { this.catchMouse.style.cursor = c },
	width:  function() { return this.canvas.width  },
	height: function() { return this.canvas.height },
	updateResolution: function() {
		this.canvas.width  = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
	},
	resetKeyboard: function() {
		for (var i in this.keyBool)
			if (this.keyBool[i = parseInt(i)]) {
				this.fns.keyup(i);
				this.keyBool[i] = 0;
			}
	},
	focus: function(event) {
		if (event)
			event.stopPropagation();
		if (this.active !== true) {
			this.active = true;
			document.body._addClass('canvasloth-focus');
			this.container._addClass('canvasloth-active');
			this.time.update();
		}
	},
	unfocus: function() {
		if (this.active === true) {
			this.active = false;
			document.body._delClass('canvasloth-focus');
			this.container._delClass('canvasloth-active');
			this.resetKeyboard();
		}
	},
	render: function() {
		var ctx = this.ctx;
		ctx.clearRect(0, 0, this.width(), this.height());
		ctx.save();
			ctx.translate(this.vectView.x, this.vectView.y);
				this.fns.render(ctx);
		ctx.restore();
	},
	loop: function() {
		if (this.active) {
			this.time.update();
			this.fns.update(this.time);
			this.render();
		}
	},
	stop: function() {
		window.clearInterval(this.intervId);
	},
	getView: function()     { return this.vectView      },
	setView: function(x, y) { this.vectView.setXY(x, y) }
};
