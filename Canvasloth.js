function Canvasloth(p) {
	this.app = p.app;
	this.container = p.node;
	this.events = new Canvasloth.Events(this);
	this.canvas = new Canvasloth.Canvas(this, p.node);
	this.ctx = new Canvasloth['Ctx' + p.type.toUpperCase()](this, p.node);
	this.events.init(p.fn);
	this.fps = 40;
	this.keyBool = [];
	this.btnBool = [];
	this.active = false;
	this.time = new Canvasloth.Time();
	this.pages = new Canvasloth.Pages(this, p.node);
	this.assets = new Canvasloth.Assets(this.getCtx(), this.time);
	var self = this;
	this.assets.images.load(p.images, function() { self.ready(); });
}

// Defines
Canvasloth.LEFT_BUTTON   = 0;
Canvasloth.MIDDLE_BUTTON = 1;
Canvasloth.RIGHT_BUTTON  = 2;

Canvasloth.prototype = {
	ready: function() {
		this.ctx.resize();
		this.focus();
		this.pages.open();
		this.events.call('ready', this);
		this.time.reset();
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
		this.events.call('update', this.time);
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
