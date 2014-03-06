function Canvasloth(ctxType, container, app, images) {
	this.app = app;
	this.container = container;
	this.canvas = new Canvasloth.Canvas(this, container);
	this.ctx = new Canvasloth['Ctx' + ctxType.toUpperCase()](this.canvas, container);
	this.fps = 40;
	this.keyBool = [];
	this.btnBool = [];
	this.active = false;
	this.time = new Canvasloth.Time();
	this.pages = new Canvasloth.Pages(this);
	this.assets = new Canvasloth.Assets(this.getCtx(), this.time);
	var self = this;
	this.assets.images.load(images, function() { self.ready(); });
}

// Defines
Canvasloth.LEFT_BUTTON   = 0;
Canvasloth.MIDDLE_BUTTON = 1;
Canvasloth.RIGHT_BUTTON  = 2;

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
					t.keyBool[e = e.keyCode] = true;
					t.app.keydown.call(t.app, e);
				}
			});
		if (t.app.keyup)
			document._addEvent('keyup', function(e) {
				if (t.active && t.keyBool[e.keyCode]) {
					e.preventDefault();
					t.keyBool[e = e.keyCode] = false;
					t.app.keyup.call(t.app, e);
				}
			});
		document._addEvent('mouseup', function(e) {
			if (t.active && t.btnBool[e.button]) {
				t.btnBool[e.button] = false;
				t.app.mouseup.call(t.app, e.button, 0, 0);
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
	getCtx: function() { return this.ctx.ctx; },
	cursor: function(c) { this.canvas.cursor(c); },
	width:  function() { return this.canvas.width();  },
	height: function() { return this.canvas.height(); },
	resetKeyboard: function() {
		for (var i in this.keyBool)
			if (this.keyBool[i = parseInt(i)]) {
				if (this.app.keyup)
					this.app.keyup.call(this.app, i);
				this.keyBool[i] = false;
			}
		for (var i in this.btnBool)
			if (this.btnBool[i = parseInt(i)]) {
				if (this.app.mouseup)
					this.app.mouseup.call(this.app, i, 0, 0);
				this.btnBool[i] = false;
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
