function Assets(ctx, time) {
	this.ctx = ctx;
	this.time = time;
	this.images = new this.Images();
	this.sprites = new this.Sprites(ctx, this.images);
	this.anims = new this.Anims(this.time, this.sprites);
}
