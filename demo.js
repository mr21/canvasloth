function main() {

	window.cnv = new Canvasloth({
		container: document.querySelector(".canvasloth"),
		context: "2d",
		autoFocus: true,
		fps: 5,
		// keepRatio: false,
		// resolutionVariable: false,
		w: 480, // 16/9
		h: 270,
		thisApp: {
			round: function(n) { return Math.round(n * 1000) / 1000; },
			consoleWrite: function(msg) {
				var div = document.createElement("div");
				div.innerHTML = msg;
				this.el_console.insertBefore(div, this.el_console.firstChild);
				if (this.el_console.children.length > 10)
					this.el_console.removeChild(this.el_console.lastChild);
			},
			concatTouchesIds: function(touches) {
				var s = "";
				for (var id in touches) {
					if (s)
						s += ", ";
					s += "<b>" + id + "</b>";
				}
				return s;
			},
			putImage: function(x, y) {
				var	w = this.img.width,
					h = this.img.height,
					sc = .2 + Math.random() * .5;
				this.ctx.save();
					this.ctx.translate(x, y);
						this.ctx.scale(.4, .4);
							this.ctx.rotate(Math.random() * Math.PI * 2);
								this.ctx.globalAlpha = .9;
								this.ctx.drawImage(this.img, -w/2, -h/2);
				this.ctx.restore();
			}
		},
		ready: function(o) {
			var
				cnv = o.canvasloth,
				ctx = o.ctx,
				that = this
			;
			this.cnv = cnv;
			this.ctx = ctx;
			this.isClicked = false;
			this.el_console = cnv.container.querySelector(".console");
			this.consoleWrite("<b>ready</b> ( )");
			this.img = cnv.image("5.png");
			cnv.container.querySelector(".clear").onclick = function(e) {
				var size = cnv.size();
				lg("clearRect(0, 0, "+size.w+", "+size.h+")");
				o.ctx.clearRect(0, 0, size.w, size.h);
				that.putImage(size.w, size.h);
				that.el_console.innerHTML = "";
			};
			cnv.container.querySelector(".fullscreen").onclick = function(e) {
				cnv.toggleFullscreen();
			};
		},
		loop: function() {
			var size = this.cnv.size();
			this.putImage(0, 0);
			this.putImage(size.w, size.h);
			this.putImage(size.w / 3, size.h / 2);
			this.consoleWrite("loop... frameTime: " + this.round(this.cnv.frameTime()) + " (sec)");
		},
		events: {
			focus: function() {
				this.consoleWrite("<b>focus</b> ( )");
			},
			blur: function() {
				this.consoleWrite("<b>blur</b> ( )");
			},
			fullscreenchange: function(e) {
				this.consoleWrite("<b>fullscreen</b>change ( isFullscreen <b>"+e.isFullscreen+"</b> )");
			},
			keyDown: function(e) {
				this.consoleWrite("key<b>Down</b> ( key <b>"+e.key+"</b> )");
			},
			keyUp: function(e) {
				this.consoleWrite("key<b>Up</b> ( key <b>"+e.key+"</b> )");
			},
			wheel: function(e) {
				this.consoleWrite("<b>wheel</b> ( x <b>"+e.x+"</b>, y <b>"+e.y+"</b>, rx <b>"+this.round(e.rx)+"</b>, ry <b>"+this.round(e.ry)+"</b> )");
			},
			mouseDown: function(e) {
				this.consoleWrite("mouse<b>Down</b> ( x <b>"+e.x+"</b>, y <b>"+e.y+"</b>, button <b>"+e.button+"</b> )");
				this.isClicked = true;
				this.putImage(e.x, e.y);
			},
			mouseUp: function(e) {
				this.consoleWrite("mouse<b>Up</b> ( x <b>"+e.x+"</b>, y <b>"+e.y+"</b>, button <b>"+e.button+"</b> )");
				this.isClicked = false;
				this.putImage(e.x, e.y);
			},
			mouseMove: function(e) {
				this.consoleWrite("mouse<b>Move</b> ( x <b>"+e.x+"</b>, y <b>"+e.y+"</b>, rx <b>"+e.rx+"</b>, ry <b>"+e.ry+"</b> )");
				if (this.isClicked)
					this.putImage(e.x, e.y);
			},
			touchStart: function(e) {
				this.consoleWrite("touch<b>Start</b> ( id <b>"+e.id+"</b>, x <b>"+e.x+"</b>, y <b>"+e.y+"</b> )");
			},
			touchEnd: function(e) {
				this.consoleWrite("touch<b>End</b> ( id <b>"+e.id+"</b>, x <b>"+e.x+"</b>, y <b>"+e.y+"</b> )");
			},
			touchMove: function(e) {
				this.consoleWrite("touch<b>Move</b> ( id <b>"+e.id+"</b>, x <b>"+e.x+"</b>, y <b>"+e.y+"</b>, rx <b>"+e.rx+"</b>, ry <b>"+e.ry+"</b> )");
				this.putImage(e.x, e.y);
			}
		}
	});

}

// $(main);
window.onload = main;
