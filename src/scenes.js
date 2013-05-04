// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Test', function () {

	this.robots = []; // All the robots in the scene

	this.spawnRobot = function (position) {
		this.robots.push(Crafty.e('2D, Canvas, Color')
			.attr({
				w : 10,
				h : 10,
				x : position.x - 10 / 2,
				y : position.y - 10 / 2,
				robots : this.robots
			}).color('blue')
			.bind('EnterFrame', function () {
				xMovement = 0;
				yMovement = 0;
				for (var i = 0; i < this.robots.length; i++) {
					var robot = this.robots[i];
					if (robot != this) {
						var xDifference = robot._x - this.x;
						var yDifference = robot._y - this.y;
						var vectorDifference = new Crafty.math.Vector2D(xDifference, yDifference)
							var magnitude = vectorDifference.magnitude();
						if (magnitude <= 50) { // Further than this, we ignore it
							var proximityFactor = 1 / magnitude;
							var force = -5 * proximityFactor;

							vectorDifference.normalize().scale(force);
							xMovement += vectorDifference.x;
							yMovement += vectorDifference.y;
						}
					}
				}

				this.x += xMovement;
				this.y += yMovement;
			}))
	}

	Crafty.e('SpawnableBackground');

	this.bind('SpawnRobot', this.spawnRobot);
});

Crafty.scene('Menu', function () {

	Crafty.e('Button')
	.at(100, 100)
	.click(function () {
		console.log('click!');
		Crafty.scene('Test');
	});

	// rect = Crafty.e('2D, Canvas, Color, Mouse')
		// .attr({
			// w : 60,
			// h : 20,
			// x : Game.width() / 2 - 60 / 2,
			// y : Game.height() / 2 - 20 / 2,
		// })
		// .color('rgb(20, 125, 40)')
		// .bind('Click', function () {
			// console.log('click!');
			// Crafty.scene('Test');
		// })
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function () {
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
	.text('Loading; please wait...')
	//.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
	.css($text_css);

	// Now that our sprites are ready to draw, start the game
	Crafty.scene('Menu');
});
