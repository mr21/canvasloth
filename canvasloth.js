/*
	Canvasloth - alpha
	https://github.com/Mr21/Canvasloth
*/

'use strict';

function Canvasloth(p) {
	var	that = this,
		dom = {},
		keys = [],
		bo_focus = false,
		fn_events = [],
		fps = p.fps
			? 1000 / p.fps
			: 1000 / 60;

	this.refreshViewportSize = function() {
		dom.el_cnv.width  = dom.el_cnv.clientWidth;
		dom.el_cnv.height = dom.el_cnv.clientHeight;
	};

	this.events = function(ev, fn) {
		ev = ev.toLowerCase();
		if (ev === 'click')
			return console.error('Canvasloth: use the event \"mouseup\" instead of \"click\".');
		else if (ev === 'keypress')
			return console.error('Canvasloth: use the event \"keyup\" instead of \"keypress\".');
		fn_events[ev] = fn;
		return that;
	};

	createDom();
	this.refreshViewportSize();
	setEvents();
	callReady();

	function createDom() {
		dom.el_ctn = p.container.nodeType === Node.ELEMENT_NODE
			? p.container : p.container[0];
		dom.el_ast = dom.el_ctn.querySelector('.canvasloth-assets');
		if (dom.el_ast)
			dom.nl_img = dom.el_ast.getElementsByTagName('img');
		dom.el_hud = dom.el_ctn.querySelector('.canvasloth-hud');
		dom.el_cnv = document.createElement('canvas');
		dom.el_evt = document.createElement('div');
		if (dom.el_ctn.className.indexOf('canvasloth') === -1)
			dom.el_ctn.className += ' canvasloth';
		dom.el_evt.tabIndex = 0;
		dom.el_evt.className = 'canvasloth-events';
		dom.el_ctn.appendChild(dom.el_cnv);
		dom.el_ctn.appendChild(dom.el_evt);
	}

	function setEvents() {
		dom.el_ctn.oncontextmenu = function() { return false; };
		that.events('focus',     function() {});
		that.events('blur',      function() {});
		that.events('keydown',   function() {});
		that.events('keyup',     function() {});
		that.events('mousedown', function() {});
		that.events('mouseup',   function() {});
		that.events('mousemove', function() {});

		dom.el_evt.onfocus = function(e) {
			bo_focus = true;
			fn_events.focus.call(p.thisApp);
			return false;
		};
		
		dom.el_evt.onblur = function(e) {
			if (bo_focus) {
				bo_focus = false;
				for (var i in keys)
					if (keys[i = parseInt(i)]) {
						fn_events.keyup.call(p.thisApp, i);
						keys[i] = false;
					}
				if (!p.autoFocus)
					dom.el_evt.blur();
				fn_events.blur.call(p.thisApp);
			}
			return false;
		};
		
		dom.el_evt.onkeydown = function(e) {
			if (!keys[e.keyCode]) {
				fn_events.keydown.call(p.thisApp, e.keyCode);
				keys[e.keyCode] = true;
			}
			return false;
		};
		
		dom.el_evt.onkeyup = function(e) {
			if (keys[e.keyCode]) {
				fn_events.keyup.call(p.thisApp, e.keyCode);
				keys[e.keyCode] = false;
			}
			return false;
		};

		dom.el_evt.onmousedown = function(e) {
			if (!bo_focus)
				dom.el_evt.focus();
			fn_events.mousedown.call(p.thisApp, e.layerX, e.layerY, e.button);
			return false;
		};

		dom.el_evt.onmouseup = function(e) {
			fn_events.mouseup.call(p.thisApp, e.layerX, e.layerY, e.button);
			return false;
		};

		dom.el_evt.onmousemove = function(e) {
			fn_events.mousemove.call(p.thisApp, e.layerX, e.layerY);
			return false;
		};

		if (p.autoFocus)
			dom.el_evt.focus();
	}

	function ready() {
		p.ready.call(p.thisApp, that);
		setInterval(function() {
			if (bo_focus)
				p.loop.call(p.thisApp);
		}, fps);
	}

	function callReady() {
		var	nbElementsToLoad = 1;
		function loaded() {
			if (!--nbElementsToLoad)
				ready();
		}
		if (p.ready)
			for (var i = 0, img; img = dom.nl_img[i]; ++i)
				if (!img.complete) {
					++nbElementsToLoad;
					img.onload = function() {
						loaded();
					};
				}
		loaded();
	}
}
