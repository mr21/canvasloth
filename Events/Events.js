Canvasloth.prototype.Events = function() {
	var cnv = this;
	this.events = {
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
					this.add(e, cnv.app, fn[e]);
				else if (fn[e].push !== undefined)
					for (var i = 0; i < fn[e].length; ++i)
						this.add(e, cnv.app, fn[e][i]);
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
		exec: function(event, params) {
			var i = 0, f, arr = this.fn[event],
				applyCall = params.push !== undefined
					? 'apply'
					: 'call';
			for (; cb = arr[i]; ++i)
				cb.fn[applyCall](cb.self, params);
		},
		attach: function() {
			var t = this,
			    catchMouse = cnv.canvas.catchMouse;
			// Window
			document._addEvent('mousedown', function() { cnv.unfocus(); });
			window._addEvent('blur', function() { cnv.unfocus(); });
			window._addEvent('resize', function() { cnv.ctx.resize(); cnv.render(); });
			// Keyboard
			document._addEvent('keydown', function(e) {
				if (cnv.active && !cnv.keyBool[e.keyCode]) {
					e.preventDefault();
					cnv.keyBool[e = e.keyCode] = true;
					t.exec('keydown', e);
				}
			});
			document._addEvent('keyup', function(e) {
				if (cnv.active && cnv.keyBool[e.keyCode]) {
					e.preventDefault();
					cnv.keyBool[e = e.keyCode] = false;
					t.exec('keyup', e);
				}
			});
			document._addEvent('mouseup', function(e) {
				if (cnv.active && cnv.btnBool[e = e.button]) {
					cnv.btnBool[e] = false;
					t.exec('mouseup', e);
				}
			});

			var cam = cnv.getCtx().V2cam || {x:0, y:0}; // tmp
			catchMouse._addEvent('mousedown', function(e) {
				if (cnv.active && !cnv.btnBool[e.button]) {
					e.preventDefault();
					cnv.btnBool[e.button] = true;
					t.exec('mousedown', [
						e.button,
						e.layerX - cam.x,
						e.layerY - cam.y
					]);
				}
				cnv.focus(e);
			});
			catchMouse._addEvent('mouseup', function(e) {
				if (cnv.active && cnv.btnBool[e.button]) {
					cnv.btnBool[e.button] = false;
					t.exec('mouseup', [
						e.button,
						e.layerX - cam.x,
						e.layerY - cam.y
					]);
				}
			});
			catchMouse._addEvent('mousemove', function(e) {
				if (cnv.active) {
					t.exec('mousemove', [
						e.layerX - cam.x,
						e.layerY - cam.y,
						offsetMouse.xRel,
						offsetMouse.yRel
					]);
				}
			});
			catchMouse._addEvent('wheel', function(e) {
				if (cnv.active)
					t.exec('mousewheel', e.deltaY);
			});
		}
	};
};
