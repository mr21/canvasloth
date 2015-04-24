/*
	Canvasloth - 1.10
	https://github.com/Mr21/Canvasloth
*/

"use strict";

function Canvasloth(p) {
	var
		d = document,
		that = this,
		// utils
		attachEvent = function(e, v, f) {
			if (e.addEventListener)
				e.addEventListener(v, f, false);
			else
				e.attachEvent("on" + v, f);
		},
		// attr
		startTime = 0,
		currentOldTime = 0,
		currentTime = 0,
		fps = p.fps
			? 1000 / p.fps
			: 1000 / 60
	;

	this.container = p.container.nodeType === Node.ELEMENT_NODE
		? p.container
		: p.container[0];

	this.resetTime = function() { startTime = currentTime; };
	this.totalTime = function() { return currentTime - startTime; };
	this.frameTime = function() { return currentTime - currentOldTime; };

	// assets
	var	nl_img,
		nl_audio;
	(function() {

		function getAsset(arr, name) {
			for (var i = 0, e; e = arr[i]; ++i)
				if (e.src.lastIndexOf(name) === e.src.length - name.length)
					return e;
			console.error('Canvasloth: "'+name+'" not found.');
		}

		that.image = function(name) { return getAsset(nl_img, name); };
		that.audio = function(name) { return getAsset(nl_audio, name); };
		that.file = function(name) { return that.image(name) || that.audio(name); };

	})();

	// dom
	var	el_ctn,
		el_vp,
		el_cnv,
		el_hudBelow,
		el_hudAbove,
		el_evt;
	(function () {

		// container
		el_ctn = that.container;
		if (el_ctn.className.indexOf("canvasloth") === -1)
			el_ctn.className += " canvasloth";

		// viewport
		el_vp = d.createElement("div");
		el_ctn.appendChild(el_vp);

		// assets
		var el_ast = el_ctn.querySelector(".canvasloth-assets");
		if (!el_ast) {
			el_ast = d.createElement("div");
			el_ast.className = "canvasloth-assets";
		}
		el_vp.appendChild(el_ast);
		nl_img = el_ast.getElementsByTagName("img");
		nl_audio = el_ast.getElementsByTagName("audio");

		// canvas
		el_cnv = d.createElement("canvas");
		el_vp.appendChild(el_cnv);

		// huds
		el_hudBelow = el_ctn.querySelector(".canvasloth-hud-below");
		el_hudAbove = el_ctn.querySelector(".canvasloth-hud-above");
		if (!el_hudBelow) {
			el_hudBelow = d.createElement("div");
			el_hudBelow.className = "canvasloth-hud-below";
		}
		if (!el_hudAbove) {
			el_hudAbove = d.createElement("div");
			el_hudAbove.className = "canvasloth-hud-above";
		}
		el_vp.appendChild(el_hudBelow);
		el_vp.appendChild(el_hudAbove);

		// events
		el_evt = d.createElement("div");
		el_evt.tabIndex = 0;
		el_evt.className = "canvasloth-events";
		el_hudAbove.insertBefore(el_evt, el_hudAbove.firstChild);

	})();

	// context
	var	ctx;
	(function () {

		ctx = p.context === "2d"
			? el_cnv.getContext("2d")
			: (
				el_cnv.getContext("webgl") ||
				el_cnv.getContext("experimental-webgl")
			);

	})();

	// viewport
	var zoom = 1;
	(function() {

		var	ratio, width, height,
			isFullscreen = false,
			el_initialParent = el_ctn.parentNode;

		el_cnv.width  = el_ctn.clientWidth;
		el_cnv.height = el_ctn.clientHeight;

		function setViewport(fscr) {
			var	img = new Image(),
				top, left,
				bw, bh,
				vw, vh,
				w, h;
			if (!fscr) {
				vw = width;
				vh = height;
				top = left = 0;
				zoom = 1;
			} else {
				bw = d.body.clientWidth;
				bh = d.body.clientHeight;
				if (ratio < bw / bh) { // screen larger
					vw = bh / height * width;
					vh = bh;
				} else {
					vw = bw;
					vh = bw / width * height;
				}
				top  = (bh - vh) / 2 + "px";
				left = (bw - vw) / 2 + "px";
				zoom = vw / width;
			}
			el_vp.style.top  = top;
			el_vp.style.left = left;
			el_vp.style.width  = vw + "px";
			el_vp.style.height = vh + "px";
			// el_hudBelow.style.transform =
			// el_hudAbove.style.transform = "scale(" + zoom + ")";
			el_hudBelow.style.zoom =
			el_hudAbove.style.zoom = zoom;
			img.src = ctx.canvas.toDataURL();
			el_cnv.width  = vw;
			el_cnv.height = vh;
			ctx.drawImage(img, 0, 0, vw, vh);
			ctx.scale(zoom, zoom);
		}

		function fullscreen(e, b) {
			switch (b) {
				case true:
					     if (e      .requestFullscreen) e      .requestFullscreen();
					else if (e   .mozRequestFullScreen) e   .mozRequestFullScreen();
					else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
				break;
				case false:
					     if (d.      cancelFullscreen) d.      cancelFullscreen();
					else if (d.   mozCancelFullScreen) d.   mozCancelFullScreen();
					else if (d.webkitCancelFullScreen) d.webkitCancelFullScreen();
				break;
				default:
					return (
						d      .msFullscreenElement === null ||
						d     .mozFullScreen === false ||
						d.webkitIsFullScreen === false
					);
			}
		}

		attachEvent(window, "resize", function() {
			if (isFullscreen)
				setViewport(true);
		});

		that.getWidth  = function() { return el_cnv.width  / zoom; }
		that.getHeight = function() { return el_cnv.height / zoom; }
		that.getZoom   = function() { return zoom; }

		that.fullscreen = function(b) {
			if (!isFullscreen && b) {
				width  = el_ctn.clientWidth;
				height = el_ctn.clientHeight;
				ratio = width / height;
			}
			isFullscreen = b = b || false;
			fullscreen(el_ctn, b);
			setViewport(b);
			el_evt.focus();
			return that;
		};

		that.toggleFullscreen = function() {
			return that.fullscreen(!isFullscreen);
		};

		// catch the escape to exit the fullscreen mode
		function fsChange() {
			if (fullscreen())
				that.fullscreen(false);
		}
		attachEvent(d,       "fullscreenchange", fsChange);
		attachEvent(d,    "mozfullscreenchange", fsChange);
		attachEvent(d, "webkitfullscreenchange", fsChange);

	})();

	// callbacks
	var	fn_events = [],
		fn_loop;
	(function() {

		el_ctn.oncontextmenu = function() { return false; };

		that.events = function(ev, fn) {
			ev = ev.toLowerCase();
			if (ev === "click")
				return console.error('Canvasloth: use the event "mouseup" instead of "click".');
			else if (ev === "keypress")
				return console.error('Canvasloth: use the event "keyup" instead of "keypress".');
			fn_events[ev] = fn;
			return that;
		};

		var noop = function() {};

		fn_loop = p.loop || noop;

		that.events("focus",      noop);
		that.events("blur",       noop);
		that.events("keydown",    noop);
		that.events("keyup",      noop);
		that.events("mousedown",  noop);
		that.events("mouseup",    noop);
		that.events("mousemove",  noop);
		that.events("wheel",      noop);
		that.events("touchstart", noop);
		that.events("touchend",   noop);
		that.events("touchmove",  noop);

		for (var ev in p.events)
			that.events(ev, p.events[ev]);

	})();

	// focus / blur
	var isFocused = false;
	(function() {

		attachEvent(el_evt, "focus", function() {
			isFocused = true;
			el_ctn.className += " canvasloth-focus";
			fn_events.focus.call(p.thisApp);
		});
		
		attachEvent(el_evt, "blur", function() {
			if (isFocused) {
				isFocused = false;
				el_ctn.className = el_ctn.className.replace(/ canvasloth-focus/g, "");
				for (var i in ar_keys)
					if (ar_keys[i = parseInt(i)]) {
						fn_events.keyup.call(p.thisApp, {
							key: i
						});
						ar_keys[i] = false;
					}
				if (!p.autoFocus)
					el_evt.blur();
				fn_events.blur.call(p.thisApp);
			}
		});

	})();

	// keyboard
	var ar_keys = [];
	(function() {

		that.key = function(k) { return ar_keys[k]; };

		attachEvent(el_evt, "keydown", function(e) {
			e.preventDefault();
			if (!ar_keys[e.keyCode]) {
				ar_keys[e.keyCode] = true;
				fn_events.keydown.call(p.thisApp, {
					key: e.keyCode
				});
			}
		});

		attachEvent(el_evt, "keyup", function(e) {
			if (ar_keys[e.keyCode]) {
				ar_keys[e.keyCode] = false;
				fn_events.keyup.call(p.thisApp, {
					key: e.keyCode
				});
			}
		});

	})();

	// mouse
	(function() {

		var	xold, yold,
			mouseButtonsStatus = [];

		function getX(e) { return Math.round(e.layerX / zoom); }
		function getY(e) { return Math.round(e.layerY / zoom); }

		function event_mousemove(e) {
			var	x = getX(e),
				y = getY(e);
			fn_events.mousemove.call(p.thisApp, {
				x: x,
				y: y,
				rx: x - xold,
				ry: y - yold
			});
			xold = x;
			yold = y;
		}

		attachEvent(el_evt, "mouseover", function(e) {
			xold = getX(e);
			yold = getY(e);
		});

		attachEvent(el_evt, "mousemove", event_mousemove);

		attachEvent(el_evt, "mousedown", function(e) {
			mouseButtonsStatus[e.button] = 1;
			if (!isFocused)
				el_evt.focus();
			fn_events.mousedown.call(p.thisApp, {
				x: getX(e),
				y: getY(e),
				button: e.button
			});
			event_mousemove(e);
		});

		attachEvent(el_evt, "mouseup", function(e) {
			if (mouseButtonsStatus[e.button] === 1) {
				mouseButtonsStatus[e.button] = 2;
				fn_events.mouseup.call(p.thisApp, {
					x: getX(e),
					y: getY(e),
					button: e.button
				});
			}
		});

		attachEvent(el_evt, "wheel", function(e) {
			e.preventDefault();
			fn_events.wheel.call(p.thisApp, {
				x: getX(e),
				y: getY(e),
				rx: (e.webkitMovementX !== undefined ? e.deltaX / 100 : e.deltaX) / zoom,
				ry: (e.webkitMovementY !== undefined ? e.deltaY / 100 : e.deltaY) / zoom
			});
		});

		attachEvent(window, "mouseup", function(e) {
			if (mouseButtonsStatus[e.button] === 1) {
				mouseButtonsStatus[e.button] = 0;
				fn_events.mouseup.call(p.thisApp, {
					x: 0,
					y: 0,
					button: e.button
				});
			}
		});

		attachEvent(el_hudAbove, "mousedown", function(e) {
			e.preventDefault();
			if (!isFocused)
				el_evt.focus();
		});

	})();

	// multi-touch
	(function() {

		var touches = {};

		function calcX(t, rc) { return Math.round((t.pageX - rc.left - window.scrollX) / zoom); }
		function calcY(t, rc) { return Math.round((t.pageY - rc.top  - window.scrollY) / zoom); }

		attachEvent(el_evt, "touchstart", function(e) {
			var	id, t, to, i = 0,
				rc = el_vp.getBoundingClientRect();
			e.preventDefault();
			for (; t = e.changedTouches[i]; ++i)
				if (!touches[id = t.identifier]) {
					to = touches[id] = {};
					to.x = to.xold = calcX(t, rc);
					to.y = to.yold = calcY(t, rc);
					fn_events.touchstart.call(p.thisApp, {
						id: id,
						x: to.x,
						y: to.y,
						force: t.force,
						radiusX: t.radiusX,
						radiusY: t.radiusY
					});
					fn_events.touchmove.call(p.thisApp, {
						id: id,
						x: to.x,
						y: to.y,
						rx: 0,
						ry: 0,
						force: t.force,
						radiusX: t.radiusX,
						radiusY: t.radiusY
					});
				}
		});

		attachEvent(el_evt, "touchmove", function(e) {
			var	id, t, to, i = 0, x, y,
				rc = el_vp.getBoundingClientRect();
			e.preventDefault();
			for (; t = e.changedTouches[i]; ++i) {
				to = touches[id = t.identifier];
				x = calcX(t, rc);
				y = calcY(t, rc);
				fn_events.touchmove.call(p.thisApp, {
					id: id,
					x: x,
					y: y,
					rx: x - to.xold,
					ry: y - to.yold,
					force: t.force,
					radiusX: t.radiusX,
					radiusY: t.radiusY
				});
				to.x = to.xold = x;
				to.y = to.yold = y;
			}
		});

		attachEvent(window, "touchend", function(e) {
			var	id, t, to, i = 0;
			for (; t = e.changedTouches[i]; ++i)
				if (to = touches[id = t.identifier]) {
					fn_events.touchend.call(p.thisApp, {
						id: id,
						x: to.x,
						y: to.y
					});
					delete touches[id];
				}
		});

	})();

	// load & go
	(function() {

		var	nbElementsToLoad = 1;

		function startLooping() {
			setInterval(function() {
				currentOldTime = currentTime;
				currentTime = new Date().getTime() / 1000;
				fn_loop.call(p.thisApp);
			}, fps);
		}

		function loaded() {
			if (!--nbElementsToLoad) {
				currentTime =
				startTime = new Date().getTime() / 1000;
				if (p.ready)
					p.ready.call(p.thisApp, {
						canvasloth: that,
						ctx: ctx
					});
				if (p.autoFocus)
					el_evt.focus();
				currentTime = new Date().getTime() / 1000;
				startLooping();
			}
		}

		if (p.ready) {
			for (var i = 0, img; img = nl_img[i]; ++i)
				if (!img.complete) {
					++nbElementsToLoad;
					img.onload = function() {
						loaded();
					};
				}
			for (var i = 0, audio; audio = nl_audio[i]; ++i)
				if (audio.readyState !== audio.HAVE_ENOUGH_DATA) {
					++nbElementsToLoad;
					audio.oncanplaythrough = function() {
						loaded();
					};
				}
		}

		loaded();

	})();

}
