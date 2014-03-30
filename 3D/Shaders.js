Canvasloth.prototype.Shaders3D = function() {
	var gl = this.ctx,
	    cnt = this.container,
	    shad =
	this.shaders = {
		loadShaders: function() {
			var program = null,
			    shaders = this.compileShaders(),
			    attribs = ['aVertexNormal', 'aVertexColor', 'aVertexPosition'];
			if (shaders.length) {
				program = gl.createProgram();
				for (var i = 0, s; s = shaders[i]; ++i)
					gl.attachShader(program, s);
				for (var i = 0, a; a = attribs[i]; ++i)
					gl.bindAttribLocation(program, i, a);
				gl.linkProgram(program);
				if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
					gl.useProgram(program);
				} else {
					console.log('Shaders: Unable to initialize the shader program');
					console.log(gl.getProgramInfoLog(program));
					for (var i = 0, s; s = shaders[i]; ++i)
						gl.deleteProgram(s);
					gl.deleteProgram(program);
				}
			}
			return program;
		},
		compileShaders: function() {
			var i = 0, script, shader, shaders = [],
			    scripts = cnt.getElementsByTagName('script');
			for (; script = scripts[i]; ++i)
				if (shader = this.compileShader(script))
					shaders.push(shader);
			return shaders;
		},
		compileShader: function(script) {
			var shader = null;
			switch (script.type) {
				case 'x-shader/x-fragment' : shader = gl.createShader(gl.FRAGMENT_SHADER); break;
				case 'x-shader/x-vertex'   : shader = gl.createShader(gl.VERTEX_SHADER);   break;
			}
			if (shader) {
				var source = '';
				for (var child = script.firstChild; child; child = child.nextSibling)
					if (child.nodeType === Node.TEXT_NODE)
						source += child.textContent;
				gl.shaderSource(shader, source);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.log('Shaders: compiling error: ' + gl.getShaderInfoLog(shader));
					shader = null;
				}
			}
			return shader;
		}
	};
	shad.program   = shad.loadShaders();
	shad.uNMatrix  = gl.getUniformLocation(shad.program, 'uNMatrix');
	shad.uPMatrix  = gl.getUniformLocation(shad.program, 'uPMatrix');
	shad.uMVMatrix = gl.getUniformLocation(shad.program, 'uMVMatrix');
};
