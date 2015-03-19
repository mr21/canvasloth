/*
	Canvasloth - 1.5
	https://github.com/Mr21/Canvasloth
*/

"use strict";

function Canvasloth(p) {
	var
		that = this,
		// utils
		noop = function() {},
		attachEvent = function(e, v, f) {
			if (e.addEventListener)
				e.addEventListener(v, f, false);
			else
				e.attachEvent("on" + v, f);
		},
		// attr
		ctx,
		el_ctn,
		el_cnv,
		el_hudAbove,
		el_evt,
		nl_img,
		nl_audio,
		ar_keys = [],
		isFocused = false,
		fn_events = [],
		fn_loop = p.loop || noop,
		startTime = 0,
		currentOldTime = 0,
		currentTime = 0,
		fps = p.fps
			? 1000 / p.fps
			: 1000 / 60;

	this.container = p.container.nodeType === Node.ELEMENT_NODE
		? p.container
		: p.container[0];

	this.key = function(k) { return ar_keys[k]; };
	this.resetTime = function() { startTime = currentTime; };
	this.totalTime = function() { return currentTime - startTime; };
	this.frameTime = function() { return currentTime - currentOldTime; };

	this.refreshViewportSize = function() {
		el_cnv.width  = el_cnv.clientWidth;
		el_cnv.height = el_cnv.clientHeight;
		return that;
	};

	function getAsset(arr, name) {
		for (var i = 0, e; e = arr[i]; ++i)
			if (e.src.lastIndexOf(name) === e.src.length - name.length)
				return e;
		console.error('Canvasloth: "'+name+'" not found.');
	}
	this.image = function(name) { return getAsset(nl_img, name); };
	this.audio = function(name) { return getAsset(nl_audio, name); };
	this.file = function(name) { return this.image(name) || this.audio(name); };

	// dom
	(function () {

		var el_ast;

		el_ctn = that.container;
		el_ast = el_ctn.querySelector(".canvasloth-assets");
		el_hudAbove = el_ctn.querySelector(".canvasloth-hud-above");
		el_cnv = document.createElement("canvas");
		el_evt = document.createElement("div");
		if (!el_ast) {
			el_ast = document.createElement("div");
			el_ast.className = "canvasloth-assets";
			el_ctn.appendChild(el_ast);
		}
		nl_img = el_ast.getElementsByTagName("img");
		nl_audio = el_ast.getElementsByTagName("audio");
		if (el_ctn.className.indexOf("canvasloth") === -1)
			el_ctn.className += " canvasloth";
		el_evt.tabIndex = 0;
		el_evt.className = "canvasloth-events";
		el_ctn.appendChild(el_cnv);
		if (!el_hudAbove) {
			el_hudAbove = document.createElement("div");
			el_hudAbove.className = "canvasloth-hud-above";
			el_ctn.appendChild(el_hudAbove);
		}
		el_hudAbove.insertBefore(el_evt, el_hudAbove.firstChild);
		ctx = p.context === "2d"
			? el_cnv.getContext("2d")
			: (
				el_cnv.getContext("webgl") ||
				el_cnv.getContext("experimental-webgl")
			);

	})();

	this.refreshViewportSize();
	setEvents();

	// callbacks
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

	// touchscreen
	(function() {

		var touches = {};

		attachEvent(el_evt, "touchstart", function(e) {
			var	id, t, to, i = 0,
				rc = el_evt.getBoundingClientRect();
			e.preventDefault();
			for (; t = e.changedTouches[i]; ++i)
				if (!touches[id = t.identifier]) {
					to = touches[id] = {
						x: t.pageX - rc.left - window.scrollX,
						y: t.pageY - rc.top  - window.scrollY
					};
					fn_events.touchstart.call(p.thisApp, id, to.x, to.y);
				}
		});

		attachEvent(el_evt, "touchmove", function(e) {
			var	t, to, i = 0,
				rc = el_evt.getBoundingClientRect();
			e.preventDefault();
			for (; t = e.changedTouches[i]; ++i) {
				to = touches[t.identifier];
				to.x = t.pageX - rc.left - window.scrollX;
				to.y = t.pageY - rc.top  - window.scrollY;
			}
			fn_events.touchmove.call(p.thisApp, touches);
		});

		attachEvent(window, "touchend", function(e) {
			var	id, t, to, i = 0;
			for (; t = e.changedTouches[i]; ++i)
				if (to = touches[id = t.identifier]) {
					fn_events.touchend.call(p.thisApp, id, to.x, to.y);
					delete touches[id];
				}
		});

	})();

	loadAssetsAndGo();

	function setEvents() {
		var mouseButtonsStatus = [];

		attachEvent(window, "mouseup", function(e) {
			if (mouseButtonsStatus[e.button] === 1) {
				mouseButtonsStatus[e.button] = 0;
				fn_events.mouseup.call(p.thisApp, 0, 0, e.button);
			}
		});

		attachEvent(el_hudAbove, "mousedown", function(e) {
			if (!isFocused)
				el_evt.focus();
			e.preventDefault();
		});

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
						fn_events.keyup.call(p.thisApp, i);
						ar_keys[i] = false;
					}
				if (!p.autoFocus)
					el_evt.blur();
				fn_events.blur.call(p.thisApp);
			}
		});

		attachEvent(el_evt, "keydown", function(e) {
			if (!ar_keys[e.keyCode]) {
				fn_events.keydown.call(p.thisApp, e.keyCode);
				ar_keys[e.keyCode] = true;
			}
			e.preventDefault();
		});

		attachEvent(el_evt, "keyup", function(e) {
			if (ar_keys[e.keyCode]) {
				fn_events.keyup.call(p.thisApp, e.keyCode);
				ar_keys[e.keyCode] = false;
			}
		});

		attachEvent(el_evt, "mousedown", function(e) {
			mouseButtonsStatus[e.button] = 1;
			if (!isFocused)
				el_evt.focus();
			fn_events.mousedown.call(p.thisApp, e.layerX, e.layerY, e.button);
			event_mousemove(e);
		});

		attachEvent(el_evt, "mouseup", function(e) {
			if (mouseButtonsStatus[e.button] === 1) {
				mouseButtonsStatus[e.button] = 2;
				fn_events.mouseup.call(p.thisApp, e.layerX, e.layerY, e.button);
			}
		});

		function event_mousemove(e) {
			fn_events.mousemove.call(p.thisApp, e.layerX, e.layerY);
		}

		attachEvent(el_evt, "mousemove", event_mousemove);

		attachEvent(el_evt, "wheel", function(e) {
			fn_events.wheel.call(p.thisApp, e.layerX, e.layerY,
				e.webkitMovementX !== undefined ? e.deltaX / 100 : e.deltaX,
				e.webkitMovementX !== undefined ? e.deltaY / 100 : e.deltaY
			);
			e.preventDefault();
		});
	}

	function startLooping() {
		setInterval(function() {
			currentOldTime = currentTime;
			currentTime = new Date().getTime() / 1000;
			fn_loop.call(p.thisApp);
		}, fps);
	}

	function loadAssetsAndGo() {
		var	nbElementsToLoad = 1;
		function loaded() {
			if (!--nbElementsToLoad) {
				currentTime =
				startTime = new Date().getTime() / 1000;
				if (p.ready)
					p.ready.call(p.thisApp, that, ctx);
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
	}
}
