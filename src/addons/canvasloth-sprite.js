/*
	Canvasloth Sprite - 1.0
	https://github.com/Mr21/Canvasloth
*/

'use strict';

function canvaslothSprite(ctx, img) {
	this.ctx = ctx;
	this.img = img;
	this.dstSizeCalled = -1;
	this
		.opacity(1)
		.pivotX("left", 0)
		.pivotY("top", 0)
		.srcPos(0, 0)
		.srcSize(img.width, img.height)
		.dstSize(img.width, img.height);
}

canvaslothSprite.prototype = {
	opacity: function(o) {
		this.op = o;
		return this;
	},
	srcPos: function(x, y) {
		this.sx = x;
		this.sy = y;
		return this;
	},
	srcSize: function(w, h) {
		this.sw = w;
		this.sh = h;
		if (!this.dstSizeCalled)
			this.dstSize(w, h);
		else if (this.dstSize_w !== undefined)
			this.dstSize(this.dstSize_w, this.dstSize_h);
		else if (this.dstSizeNorm_w !== undefined)
			this.dstSizeNorm(this.dstSizeNorm_w, this.dstSizeNorm_h);
		return this;
	},
	dstSize: function(w, h) {
		++this.dstSizeCalled;
		if (h === undefined)
			h = w;
		this.dstSizeNorm_w = undefined;
		this.dstSize_w = w;
		this.dstSize_h = h;
		this.dw = w;
		this.dh = h;
		this.pivotX(this.pivotX_side, this.pivotX_x);
		this.pivotY(this.pivotY_side, this.pivotY_y);
		return this;
	},
	dstSizeNorm: function(w, h) {
		if (h === undefined)
			h = w;
		this.dstSize_w = undefined;
		this.dstSizeNorm_w = w;
		this.dstSizeNorm_h = h;
		return this.dstSize(
			this.sw * w,
			this.sh * h
		);
	},
	pivotX: function(side, x) {
		this.pivotX_side = side;
		this.pivotX_x = x = x || 0;
		switch (side) {
			case "left":   this.ax = x; break;
			case "center": this.ax = this.dw / 2 + x; break;
			case "right":  this.ax = this.dw + x; break;
		}
		return this;
	},
	pivotY: function(side, y) {
		this.pivotY_side = side;
		this.pivotY_y = y = y || 0;
		switch (side) {
			case "top":    this.ay = y; break;
			case "center": this.ay = this.dh / 2 + y; break;
			case "bottom": this.ay = this.dh + y; break;
		}
		return this;
	},
	draw: function(x, y) {
		var gl = this.ctx.globalAlpha;
		this.ctx.globalAlpha = this.op;
			this.ctx.drawImage(
				this.img,
				this.sx, this.sy,
				this.sw, this.sh,
				x - this.ax,
				y - this.ay,
				this.dw, this.dh
			);
		this.ctx.globalAlpha = gl;
		return this;
	}
};
