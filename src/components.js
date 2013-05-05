Crafty.c('Robot', {
    init : function () {
        this.requires('Position, Canvas, Color');
        this.attr({
            w : 10,
            h : 10,
            influenceRange : 50,
            robotType : 0
        });
        this.color('blue');
        this.bind('EnterFrame', this.reactToRobots)
    },

    reactToRobots : function () {
        var xMovement = 0;
        var yMovement = 0;
        for (var i = 0; i < Game.robots.length; i++) {
            var result = this.handleRobot(Game.robots[i]);
            xMovement += result.x;
            yMovement += result.y;
        }

        this.x += xMovement;
        this.y += yMovement;
    },

    handleRobot : function (robot) {
        var robotInteraction;
        var result = this.computeDistanceDifferences(robot, this);
        if (this.isCloseEnoughToInteract(result.x, result.y)) {
            return this.computeRobotInteraction(robot);
        }

        return {
            x : 0,
            y : 0
        };
    },

    computeDistanceDifferences : function (robotOne, robotTwo) {
        return {
            x : robotOne.x - robotTwo.x,
            y : robotOne.y - robotTwo.y
        }
    },

    isCloseEnoughToInteract : function (xDifference, yDifference) {
        return (Math.abs(xDifference) < this.influenceRange) && (Math.abs(yDifference) < this.influenceRange);
    },

    computeRobotInteraction : function (robot) {
        var xMovement = 0;
        var yMovement = 0;
        if (robot != this) {
            var xDifference = robot.x - this.x;
            var yDifference = robot.y - this.y;
            //if ((Math.abs(xDifference) < this.influenceRange) && (Math.abs(yDifference) < this.influenceRange)) {
            Game.numberOfRobotInteraction++;
            // This robot could be closer than the influence range.
            var pushResult;
            if (xDifference == 0 && yDifference == 0) {
                // Superposition, random push.
                pushResult = this.computeRandomPush();
            } else {
                var magnitudeSq = Crafty.math.squaredDistance(0, 0, xDifference, yDifference);
                if (magnitudeSq > 10 || robot.robotType === 0 ) {
                    pushResult = this.computePush(xDifference, yDifference);
                } else {
                    pushResult = { 
                        x : 0,
                        y : 0
                    };
                    
                }
            }
            xMovement += pushResult.x;
            yMovement += pushResult.y;
            //}
        }

        return {
            x : xMovement,
            y : yMovement
        };
    },

    computePush : function (xDifference, yDifference) {
        var xMovement = 0;
        var yMovement = 0;
        var magnitudeSq = Crafty.math.squaredDistance(0, 0, xDifference, yDifference);
        if (magnitudeSq <= this.influenceRange * this.influenceRange) { // Further than this, we ignore it
            var magnitude = Math.sqrt(magnitudeSq);
            var proximityFactor = 1 / magnitude;
            var force = -5 * proximityFactor;

            var vectorDifference = new Crafty.math.Vector2D(xDifference, yDifference)
                vectorDifference.normalize().scale(force);
            xMovement += vectorDifference.x;
            yMovement += vectorDifference.y;
        }

        return {
            x : xMovement,
            y : yMovement
        }
    },
    computeRandomPush : function () {
        return {
            x : Crafty.math.randomNumber(-1, 1),
            y : yMovement = Crafty.math.randomNumber(-1, 1)
        }
    }
});

