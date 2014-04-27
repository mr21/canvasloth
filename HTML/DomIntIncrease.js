function DomIntIncrease(elem) {
	// parsing de la value de depart
	var content    = elem.textContent;
	this.numWidth  = content.length;
	elem.textContent = '';
	// calcul de la value d'origine (il est possible de mettre autre chose que des '0' dans son HTML)
	this.value = 0;
	for (var size = 0; size < content.length; ++size) {
		var tmp = parseInt(content.substr(size));
		if (!isNaN(tmp)) {
			this.value = tmp;
			break;
		}
	}
	this.fill(this.numWidth, content[0] >= 0 && content[0] <= 9 ? '0' : content[0]);
	// attributs
	this.valueTmp   = this.value;
	this.duration   = 0;
	this.timer      = 40;
	this.intervalId = null;
	this.nbFrames   = 0;
	// creation du DOM
	this.spanZeros = document.createElement('span'); this.spanZeros.className = 'zeros';
	this.spanValue = document.createElement('span'); this.spanValue.className = 'value';
	elem.appendChild(this.spanZeros, elem.parentNode);
	elem.appendChild(this.spanValue, elem.parentNode);
	// init
	this._set(this.value);
};

DomIntIncrease.prototype = {
	fill: function(width, c) {
		this.fillStr = '';
		this.valueMax = 1;
		while (--width >= 0) {
			this.fillStr += c;
			this.valueMax *= 10;
		}
		--this.valueMax;
	},
	add: function(val, duration) {
		this.set(this.value + val, this.duration + (duration || 0));
	},
	get: function() {
		return Math.floor(this.value);
	},
	set: function(val, duration) {
		this.value = Math.min(val, this.valueMax);
		this.valueInt = parseInt(this.value);
		this.duration = duration || 0;
		if (this.duration === 0) {
			this.stop();
		} else {
			var self = this;
			this.nbFrames = Math.ceil(this.duration / this.timer);
			this.frame = 0;
			this.incVal = (this.value - this.valueTmp) / this.nbFrames;
			this.incTime = this.duration / this.nbFrames;
			if (this.intervalId === null) {
				this.intervalId = setInterval(function() {
					if (++self.frame >= self.nbFrames) {
						self.stop();
					} else {
						self._set(self.valueTmp += self.incVal);
						if (self.valueInt === self.valueTmpInt)
							self.stop();
						else
							self.duration -= self.incTime;
					}
				}, this.timer);
			}
		}
	},
	stop: function() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.duration = 0;
		this.valueTmp = this.value;
		this._set(this.value);
	},
	_set: function(val) {
		this.valueTmpInt = val = Math.floor(val);
		this.spanValue.textContent = val;
		var width = 1;
		while (parseInt(val /= 10))
			++width;
		this.spanZeros.textContent = this.fillStr.substr(width);
	}
};
