Canvasloth.prototype.Camera3D = function() {
	var cnv = this,
		canvas = this.webgl.canvas,
		cam = this.webgl.camera;

	this.camera = {
		eyX:-1, eyY: -9, eyZ: 5,
		ctX: 0, ctY:  0, ctZ: 0,
		upX: 0, upY:  0, upZ: 1,
		zoomRatio: 1.2,
		auto : function() {
			if (!this._auto) {
				this._auto = true;
				this.eventMD = cnv.events.add('mousedown',  this, this._mouseDown);
				this.eventMU = cnv.events.add('mouseup',    this, this._mouseUp);
				this.eventMM = cnv.events.add('mousemove',  this, this._mouseMove);
				this.eventMS = cnv.events.add('mousewheel', this, this._mouseWheel);
			}
			return this;
		},
		manuel : function() {
			if (this._auto) {
				this._auto = false;
				cnv.events.del('mousedown',  this.eventMD);
				cnv.events.del('mouseup',    this.eventMU);
				cnv.events.del('mousemove',  this.eventMM);
				cnv.events.del('mousewheel', this.eventMS);
			}
			return this;
		},
		spherique : function(a) {
			if (!a) {
				this.manuel();
			} else {
				var x = this.eyX,
				    y = this.eyY,
				    z = this.eyZ,
				    xxyy = x*x + y*y;
				this._radius = Math.sqrt(xxyy + z*z);
				this._latitude2 =
				this._latitude  = Math.acos(z / this._radius);
				this._longitude = y >= 0
					?               Math.acos(x / Math.sqrt(xxyy))
					: 2 * Math.PI - Math.acos(x / Math.sqrt(xxyy));
			}
			return this;
		},
		radius    : function(n) { if (n !== undefined) return this._radius    = n, this; return this._radius;    },
		longitude : function(n) { if (n !== undefined) return this._longitude = n, this; return this._longitude; },
		latitude  : function(n) { if (n !== undefined) return this._latitude  = n, this; return this._latitude;  },
		_mouseDown  : function() { this.moving = true;  },
		_mouseUp    : function() { this.moving = false; },
		_mouseWheel : function(y) { this._radius *= y > 0 ? this.zoomRatio : (1 / this.zoomRatio); },
		_mouseMove  : function(e) {
			if (this.moving) {
				this._longitude -= offsetMouse.xRel / 120;
				this._latitude -= offsetMouse.yRel / 120;
				this._latitude %= 2 * Math.PI;
				if (this._latitude > 0        !== this._latitude2 > 0
				||  this._latitude < +Math.PI !== this._latitude2 < +Math.PI
				||  this._latitude < -Math.PI !== this._latitude2 < -Math.PI)
				{
					this.upX = -this.upX;
					this.upY = -this.upY;
					this.upZ = -this.upZ;
				}
				this._latitude2 = this._latitude;
			}
		},
		_lookAtAuto : function() {
			// Eye (coordonnees spheriques -> cartesiens)
			var sinTheta = Math.sin(this._latitude);
			this.eyX = this._radius * Math.cos(this._longitude) * sinTheta;
			this.eyY = this._radius * Math.sin(this._longitude) * sinTheta;
			this.eyZ = this._radius * Math.cos(this._latitude);
			cam.lookAt(
				this.eyX,  this.eyY,  this.eyZ,
				this.ctX,  this.ctY,  this.ctZ,
				this.upX,  this.upY,  this.upZ
			);
		},
		lookAt : function(eyX,eyY,eyZ,  ctX,ctY,ctZ,  upX,upY,upZ) {
			cam.lookAt(
				this.eyX=eyX,  this.eyY=eyY,  this.eyZ=eyZ,
				this.ctX=ctX,  this.ctY=ctY,  this.ctZ=ctZ,
				this.upX=upX,  this.upY=upY,  this.upZ=upZ
			);
			return this;
		}
	};
};
