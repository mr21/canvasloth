function Canvasloth(container, app, images) {
	var self = this;
	this.app = app;
	this.canvas = document.createElement('canvas');
	container.appendChild(this.canvas);
	this.catchMouse = document.createElement('div');
	this.catchMouse.className = 'canvasloth-mouse';
	container.appendChild(this.catchMouse);
	this.ctx = this.canvas.getContext('2d');
	this.container = container;
	this.keyBool = [];
	this.active = false;
	window._addEvent('blur', function() { self.unfocus() });
	document._addEvent('mousedown', function() { self.unfocus() });
	this.vectView = new Vector2D(0, 0);
	this.time = new Time();
	this.pages = new Canvasloth.Pages(this);
	this.assets = new Canvasloth.Assets(this.ctx, this.time);
	this.assets.images.load(images, function() { self.launch() });
}

Canvasloth.prototype = {
	setEvents: function() {
		var self = this;
		// Window
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
	launch: function() {
		var self = this;
		this.setEvents();
		this.updateResolution();
		if (this.app.ready)
			this.app.ready();
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
				this.app.render(ctx);
		ctx.restore();
	},
	loop: function() {
		if (this.active) {
			this.time.update();
			this.app.update(this.time);
			this.render();
		}
	},
	stop: function() {
		window.clearInterval(this.intervId);
	},
	getView: function()     { return this.vectView      },
	setView: function(x, y) { this.vectView.setXY(x, y) }
};
