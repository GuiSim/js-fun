// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Test', function () {
    Game.robots = []; // All the robots in the scene
    Game.numberOfRobotInteraction = 0;
    Game.timestampOfLastFrame = 0;

    this.spawnRobot = function (spawnInfo) {
        if (spawnInfo.spawnType === 0) {
            var robot = Crafty.e('Robot')
            .center(spawnInfo.x, spawnInfo.y);
            var robotInfluence = Crafty.e('RobotInfluence').forRobot(robot);
            Game.robots.push(robot);
        } else if (spawnInfo.spawnType === 1) {
            var robot = Crafty.e('RobotCalin')
            .center(spawnInfo.x, spawnInfo.y);
        }
        
        Game.robots.push(robot);
    }
    
    Game.interactionCount = Crafty.e('2D, Text, DOM').attr({
            x : 0,
            y : 0,
            w : 150,
            h : 20
        }).text("Loading..");
    Game.numberOfRobots = Crafty.e('2D, Text, DOM').attr({
            x : 0,
            y : 20,
            w : 150,
            h : 20
        }).text("Loading..");
    Game.fpsCounter = Crafty.e('2D, Text, DOM').attr({
            x : 400,
            y : 20,
            w : 150,
            h : 20
        }).text("Loading..");

    Game.getFps = function() {
        var previousTimestamp = Game.timeStampOfLastFrame;
        var newTimestamp = performance.now();
        
        var timeBetweenFrames = newTimestamp - previousTimestamp;
        Game.timeStampOfLastFrame = newTimestamp;
        return Math.floor(1/(timeBetweenFrames / 1000));
    }
        
    Crafty.e('SpawnableBackground').bind('EnterFrame', function () {
        Game.interactionCount.text(Game.numberOfRobotInteraction + " interactions")
        Game.numberOfRobots.text(Game.robots.length + " robots")
        Game.fpsCounter.text(Game.getFps() + " fps");
        Game.numberOfRobotInteraction = 0;
    });
    this.bind('SpawnRobot', this.spawnRobot);
});

Crafty.scene('Menu', function () {

    Crafty.e('ClickableRectangle')
    .at(100, 100)
    .click(function () {
        console.log('click!');
        Crafty.scene('Test');
    });
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
