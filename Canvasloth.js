function Canvasloth(ctx, container, app, images) {
	var self = this;
	this.app = app;
	this.canvas = document.createElement('canvas');
	container.appendChild(this.canvas);
	this.catchMouse = document.createElement('div');
	this.catchMouse.className = 'canvasloth-mouse';
	container.appendChild(this.catchMouse);
	this.ctxType = ctx.toLowerCase();
	this.ctx = this.ctxType === '3d'
		? this.canvas.getContext('webgl') || this.canvas.getContext("experimental-webgl")
		: this.canvas.getContext(ctx);
	this.fps = 40;
	this.container = container;
	this.keyBool = [];
	this.active = false;
	this.vectView = new Canvasloth.Math.V2(0, 0);
	this.time = new Canvasloth.Time();
	this.pages = new Canvasloth.Pages(this);
	this.assets = new Canvasloth.Assets(this.ctx, this.time);
	if (this.ctxType === '3d')
		this.webgl = new Canvasloth.WebGL(container, this.ctx);
	this.assets.images.load(images, function() { self.ready() });
}

Canvasloth.prototype = {
	setEvents: function() {
		var self = this;
		// Window
		document._addEvent('mousedown', function() {
			self.unfocus();
		});
		window._addEvent('blur', function() {
			self.unfocus();
		});
		window._addEvent('resize', function() {
			self.updateResolution();
			self.render();
		});
		// Keyboard
		if (this.app.keydown)
			document._addEvent('keydown', function(e) {
				if (self.active && !self.keyBool[e.keyCode]) {
					e.preventDefault();
					self.keyBool[e = e.keyCode] = 1;
					self.app.keydown.call(self.app, e);
				}
			});
		if (this.app.keyup)
			document._addEvent('keyup', function(e) {
				if (self.active &&  self.keyBool[e.keyCode]) {
					e.preventDefault();
					self.keyBool[e = e.keyCode] = 0;
					self.app.keyup.call(self.app, e);
				}
			});
		// Mouse
		if (this.app.mousedown)
			this.catchMouse._addEvent('mousedown', function(e) {
				if (self.active)
					self.app.mousedown.call(self.app,
						e.layerX - self.vectView.x,
						e.layerY - self.vectView.y
					);
				self.focus(e);
			});
		if (this.app.mouseup)
			this.catchMouse._addEvent('mouseup', function(e) {
				if (self.active)
					self.app.mouseup.call(self.app,
						e.layerX - self.vectView.x,
						e.layerY - self.vectView.y
					);
			});
		if (this.app.mousemove)
			this.catchMouse._addEvent('mousemove', function(e) {
				if (self.active)
					self.app.mousemove.call(self.app,
						e.layerX - self.vectView.x,
						e.layerY - self.vectView.y,
						offsetMouse.xRel,
						offsetMouse.yRel
					);
			});
	},
	ready: function() {
		var self = this;
		this.setEvents();
		this.updateResolution();
		if (this.app.ready)
			this.app.ready();
		this.time.reset();
		this.focus();
	},
	cursor: function(c) { this.catchMouse.style.cursor = c },
	width:  function() { return this.canvas.width  },
	height: function() { return this.canvas.height },
	updateResolution: function() {
		this.canvas.width  = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
		if (this.ctxType === '3d')
			this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
	},
	resetKeyboard: function() {
		for (var i in this.keyBool)
			if (this.keyBool[i = parseInt(i)]) {
				if (this.app.keyup)
					this.app.keyup.call(this.app, i);
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
			this.loop();
		}
	},
	unfocus: function() {
		if (this.active === true) {
			this.active = false;
			document.body._delClass('canvasloth-focus');
			this.container._delClass('canvasloth-active');
			this.resetKeyboard();
			this.stop();
		}
	},
	render: function() {
		var ctx = this.ctx;
		ctx.clearRect(0, 0, this.width(), this.height());
		ctx.save();
			ctx.translate(this.vectView.x, this.vectView.y);
				this.app.render(ctx);
		ctx.restore();
	},
	loop: function() {
		var self = this;
		this.intervId = setInterval(function() {
			if (self.active) {
				self.time.update();
				self.app.update(self.time);
				self.render();
			}
		}, 1000 / this.fps);
	},
	stop: function() {
		clearInterval(this.intervId);
	},
	getView: function()     { return this.vectView      },
	setView: function(x, y) { this.vectView.setF(x, y) }
};
