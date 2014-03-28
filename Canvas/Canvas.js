Canvasloth.prototype.Canvas = function() {
	var container = this.container,
		domCanvas = document.createElement('canvas'),
		domCatchMouse = document.createElement('div');
	domCatchMouse.className = 'canvasloth-mouse';
	domCatchMouse.oncontextmenu = function() { return false; };
	container.appendChild(domCanvas);
	container.appendChild(domCatchMouse);
	this.canvas = {
		catchMouse: domCatchMouse,
		getContext: function(type) { return domCanvas.getContext(type); },
		cursor: function(c) { domCatchMouse.style.cursor = c; },
		width:  function() { return domCanvas.width;  },
		height: function() { return domCanvas.height; },
		resize: function() {
			domCanvas.width  = container.clientWidth;
			domCanvas.height = container.clientHeight;
		}
	};
};
