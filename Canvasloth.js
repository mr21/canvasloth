function Canvasloth(ctxType, container, app, images) {
	this.app = app;
	this.container = container;
	this.canvas = new Canvasloth.Canvas(container);
	this.ctx = new Canvasloth['Ctx' + ctxType.toUpperCase()](this.canvas, container);
	this.catchMouse = document.createElement('div');
	this.catchMouse.className = 'canvasloth-mouse';
	container.appendChild(this.catchMouse);
	this.fps = 40;
	this.keyBool = [];
	this.active = false;
	this.time = new Canvasloth.Time();
	this.pages = new Canvasloth.Pages(this);
	this.assets = new Canvasloth.Assets(this.getCtx(), this.time);
	var self = this;
	this.assets.images.load(images, function() { self.ready(); });
}

Canvasloth.prototype = {
	setEvents: function() {
		var t = this;
		// Window
		document._addEvent('mousedown', function() { t.unfocus(); });
		window._addEvent('blur', function() { t.unfocus(); });
		window._addEvent('resize', function() { t.ctx.resize(); t.render(); });
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
				if (t.active && t.keyBool[e.keyCode]) {
					e.preventDefault();
					t.keyBool[e = e.keyCode] = 0;
					t.app.keyup.call(t.app, e);
				}
			});
		// Mouse
		if (t.app.mousedown)
			t.catchMouse._addEvent('mousedown', function(e) {
				if (t.active) {
					var cam = t.ctx.camV2; // tmp
					t.app.mousedown.call(t.app,
						e.layerX - cam.x,
						e.layerY - cam.y
					);
				}
				t.focus(e);
			});
		if (t.app.mouseup)
			t.catchMouse._addEvent('mouseup', function(e) {
				if (t.active) {
					var cam = t.ctx.camV2; // tmp
					t.app.mouseup.call(t.app,
						e.layerX - cam.x,
						e.layerY - cam.y
					);
				}
			});
		if (t.app.mousemove)
			t.catchMouse._addEvent('mousemove', function(e) {
				if (t.active) {
					var cam = t.ctx.camV2; // tmp
					t.app.mousemove.call(t.app,
						e.layerX - cam.x,
						e.layerY - cam.y,
						offsetMouse.xRel,
						offsetMouse.yRel
					);
				}
			});
	},
	ready: function() {
		this.setEvents();
		this.ctx.resize();
		if (this.app.ready)
			this.app.ready(this);
		this.time.reset();
		this.focus();
	},
	lookAt: function() { this.ctx.lookAt.apply(this.ctx, arguments); },
	getCtx: function() { return this.ctx.ctx; },
	cursor: function(c) { this.catchMouse.style.cursor = c; },
	width:  function() { return this.canvas.width();  },
	height: function() { return this.canvas.height(); },
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
		this.ctx.render(this.app);
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
	stop: function() { clearInterval(this.intervId); }
};
