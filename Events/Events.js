Canvasloth.Events = function(canvasloth) {
	this.canvasloth = canvasloth;
};

Canvasloth.Events.TYPE_EVENTS = [
	'ready', 'update', 'render',
	'keydown', 'keyup',
	'mousedown', 'mouseup', 'mousemove', 'mousewheel'
];

Canvasloth.Events.prototype = {
	init: function(fn) {
		this.fn = {
			'ready'      : [],
			'update'     : [],
			'render'     : [],
			'keydown'    : [],
			'keyup'      : [],
			'mousedown'  : [],
			'mouseup'    : [],
			'mousemove'  : [],
			'mousewheel' : []
		};
		for (var e in fn)
			if (typeof fn[e] === 'function')
				this.add(e, this.canvasloth.app, fn[e]);
			else if (fn[e].push !== undefined)
				for (var i = 0; i < fn[e].length; ++i)
					this.add(e, this.canvasloth.app, fn[e][i]);
		this.attach();
	},
	add: function(event, app, fn) {
		var cb = {
			self : app,
			fn   : fn
		};
		this.fn[event].push(cb);
		return cb;
	},
	del: function(event, cb) {
		var arr = this.fn[event];
		for (var i = 0; i < arr.length; ++i)
			if (cb === arr[i]) {
				this.fn[event].splice(i, 1);
				return;
			}
	},
	call: function(event, params) {
		var i = 0, f, arr = this.fn[event],
			applyCall = params.push !== undefined
				? 'apply'
				: 'call';
		for (; cb = arr[i]; ++i)
			cb.fn[applyCall](cb.self, params);
	},
	// attachEvent
	attach: function() {
		var t = this,
		    c = t.canvasloth,
		    catchMouse = c.canvas.catchMouse;
		// Window
		document._addEvent('mousedown', function() { c.unfocus(); });
		window._addEvent('blur', function() { c.unfocus(); });
		window._addEvent('resize', function() { c.ctx.resize(); c.render(); });
		// Keyboard
		document._addEvent('keydown', function(e) {
			if (c.active && !c.keyBool[e.keyCode]) {
				e.preventDefault();
				c.keyBool[e = e.keyCode] = true;
				t.call('keydown', e);
			}
		});
		document._addEvent('keyup', function(e) {
			if (c.active && c.keyBool[e.keyCode]) {
				e.preventDefault();
				c.keyBool[e = e.keyCode] = false;
				t.call('keyup', e);
			}
		});
		document._addEvent('mouseup', function(e) {
			if (c.active && c.btnBool[e = e.button]) {
				c.btnBool[e] = false;
				t.call('mouseup', e);
			}
		});

		var cam = c.getCtx().V2cam || {x:0, y:0}; // tmp
		catchMouse._addEvent('mousedown', function(e) {
			if (c.active && !c.btnBool[e.button]) {
				e.preventDefault();
				c.btnBool[e.button] = true;
				t.call('mousedown', [
					e.button,
					e.layerX - cam.x,
					e.layerY - cam.y
				]);
			}
			c.focus(e);
		});
		catchMouse._addEvent('mouseup', function(e) {
			if (c.active && c.btnBool[e.button]) {
				c.btnBool[e.button] = false;
				t.call('mouseup', [
					e.button,
					e.layerX - cam.x,
					e.layerY - cam.y
				]);
			}
		});
		catchMouse._addEvent('mousemove', function(e) {
			if (c.active) {
				t.call('mousemove', [
					e.layerX - cam.x,
					e.layerY - cam.y,
					offsetMouse.xRel,
					offsetMouse.yRel
				]);
			}
		});
		catchMouse._addEvent('wheel', function(e) {
			if (c.active)
				t.call('mousewheel', e.deltaY);
		});
	}
};
