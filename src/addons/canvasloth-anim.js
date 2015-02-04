/*
	Canvasloth Animation - 1.1
	https://github.com/Mr21/Canvasloth
*/

'use strict';

function canvaslothAnim(sprite) {
	this.sprite = sprite;
	this.timer = 0;
	this.currFrame = 0;
	this
		.nbFrames(1)
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
		this.pause().frame(0);
		return this;
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
	nbFrames: function(nb) {
		this.nbFrm = nb;
		this.secByFrame = this.sec / nb;
		return this;
	},
	frame: function(n) {
		if (n >= this.nbFrm) {
			if (this.isLooping) {
				n = this.frameLoop;
			} else {
				n = 0;
				this.pause();
			}
		}
		if ((n %= this.nbFrm) < 0)
			n += this.nbFrm;
		this.sprite.srcPos(
			this.sprite.sx + (n - this.currFrame) * this.sprite.sw,
			this.sprite.sy
		);
		this.currFrame = n;
		return this;
	},
	draw: function(x, y, frameTime) {
		if ((this.timer += frameTime) >= this.secByFrame) {
			if (this.isPlaying)
				this.frame(this.currFrame + Math.floor(this.timer / this.secByFrame));
			this.timer = 0;
		}
		this.sprite.draw(x, y);
		return this;
	}
};
