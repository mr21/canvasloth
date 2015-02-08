/*
	Canvasloth Animation - 1.2
	https://github.com/Mr21/Canvasloth
*/

'use strict';

function canvaslothAnim(sprite) {
	this.sprite = sprite;
	this.timer = 0;
	this.currFrame = 0;
	this._reverse = false;
	this
		.nbFrames(1)
		.horizontal()
		.duration(1)
		.stop()
		.loopAt(0)
		.looping(false)
}

canvaslothAnim.prototype = {
	play: function() {
		this.isPlaying = true;
		return this;
	},
	pause: function() {
		this.isPlaying = false;
		return this;
	},
	stop: function() {
		return this.pause().frame(this._reverse
			? this.nbFrm - 1
			: 0
		);
	},
	looping: function(l) {
		this.isLooping = l;
		return this;
	},
	loopAt: function(n) {
		this.frameLoop = n;
		return this;
	},
	duration: function(sec) {
		this.sec = sec;
		this.secByFrame = sec / this.nbFrm;
		return this;
	},
	reverse: function() {
		this._reverse = !this._reverse;
		return this;
	},
	horizontal: function() {
		this._horizontal = true;
		return this;
	},
	vertical: function() {
		this._horizontal = false;
		return this;
	},
	nbFrames: function(nb) {
		this.nbFrm = nb;
		this.secByFrame = this.sec / nb;
		return this;
	},
	frame: function(n) {
		if (n < 0 || n >= this.nbFrm) {
			if (this.isLooping) {
				n = this.frameLoop;
			} else {
				n = n < 0 ? this.nbFrm - 1 : 0;
				this.pause();
			}
		}
		if ((n %= this.nbFrm) < 0)
			n += this.nbFrm;
		var	x = this.sprite.sx,
			y = this.sprite.sy;
		if (this._horizontal)
			x += (n - this.currFrame) * this.sprite.sw;
		else
			y += (n - this.currFrame) * this.sprite.sh;
		this.sprite.srcPos(x, y);
		this.currFrame = n;
		return this;
	},
	draw: function(x, y, frameTime) {
		if ((this.timer += frameTime) >= this.secByFrame) {
			if (this.isPlaying) {
				this.frame(
					this.currFrame
					+ Math.floor(this.timer / this.secByFrame)
					* (this._reverse ? -1 : 1)
				);
			}
			this.timer = 0;
		}
		this.sprite.draw(x, y);
		return this;
	}
};
