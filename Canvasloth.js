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
		this.ctx3d = new Canvasloth.Ctx3D(container, this.ctx);
	this.assets.images.load(images, function() { self.ready(); });
}

Canvasloth.prototype = {
	setEvents: function() {
		var t = this;
		// Window
		document._addEvent('mousedown', function() { t.unfocus(); });
		window._addEvent('blur', function() { t.unfocus(); });
		window._addEvent('resize', function() { t.updateResolution(); t.render(); });
		// Keyboard
		if (t.app.keydown)
			document._addEvent('keydown', function(e) {
				if (t.active && !t.keyBool[e.keyCode]) {
					e.preventDefault();
					t.keyBool[e = e.keyCode] = 1;
					t.app.keydown.call(t.app, e);
				}
			});
		if (t.app.keyup)
			document._addEvent('keyup', function(e) {
				if (t.active &&  t.keyBool[e.keyCode]) {
					e.preventDefault();
					t.keyBool[e = e.keyCode] = 0;
					t.app.keyup.call(t.app, e);
				}
			});
		// Mouse
		if (t.app.mousedown)
			t.catchMouse._addEvent('mousedown', function(e) {
				if (t.active)
					t.app.mousedown.call(t.app,
						e.layerX - t.vectView.x,
						e.layerY - t.vectView.y
					);
				t.focus(e);
			});
		if (t.app.mouseup)
			t.catchMouse._addEvent('mouseup', function(e) {
				if (t.active)
					t.app.mouseup.call(t.app,
						e.layerX - t.vectView.x,
						e.layerY - t.vectView.y
					);
			});
		if (t.app.mousemove)
			t.catchMouse._addEvent('mousemove', function(e) {
				if (t.active)
					t.app.mousemove.call(t.app,
						e.layerX - t.vectView.x,
						e.layerY - t.vectView.y,
						offsetMouse.xRel,
						offsetMouse.yRel
					);
			});
	},
	ready: function() {
		this.setEvents();
		this.updateResolution();
		this.clearScreen(true);
		this.renderScreen(true);
		if (this.app.ready)
			this.app.ready();
		this.time.reset();
		this.focus();
	},
	cursor: function(c) { this.catchMouse.style.cursor = c; },
	width:  function() { return this.canvas.width;  },
	height: function() { return this.canvas.height; },
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
	clearScreen: function(state) {
		var t = this, c = t.ctx;
		t.clearScreenFn = !state
			? function() {}
			: t.ctxType === '2d'
				? function() { c.clearRect(0, 0, t.width(), t.height()); }
				: function() { c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT | c.STENCIL_BUFFER_BIT); }
		;
	},
	renderScreen: function(state) {
		var t = this, c = t.ctx;
		t.renderScreenFn = !state
			? function() {}
			: t.ctxType === '3d'
				? function() { t.app.render(c); }
				: function() {
					c.save();
						c.translate(t.vectView.x, t.vectView.y);
							t.app.render(c);
					c.restore();
				}
		;
	},
	render: function() {
		var ctx = this.ctx;
		this.clearScreenFn();
		this.renderScreenFn();
	},
	update: function() {
		this.time.update();
		this.app.update(this.time);
	},
	loop: function() {
		var t = this;
		t.intervId = setInterval(function() {
			t.update();
			t.render();
		}, 1000 / t.fps);
	},
	stop: function() { clearInterval(this.intervId); },
	getView: function() { return this.vectView; },
	setView: function(x, y) { this.vectView.setF(x, y); }
};
