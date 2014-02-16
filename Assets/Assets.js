Canvasloth.Assets = function(ctx, time) {
	this.ctx = ctx;
	this.time = time;
	this.images = new Canvasloth.Assets.Images();
	this.sprites = new Canvasloth.Assets.Sprites(ctx, this.images);
	this.anims = new Canvasloth.Assets.Anims(this.time, this.sprites);
};
