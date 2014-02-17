Canvasloth.Assets = function(ctx, time) {
	this.images = new Canvasloth.Assets.Images();
	this.sprites = new Canvasloth.Assets.Sprites(ctx, this.images);
	this.anims = new Canvasloth.Assets.Anims(time, this.sprites);
};
