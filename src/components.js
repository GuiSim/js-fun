Crafty.c('SpawnableBackground', {
	init : function () {
		this.requires('Button');
		this.at(50,50)
		this.attr({
			w : Game.width() - this.x * 2,
			h : Game.height() - this.y * 2
		});

		this.color('white')
        this.click(function(position) {
            Crafty.trigger('SpawnRobot', position);
        });
	}
});

Crafty.c('Button', {
	init : function () {
		this.requires('2D, Canvas, Color, Mouse');
		this.attr({
			w : 60,
			h : 20,
			clickAction : function (position) {}
		});
		this.attr({
			x : Game.width() / 2 - this.w / 2,
			y : Game.height() / 2 - this.h / 2,
		});
		this.color('white')
		this.bind('Click', function (mouseEvent) {
			this.clickAction({
				x : mouseEvent.realX,
				y : mouseEvent.realY
			});
		});
	},

	at : function (x, y) {
		if (x === undefined && y === undefined) {
			return {
				x : this.x,
				y : this.y
			}
		} else {
			this.attr({
				x : x,
				y : y
			});
			return this;
		}
	},

	click : function (clickAction) {
		if (clickAction === undefined) {
			return clickAction;
		} else {
			this.attr({
				clickAction : clickAction
			});
		}
	}
});
