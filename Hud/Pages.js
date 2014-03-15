Canvasloth.Pages = function(canvasloth, container) {
	var self = this;
	this.canvasloth = canvasloth;
	this.pageCurr = this.pageCurrNoCross = null;
	this.cross = document.createElement('a');
	this.cross.href = '#';
	this.cross.className = 'canvasloth-cross';
	this.cross.onclick = function() { return self.close(true), false; };
	container.insertBefore(this.cross, canvasloth.canvas.canvas);
	this.startPage = container._domSelector('.canvasloth-page.canvasloth-start')[0];
};

Canvasloth.Pages.prototype = {
	current: function() {
		return this.pageCurr;
	},
	open: function(page) {
		if (!page && !(page = this.startPage))
			return;
		if (page !== this.pageCurr) {
			this.close(false);
			var obj = [
				{css:'margin-left', val:'0%'},
				{css:'opacity',     val:'1',   dur:250},
				{css:'top',         val:'0px', mov:'easeIn'}
			];
			if (!page._hasClass('canvasloth-nocross'))
				obj.push({elm:this.cross, css:'top', val:'5px', del:250});
			else
				this.pageCurrNoCross = page;
			this.animId = page._cssAnim.apply(page, obj);
			this.pageCurr = page;
			this.canvasloth.unfocus();
		}
	},
	close: function(byCross) {
		if (this.pageCurr !== null) {
			document._cssAnimPause(this.animId);
			this.animId = this.pageCurr._cssAnim(
				{css:'opacity',     val:'0',     dur:250},
				{css:'top',         val:'-50px', mov:'easeIn'},
				{css:'margin-left', val:'100%',  dur:0, del:250},
				{elm:this.cross, css:'top', val:'-32px', dur:250, del:0}
			);
			this.pageCurr = null;
			if (byCross === undefined) {
				this.pageCurrNoCross = null;
			} else if (byCross === true) {
				if (this.pageCurrNoCross === null)
					this.canvasloth.focus();
				else
					this.open(this.pageCurrNoCross);
			}
		}
	}
};
