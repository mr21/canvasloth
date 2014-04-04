Canvasloth.prototype.Shaders3D = function() {
	var gl = this.ctx,
	    DIRLIGHTS_MAX = 5;
	this.shaders = {
		DIRLIGHTS_MAX: DIRLIGHTS_MAX,
		xVertex:
			'attribute vec3 aVertexNormal;'+
			'attribute vec4 aVertexColor;'+
			'attribute vec4 aVertexPosition;'+
			'uniform int  active;'+
			'uniform mat4 uNMatrix;'+
			'uniform mat4 uMVMatrix;'+
			'uniform mat4 uPMatrix;'+
			'struct Light {'+
				'int  act;'+
				'vec3 pos;'+
				'vec3 col;'+
			'};'+
			'uniform Light dir['+DIRLIGHTS_MAX+'];'+
			'uniform vec3 ambCol;'+
			'varying vec4 vColor;'+
			'varying vec4 vFinalLight;'+
			'void main(void) {'+
				'vFinalLight.xyz = ambCol;'+
				'vColor = aVertexColor;'+
				'if (active == 1) {'+
					'vec3 N = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));'+
					'for (int i = 0; i < '+DIRLIGHTS_MAX+'; ++i)'+
						'if (dir[i].act == 1) {'+
							'vec3 L = normalize(dir[i].pos);'+
							'float lambertCoef = max(dot(N, -L), 0.0);'+
							'vFinalLight.xyz += dir[i].col * lambertCoef;'+
						'}'+
				'}'+
				'vFinalLight.a = 1.0;'+
				'gl_Position = uPMatrix * uMVMatrix * aVertexPosition;'+
			'}',
		xFragment:
			'precision mediump float;'+
			'varying vec4 vColor;'+
			'varying vec4 vFinalLight;'+
			'void main(void) {'+
				'gl_FragColor = vColor * vFinalLight;'+
			'}',
		load: function() {
			var attribs = ['aVertexNormal', 'aVertexColor', 'aVertexPosition'],
			    vShad = this.loadShader(gl.VERTEX_SHADER, this.xVertex),
			    fShad = this.loadShader(gl.FRAGMENT_SHADER, this.xFragment);
			this.program = gl.createProgram();
			gl.attachShader(this.program, vShad);
			gl.attachShader(this.program, fShad);
			for (var i = 0, a; a = attribs[i]; ++i) {
				gl.bindAttribLocation(this.program, i, a);
				gl.enableVertexAttribArray(i);
			}
			gl.linkProgram(this.program);
			if (gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
				gl.useProgram(this.program);
				this.uNMatrix  = gl.getUniformLocation(this.program, 'uNMatrix');
				this.uPMatrix  = gl.getUniformLocation(this.program, 'uPMatrix');
				this.uMVMatrix = gl.getUniformLocation(this.program, 'uMVMatrix');
			} else {
				console.log('Shaders: Unable to initialize the shader program.');
				console.log(gl.getProgramInfoLog(this.program));
				gl.deleteProgram(vShad);
				gl.deleteProgram(fShad);
				gl.deleteProgram(this.program);
			}
		},
		loadShader: function(type, source) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.log('Shaders: compiling error: ' + gl.getShaderInfoLog(shader));
				shader = null;
			}
			return shader;
		}
	};
	this.shaders.load();
};
