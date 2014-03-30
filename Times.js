// times.real --> timestamp standard.
// times.frame -> duree de la precedente frame.
// times.start -> quand etait le dernier times.reset().
// times.game --> depuis combien de temps times.reset() a t'il ete appelle.
Canvasloth.prototype.Times = function() {
	var times = this.times = {
		update: function() {
			var d = new Date().getTime() / 1000;
			this.frame = d - this.real;
			this.real  = d;
			this.game  = d - this.start;
		},
		reset: function() {
			this.start = new Date().getTime() / 1000;
			this.game  = 0;
		}
	};
	times.reset();
	times.real  = times.start;
	times.frame = 0;
};
