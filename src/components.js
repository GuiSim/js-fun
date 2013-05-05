// Utility methods ----

ROBOT_SIZE = 16;
ROBOT_INFLUENCE = 32;
REPULSION_POWER = 24;

reactToRobot = function (robotOne, robotTwo) {
    var xDifference = robotOne._x - robotTwo._x;
    var yDifference = robotOne._y - robotTwo._y;
    Game.numberOfRobotInteraction++;
    // This robot could be closer than the influence range.
    var pushResult;
    if (xDifference == 0 && yDifference == 0) {
        // Superposition, random push.
        pushResult = computeRandomPush();
    } else {
        var magnitudeSq = Crafty.math.squaredDistance(0, 0, xDifference, yDifference);
        if (magnitudeSq > 10 || robotOne.robotType === 0) {
            pushResult = computePush(xDifference, yDifference);
        } else {
            pushResult = {
                x : 0,
                y : 0
            };

        }
    }
    return [pushResult.x, pushResult.y];
}

computePush = function (xDifference, yDifference) {
    var xMovement = 0;
    var yMovement = 0;
    var magnitudeSq = Crafty.math.squaredDistance(0, 0, xDifference, yDifference);
    var magnitude = Math.sqrt(magnitudeSq);
    var proximityFactor = 1 / magnitude;
    if (proximityFactor > 1) {
        proximityFactor = 1; // Maximum velocity
    }
    var force = -REPULSION_POWER * proximityFactor;

    var vectorDifference = new Crafty.math.Vector2D(xDifference, yDifference)
        vectorDifference.normalize().scale(force);
    xMovement += vectorDifference.x;
    yMovement += vectorDifference.y;
    // }

    return {
        x : xMovement,
        y : yMovement
    }
}

computeRandomPush = function () {
    return {
        x : Math.round(Crafty.math.randomNumber(-1, 1)),
        y : Math.round(Crafty.math.randomNumber(-1, 1))
    };
}

// Components ------

Crafty.c('Robot', {
    init : function () {
        this.requires('Position, Canvas, Color');
        this.attr({
            w : ROBOT_SIZE,
            h : ROBOT_SIZE,
            z : 2,
            influenceRange : ROBOT_INFLUENCE,
            robotType : 0
        });
        this.color('blue');
    },
});

Crafty.c('RobotInfluence', {
    init : function () {
        this.requires('Position, Collision, Color, Canvas');
        this.attr({
            w : ROBOT_INFLUENCE * 2,
            h : ROBOT_INFLUENCE * 2,
            z : 1,
            associatedRobot : null,
        });
        this.color('grey');

        this.bind('EnterFrame', function () {
            var xMovement = 0;
            var yMovement = 0;
            collidingInfluences = this.hit('RobotInfluence');
            if (collidingInfluences) {
                for (var i = 0; i < collidingInfluences.length; i++) {
                    var result = reactToRobot(collidingInfluences[i].obj.associatedRobot, this.associatedRobot);
                    if (result) {
                        xMovement += result[0];
                        yMovement += result[1];
                    }
                }

                this.associatedRobot._x += xMovement;
                this.associatedRobot._y += yMovement;
            }
            this.syncInfluenceToRobot();
        });
    },

    syncInfluenceToRobot : function () {
        var pos = this.associatedRobot.center();
        this.center(pos.x, pos.y);
    },

    forRobot : function (robot) {
        this.associatedRobot = robot
            this.syncInfluenceToRobot();
        return this;
    },
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
        var xMovement = 0;
        var yMovement = 0;
        for (var i = 0; i < Game.robots.length; i++) {
            var robot = Game.robots[i];
            if (robot.robotType === 0) {
                var xDifference = robot._x - this._x;
                var yDifference = robot._y - this._y;
                var magnitudeSq = Crafty.math.squaredDistance(0, 0, xDifference, yDifference);
                if (magnitudeSq > 10) {
                    var robotInteractionResult = this.computeRobotInteraction(robot);
                    xMovement += robotInteractionResult.x;
                    yMovement += robotInteractionResult.y;
                }
            }
        }

        this._x += xMovement;
        this._y += yMovement;
    },
    computeRobotInteraction : function (robot) {
        var xMovement = 0;
        var yMovement = 0;
        if (robot != this) {
            var xDifference = robot._x - this._x;
            var yDifference = robot._y - this._y;
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
            w : Game.width() - this._x * 2,
            h : Game.height() - this._y * 2,
            spawnActive : false,
            spawnInfo : {
                x : 0,
                y : 0,
                z : -10,
                spawnType : 0
            },
            currentCooldown : 0,
            spawnCooldown : 5
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
                if (this.spawnCooldown > 1) {
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
                x : this._x,
                y : this._y
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
