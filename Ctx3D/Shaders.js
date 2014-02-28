Canvasloth.Ctx3D.Shaders = function(container, ctx) {
	this.container = container;
	this.ctx = ctx;
	this.loadShaders();
};

Canvasloth.Ctx3D.Shaders.prototype = {
	loadShaders: function() {
		var shaders = this.compileShaders();
		if (shaders.length) {
			var gl = this.ctx;
			this.shaderProgram = gl.createProgram();
			for (var i = 0; i < shaders.length; ++i)
				gl.attachShader(this.shaderProgram, shaders[i]);
			gl.linkProgram(this.shaderProgram);
			if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS))
				console.log('Shaders: Unable to initialize the shader program');
			else
				gl.useProgram(this.shaderProgram);
		}
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