Crafty.c('RobotCalin', {
    init : function () {
        this.requires('Position, Canvas, Color');
        this.attr({
            w : 10,
            h : 10,
            influenceRange : 50,
            robotType : 1
        });
        this.color('red');
        this.bind('EnterFrame', this.reactToRobots)
		
    },
	reactToRobots : function () {
        // this.x += Crafty.math.randomNumber(-1, 1);
        // this.y += Crafty.math.randomNumber(-1, 1);
        // return; // TODO - Remove this.
        var xMovement = 0;
        var yMovement = 0;
        for (var i = 0; i < Game.robots.length; i++) {
            var robot = Game.robots[i];
            if (robot.robotType === 0) {
                var xDifference = robot.x - this.x;
                var yDifference = robot.y - this.y;
                var magnitudeSq = Crafty.math.squaredDistance(0, 0, xDifference, yDifference);
                if (magnitudeSq > 10) {
                    var robotInteractionResult = this.computeRobotInteraction(robot);
                    xMovement += robotInteractionResult.x;
                    yMovement += robotInteractionResult.y;
                }
            }
        }

        this.x += xMovement;
        this.y += yMovement;
    },
    computeRobotInteraction : function (robot) {
        var xMovement = 0;
        var yMovement = 0;
        if (robot != this) {
            var xDifference = robot.x - this.x;
            var yDifference = robot.y - this.y;
            //if ((Math.abs(xDifference) < this.influenceRange) && (Math.abs(yDifference) < this.influenceRange)) {
            Game.numberOfRobotInteraction++;
            // This robot could be closer than the influence range.
            var pushResult;
            
            pushResult = this.computeChase(xDifference, yDifference);
            
            xMovement += pushResult.x;
            yMovement += pushResult.y;
        }

        return {
            x : xMovement,
            y : yMovement
        };
    },
    
    computeChase : function (xDifference, yDifference) {
        var xMovement = 0;
        var yMovement = 0;
        var magnitudeSq = Crafty.math.squaredDistance(0, 0, xDifference, yDifference);
        if (magnitudeSq <= this.influenceRange * this.influenceRange) { // Further than this, we ignore it
            var magnitude = Math.sqrt(magnitudeSq);
            var proximityFactor = 1 / magnitude;
            var force = 5 * proximityFactor;

            var vectorDifference = new Crafty.math.Vector2D(xDifference, yDifference)
                vectorDifference.normalize().scale(force);
            xMovement += vectorDifference.x;
            yMovement += vectorDifference.y;
        }

        return {
            x : xMovement,
            y : yMovement
        }
    },
});
Crafty.c('SpawnableBackground', {
    init : function () {
        this.requires('ClickableRectangle, Keyboard');
        this.at(50, 50)
        this.attr({
            w : Game.width() - this.x * 2,
            h : Game.height() - this.y * 2,
            spawnActive : false,
            spawnInfo : {
                x : 0,
                y : 0,
                spawnType : 0
            },
            currentCooldown : 0,
            spawnCooldown : 10
        });

        this.color('white')
        this.click(function (position) {
            this.spawnActive = !this.spawnActive;
            console.log("Spawning : " + this.spawnActive);
        });
        this.bind('MouseMove', function (mouseEvent) {
            this.spawnInfo.x = mouseEvent.realX;
            this.spawnInfo.y = mouseEvent.realY;
        });
        this.bind('KeyDown', function (e) {
            if (e.key == Crafty.keys['W']) {
                if (this.spawnCooldown > 5) {
                    this.spawnCooldown--;
                    console.log("Spawning every: " + this.spawnCooldown);
                }
            } else if (e.key == Crafty.keys['S']) {
                this.spawnCooldown++;
                console.log("Spawning every: " + this.spawnCooldown);
            } else if (e.key == Crafty.keys['C']) {
                this.spawnInfo.spawnType = 1;
                console.log("Spawning a robot calin next!");
            } else if (e.key == Crafty.keys['R']) {
                this.spawnInfo.spawnType = 0;
                console.log("Spawning timid robots.");
            }
                
        });
        
        this.bind('EnterFrame', function () {
            if (this.currentCooldown > 0) {
                this.currentCooldown--;
            }
            if (this.spawnActive && this.currentCooldown <= 0) {
                this.currentCooldown = this.spawnCooldown;
                if (this.spawnInfo.spawnType == 0) {
                    Crafty.trigger('SpawnRobot', this.spawnInfo);
                } else if (this.spawnInfo.spawnType == 1) {
                    Crafty.trigger('SpawnRobot', this.spawnInfo);
                    this.spawnActive = false;
                }
            }
        });
    }

});

Crafty.c('Position', {
    init : function () {
        this.requires('2D');
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

    center : function (x, y) {
        if (x === undefined && y === undefined) {
            var pos = this.at();
            pos.x += this.w / 2
            pos.y += this.h / 2
            return pos;
        } else {
            this.at(x - this.w / 2, y - this.h / 2)
            return this;
        }
    }
});

Crafty.c('ClickableRectangle', {
    init : function () {
        this.requires('Position, Canvas, Color, Mouse');
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
                y : mouseEvent.realY,
                button : mouseEvent.mouseButton
            });
        });
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
