Canvasloth.Ctx3D.Shaders = function(container, ctx) {
	this.container = container;
	this.ctx = ctx;
	this.attribs = ['vNormal', 'vColor', 'vPosition'];
	this.program = this.loadShaders();
};

Canvasloth.Ctx3D.Shaders.prototype = {
	getProgram: function() {
		return this.program;
	},
	loadShaders: function() {
		var program = null,
		    shaders = this.compileShaders();
		if (shaders.length) {
			var gl = this.ctx, i, s;
			program = gl.createProgram();
			for (i = 0; s = shaders[i]; ++i)
				gl.attachShader(program, s);
			for (i = 0; s = this.attribs[i]; ++i)
				gl.bindAttribLocation(program, i, s);
			gl.linkProgram(program);
			if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
				gl.useProgram(program);
			} else {
				console.log('Shaders: Unable to initialize the shader program');
				console.log(gl.getProgramInfoLog(program));
				for (i = 0; s = shaders[i]; ++i)
					gl.deleteProgram(s);
				gl.deleteProgram(program);
			}
		}
		return program;
	},
	compileShaders: function() {
		var i = 0, script, shader, shaders = [],
		    scripts = this.container.getElementsByTagName('script');
		for (; script = scripts[i]; ++i)
			if (shader = this.compileShader(script))
				shaders.push(shader);
		return shaders;
	},
	compileShader: function(script) {
		var gl = this.ctx, shader = null;
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
