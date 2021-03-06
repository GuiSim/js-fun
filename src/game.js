Game = {
    width : function () {
        return 1000;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height : function () {
        return 1000;
    },
    // Initialize and start our game
    start : function () {
        // Start crafty and set a background color so that we can see it's working
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(100,100,100)');

        // Simply start the "Loading" scene to get things going
        Crafty.scene('Loading');
    },

    substract : function (a, b) {
        return a - b;
    }
}
console.log('Game on!');
$text_css = {
    'font-size' : '24px',
    'font-family' : 'Arial',
    'color' : 'white',
    'text-align' : 'center'
}
