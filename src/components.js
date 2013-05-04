Crafty.c('Robot', {
    init : function () {
        this.requires('Position, Canvas, Color');
        this.attr({
            w : 10,
            h : 10,
            influenceRange : 50,
        });
        this.color('blue');
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
            var xDifference = Game.substract(robot.x, this.x);
            var yDifference = Game.substract(robot.y, this.y);
            //var xDifference = robot.x - this.x;
            //var yDifference = robot.y - this.y;
            if (this.isCloseEnoughToInteract(xDifference, yDifference)) {
                var robotInteractionResult = this.computeRobotInteraction(robot);
                xMovement += robotInteractionResult.x;
                yMovement += robotInteractionResult.y;
            }
        }

        this.x += xMovement;
        this.y += yMovement;
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
                pushResult = this.computePush(xDifference, yDifference);
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

Crafty.c('SpawnableBackground', {
    init : function () {
        this.requires('ClickableRectangle, Keyboard');
        this.at(50, 50)
        this.attr({
            w : Game.width() - this.x * 2,
            h : Game.height() - this.y * 2,
            spawnActive : false,
            spawnLocation : {
                x : 0,
                y : 0
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
            this.spawnLocation = {
                x : mouseEvent.realX,
                y : mouseEvent.realY
            };
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
            }
        });

        this.bind('EnterFrame', function () {
            if (this.currentCooldown > 0) {
                this.currentCooldown--;
            }
            if (this.spawnActive && this.currentCooldown <= 0) {
                this.currentCooldown = this.spawnCooldown;
                Crafty.trigger('SpawnRobot', this.spawnLocation);
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
                y : mouseEvent.realY
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
