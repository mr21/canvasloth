function Canvasloth(p) {

	this.app = p.app;
	this.container = p.node;
	this.Times();
	this.Events();
	this.Canvas();
	this.Pages();
	this.Images();
	var type = p.type.toUpperCase();

	if (type === '3D') {
	    var gl = this.ctx = this.gl =
			this.canvas.getContext('webgl') ||
			this.canvas.getContext('experimental-webgl');
	}

	this.webgl = new WebGL(gl);

	this['Ctx'    + type]();
	this['Camera' + type]();
	if (type === '2D') {
		this.Matrix2D();
		this.Sprites2D();
		this.Anims2D();
	} else {
		this.Lights3D();
		this.Primitives3D();
		this.Grid3D();
		this.CubeMap3D();
	}
	this.events.init(p.fn);
	this.fps = 40;
	this.keyBool = [];
	this.btnBool = [];
	this.active = false;
	var self = this;
	this.images.load(p.images, function() { self.ready(); });
}

// Defines
Canvasloth.LEFT_BUTTON   = 0;
Canvasloth.MIDDLE_BUTTON = 1;
Canvasloth.RIGHT_BUTTON  = 2;
Canvasloth.CENTER = 1000000000; // ne pas utiliser les operateurs bit a bit ici (cf.: Sprites2D.js)
Canvasloth.LEFT   = 2000000000;
Canvasloth.RIGHT  = 3000000000;
Canvasloth.TOP    = 4000000000;
Canvasloth.BOTTOM = 5000000000;

Canvasloth.prototype = {
	ready: function() {
		this.ctx.resize();
		this.focus();
		this.pages.open();
		this.events.exec('ready', this);
		this.times.reset();
	},
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
			this.times.update();
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
		this.times.update();
		this.events.exec('update', this);
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
