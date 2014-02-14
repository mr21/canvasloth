function Canvasloth(container, images, fns) {
	this.canvas = document.createElement('canvas');
	container.appendChild(this.canvas);
	this.catchMouse = document.createElement('div');
	this.catchMouse.className = 'canvasloth-mouse';
	container.appendChild(this.catchMouse);
	this.container = container;
	this.ctx       = this.canvas.getContext('2d');
	this.fns       = fns;
	this.time      = new Time();
	this.assets    = new Assets(this, images);
	this.vectView  = new Vector2D(0, 0);
	this.keyBool   = [];
	// active/inactive
	var self = this;
	this.active = false;
	window  ._addEvent('blur',      function() { self.unfocus() });
	document._addEvent('mousedown', function() { self.unfocus() });
	// create DOM pages
	this.pageCurr = null;
	this.pageCurrNoCross = null;
	this.domA_cross = document.createElement('a');
	this.domA_cross.href      = '#';
	this.domA_cross.className = 'canvasloth-cross';
	this.domA_cross.onclick   = function() { return self.closePage(true), false };
	container.insertBefore(this.domA_cross, this.canvas);
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
	debug: function(state) {
		this.assets.debug(state);
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
	getPageCurrent: function() { return this.pageCurr },
	openPage: function(page) {
		if (page !== this.pageCurr) {
			this.closePage(false);
			var obj = [
				{css:'margin-left', val:'0%'},
				{css:'opacity',     val:'1',   dur:250},
				{css:'top',         val:'0px', mov:'easeIn'}
			];
			if (!page._hasClass('canvasloth-nocross'))
				obj.push({elm:this.domA_cross, css:'top', val:'5px', del:250});
			else
				this.pageCurrNoCross = page;
			this.page_animId = page._cssAnim.apply(page, obj);
			this.pageCurr = page;
			this.unfocus();
		}
	},
	closePage: function(byCross) {
		if (this.pageCurr !== null) {
			document._cssAnimPause(this.page_animId);
			this.page_animId = this.pageCurr._cssAnim(
				{css:'opacity',     val:'0',     dur:250},
				{css:'top',         val:'-50px', mov:'easeIn'},
				{css:'margin-left', val:'100%',  dur:0, del:250},
				{elm:this.domA_cross, css:'top', val:'-32px', dur:250, del:0}
			);
			this.pageCurr = null;
			if (byCross === undefined) {
				this.pageCurrNoCross = null;
			} else if (byCross === true) {
				if (this.pageCurrNoCross === null)
					this.focus();
				else
					this.openPage(this.pageCurrNoCross);
			}
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
