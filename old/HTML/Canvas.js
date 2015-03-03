Canvasloth.prototype.Canvas = function() {
	var container = this.container,
		canvas = document.createElement('canvas'),
		catchMouse = document.createElement('div');
	catchMouse.className = 'canvasloth-mouse';
	catchMouse.oncontextmenu = function() { return false; };
	container.appendChild(canvas);
	container.appendChild(catchMouse);
	this.canvas = {
		catchMouse: catchMouse,
		getContext: function(type) { return canvas.getContext(type); },
		cursor: function(c) { catchMouse.style.cursor = c; },
		width:  function() { return canvas.width;  },
		height: function() { return canvas.height; },
		resize: function() {
			canvas.width  = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}
	};
};
