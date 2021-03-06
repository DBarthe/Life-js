/**
 * File : script.js (to be changed)
 * Author: Barthelemy DELEMOTTE
 * Starting : October 2014
 * Purpose: Implementing a game of life in javascript with html canvas. 
 */



/**
 * Utils functions
 */

// The mod() function apllys a special modulo m to x, wich makes all results be positive.
function mod(x, m) {
    var r = x % m;
    return r < 0 ? r + m : r;
}

// The intdiv() function performs a division on integer (5/2=2, ...etc)
function intdiv(a, b) {
    return (a / b) | 0;
}

/**
 * Class Tile
 *
 * Designed to:
 *      - store informations about a cell
 *          - state (alive, dead)
 *          - meta (if alive : just-born, will-die, short-lived, long-lived)
 */
 // The Tile's constructor create a dead cell.
function Tile() {

    this.alive = false;
    this.metaJustBorn = false;
    this.metaWillDie = false; 
}

// The isAlive() method returns true if the tile is alive. 
Tile.prototype.isAlive = function() {
    return this.alive;
};

// The isDead() method returns true if the tile is dead
Tile.prototype.isDead = function() {
    return !this.alive;
};

// The born() method set the cell's state to 'alive'.
Tile.prototype.born = function() {
    if (!this.alive) {
        this.alive = true;
        this.metaJustBorn = true;
    }
};

// The die() method set the cell's state to 'dead'
Tile.prototype.die = function() {
    this.alive = false;
    this.metaJustBorn = false;
    this.metaWillDie = false;
};

// The MetaState static enumerate type is used by Tile to tell its meta-state.
Tile.MetaState = {'justBorn' : 0, 'willDie' : 1, 'shortLived' : 2, 'longLived' : 3} ;

// The getMetaState() method returns the meta-state of the cell (in the Tile.MetaState type).
// Because a dead cell haven't meta-state, this method returns null if the cell is dead.
Tile.prototype.getMetaState = function() {
    metaState = null;
    if (this.isAlive()) {
        if (this.metaJustBorn && this.metaWillDie) {
            metaState = Tile.MetaState.shortLived;
        }
        else if (this.metaJustBorn) {
            metaState = Tile.MetaState.justBorn;
        }
        else if (this.metaWillDie) {
            metaState = Tile.MetaState.willDie;
        }
        else {
            metaState = Tile.MetaState.longLived;
        }
    }
    return metaState;
};

/**
 * Class World
 *
 * Designed to:
 *      - store the grid map,
 *      - make modification cycle by cycle,
 *      - set and get tiles
 *      - can be resized, and may be dynamic size
 */
function World() {

    this.width = 50 ;
    this.height = 50 ;

    this.grid = this._makeEmptyGrid();
}

// The _makeEmptyGrid() private method create a matrix of the size
// found in this.width and this.height, with dead cells. Then returns this matrix.
World.prototype._makeEmptyGrid = function() {
    var grid = new Array(this.width);
    for (var i = 0; i < this.width; i++) {
        grid[i] = new Array(this.height);
        for (var j = 0; j < this.height; j++) {
            grid[i][j] = new Tile();
        }
    }
    return grid;
}


// This private method translates the x-position to create a circular effect in the world gird.
World.prototype._moduleAbscissa = function(x) {
    return mod(x, this.width);
}

// This private method translates the y-position to create a circular effect in the world gird.
World.prototype._moduleOrdinate = function(y) {
    return mod(y, this.height);
}

// The getTile(int,int) method allows to access to a tile by giving its coordinates.
World.prototype.getTile = function(x, y) {
    return this.grid[this._moduleAbscissa(x)][this._moduleOrdinate(y)];
};

// The setTitle(int,int,bool) method sets the tile's state at the given coordinates
// (true for alive, false for dead)
// Returns the tile modified.
World.prototype.setTile = function(x, y, alive) {
    var tile = this.getTile(x, y);
    if (alive) {
        tile.born();
    } else {
        tile.die();
    }
    return tile;
};

// The clear() method kills all cells.
World.prototype.clear = function() {
    this.forEachAliveTile(function (x, y, tile) {
        tile.die();
    });
};

// The setSeveralTiles() method set to alive several tile's states to 'alive'.
// The parameter 'group' must be an array of 2-lenght arrays. For exemple:
//    group = [[x1,y1], [x2,y2], ... ]
World.prototype.setSeveralTiles = function(group) {
    // for unsetSeveralTiles()
    var setAlive = true;
    if (arguments.length >= 2 && arguments[1] === false) {
        setAlive = false;
    }

    for (var i in group) {
        var coordinate_arr = group[i];
        var x = coordinate_arr[0], y = coordinate_arr[1];
        this.setTile(x, y, true);
    }
};

// The unsetSeveralTiles() method is the same than setSeveralTiles(), but killing cells.
World.prototype.unsetSeveralTiles = function(group) {
    this.setSeveralTiles(group, false);
};

World.prototype.countCellNeighbors = function(x, y) {
    var cnt = 0;

    cnt += this.getTile(x - 1, y - 1).isAlive();
    cnt += this.getTile(x - 1, y).isAlive();
    cnt += this.getTile(x - 1, y + 1).isAlive();

    cnt += this.getTile(x, y - 1).isAlive();
    cnt += this.getTile(x, y + 1).isAlive();

    cnt += this.getTile(x + 1, y - 1).isAlive();
    cnt += this.getTile(x + 1, y).isAlive();
    cnt += this.getTile(x + 1, y + 1).isAlive();

    return cnt;
};

// The nextGeneration() method do one cycle, modifying the grid.
World.prototype.nextGeneration = function() {

    var newGrid = this._makeEmptyGrid();
    var self = this;

    this.forEachTile(function (x, y, tile) {
        var neighbors = self.countCellNeighbors(x, y);
        if (tile.isAlive()) {
            if (tile.metaWillDie == false && (neighbors == 2 || neighbors == 3)) {
                tile.metaJustBorn = false;
                newGrid[x][y] = tile;
            }
        }
        else {
            if (self.countCellNeighbors(x, y) == 3) {
                newGrid[x][y].born();
            }
        }
        return true;
    });

    this.grid = newGrid;

    this.forEachAliveTile(function (x, y, tile) {
        var neighbors = self.countCellNeighbors(x, y);
        if (neighbors != 2 && neighbors != 3) {
            tile.metaWillDie = true;
        }
        return true;
    });
};

// The getWidth() method returns the current grid width.
World.prototype.getWidth = function() {
    return this.width;
};

// The getHeight() method returns the current grid height.
World.prototype.getHeight = function() {
    return this.height;
};

// The forEachTile() method call the function 'callback' with parameters (x, y, tile)
// for each tile in the world.
// This method stops its loop if the callback returns false.
World.prototype.forEachTile = function(callback) {
    for (var i = 0 ; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            if (callback(i, j, this.grid[i][j]) === false) {
                return ;
            }
        }
    }
}

// Like the method forEachTile() but only with alive cells
World.prototype.forEachAliveTile = function(callback) {
    this.forEachTile(function (x, y, tile) {
        if (tile.isAlive()) {
            return callback(x, y, tile);
        } else {
            return true;
        }
    });
}


/**
 * Class Process
 *
 * Designed to:
 *      - Clock the world
 *      - Can be paused, played, stoped, sped up, ...
 *      - Synchronize World and Display
 */
function Process(world, display) {
    this.world = world;
    this.display = display;

    // Tells if the game is playing or stoped.
    this.playing = false;

    // The delay between each generation in ms.
    this.interval = 120;

    // The timestamp of the last call to the method run()
    this.lastTick = null;

    // The timestamp of the last generation. 
    this.lastGeneration = null;
}

// The isPlaying() methods return true if the game is playing.
Process.prototype.isPlaying = function() {
    return this.playing;
};

// The play() method starts the game.
Process.prototype.play = function() {
    this.playing = true;
};

// The pause() method stops the game but keeps the world's state.
Process.prototype.pause = function() {
    this.playing = false;
};

// The stop() method stops the game and clear the world.
Process.prototype.stop = function() {
    this.playing = false;
    this.world.clear();
};

// The begin() method stops the game and set the world to the initial state.
Process.prototype.begin = function() {
    this.stop();
    // TODO: set the initial world
};

// The restart() method is like begin() but plays straight.
Process.prototype.restart = function() {
    this.begin();
    this.play();
};

// The setInterval() method sets the interval between each generation.
Process.prototype.setInterval = function(intval) {
    if (intval >= 0) {
        this.interval = intval ;
    }
};

// The getInterval() method gets the interval between each generation.
Process.prototype.getInterval = function() {
    return this.interval ;
};

// The increaseInterval() method increase the interval between each generation.
// The 'intval' can be negative. 
Process.prototype.increaseInterval = function(intval) {
    this.interval += intval;
    if (this.interval < 0) {
        this.interval = 0;
    }
};

// The run() method is called at each frame by requestAnimationFrame().
// This method do several generations according to the generation's interval
// and one draw().
Process.prototype.run = function(timestamp) {

    if (this.lastTick === null)         { this.lastTick = timestamp }
    if (this.lastGeneration === null)   { this.lastGeneration = timestamp }

    if (this.playing) {
        if (timestamp - this.lastGeneration >= this.interval) { 
            this.world.nextGeneration();
            this.lastGeneration = timestamp;
        }
    }

    this.display.draw();

    this.lastTick = timestamp ;
};


/**
 * Class Display
 *
 * Designed to:
 *      - Draw the world on a canvas
        - Manage a camera : position, zoom
        - display additional layers
        - resize canvnas and set others attributes
 */
function Display(canvas, world) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.world = world;

    this.canvasWidth = null;
    this.canvasHeight = null;
    this.scale(600, 600);

    this.zoom = 1.0;
    // center position of camera.
    this.cameraX = 0;
    this.cameraY = 0;

    // colors set
    this.backgroundColor = 'black';
    this.livingCellsColors = []
    this.livingCellsColors[Tile.MetaState.justBorn]  = 'green';
    this.livingCellsColors[Tile.MetaState.willDie]  = 'red';
    this.livingCellsColors[Tile.MetaState.shortLived]  = 'yellow';
    this.livingCellsColors[Tile.MetaState.longLived]  = 'blue';

    // Draw informations, sizes, and positions
    this.visibleCellsX = null;
    this.visibleCellsY = null;
    this.cellWidth = null;
    this.cellHeight = null;
    this.startX = null;
    this.startY = null;
}

// The _drawBackground() private method clear the
// canvas by drawing the background.
Display.prototype._drawBackground = function() {
    this.context.beginPath();
    this.context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.fillStyle = this.backgroundColor;
    this.context.fill();
    this.context.closePath();
}

// The draw() method refreshs the canvas
Display.prototype.draw = function() {
    this.visibleCellsX = intdiv(this.world.width, this.zoom);
    this.visibleCellsY = intdiv(this.world.height, this.zoom);
    this.cellWidth = Math.ceil(this.canvasWidth / this.visibleCellsX);
    this.cellHeight = Math.ceil(this.canvasHeight / this.visibleCellsY);
    this.startX = this.cameraX - intdiv(this.visibleCellsX, 2);
    this.startY = this.cameraY - intdiv(this.visibleCellsY, 2);

    this._drawBackground();

    for (var x = 0; x < this.visibleCellsX; x++) {
        for (var y = 0; y < this.visibleCellsY; y++) {
            var tile = this.world.getTile(this.startX + x, this.startY + y);
            if (tile.isAlive()) {
                this.context.beginPath();
                this.context.fillStyle = this.livingCellsColors[tile.getMetaState()];
                this.context.rect(
                    x * this.cellWidth, y * this.cellHeight,
                    this.cellWidth, this.cellHeight
                );
                this.context.fill();
                this.context.closePath();
            }
        }
    }
};

// The scale() method changes the scale of the canvas
Display.prototype.scale = function(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.canvas.width = width;
    this.canvas.height = height;
};

// The getWidth() method returns the width of the canvas.
Display.prototype.getWidth = function() {
    return this.canvasWidth;
};

// The getHeight() method returns the height of the canvas.
Display.prototype.getHeight = function() {
    return this.canvasHeight;
};

// The setCameraPosition() method sets the camera's center position to (x,y)
Display.prototype.setCameraPosition = function(x, y) {
    this.cameraX = x;
    this.cameraY = y;
};

// The getCameraPosition() method returns the camera's center position
// in an 2-length array [x, y]
Display.prototype.getCameraPosition = function() {
    return [this.cameraX, this.cameraY];
};

// The translateCamera() method applys a translation (x,y) to the camera's position
Display.prototype.translateCamera = function(x, y) {
    this.cameraX += x * Math.max(1, intdiv(this.visibleCellsX, 10));
    this.cameraY += y * Math.max(1, intdiv(this.visibleCellsY, 10));
};

// The setCameraPosition() method sets the camera's center position to the map center.
Display.prototype.fitCameraPosition = function(x, y) {
    var x = intdiv(this.world.width, 2);
    var y = intdiv(this.world.height, 2);
    this.setCameraPosition(x, y);
};

// The setZoom() method returns the zoom value.
Display.prototype.getZoom = function(percentage) {
    return this.zoom * 100;
};

// The setZoom() method sets the zoom to an absolute value in percentage.
Display.prototype.setZoom = function(percentage) {
    var z = percentage / 100;
    this.zoom = Math.max(1.0, z);

};

// The increaseZoom() method increases or decrease the zoom according to the given points
Display.prototype.increaseZoom = function(points) {
    this.setZoom(this.getZoom() * (1 + points / 5));
};

// The worldCoordFromMousePos() method returns the world coordinate of the cells
// that corresponds to the mouse position on the canvas.
Display.prototype.worldCoordFromMousePos = function(mouseX, mouseY) {
    var worldX = mod(this.startX + intdiv(mouseX, this.cellWidth), this.world.getWidth());
    var worldY = mod(this.startY + intdiv(mouseY, this.cellHeight), this.world.getHeight());
    return {
        x: worldX,
        y: worldY
    };
}

/**
 * Class UI
 *
 * Designed to:
 *      - offer a control panel to the user
 *      - switch user commands to others instances (world, display, ...)
 */
function UI(canvas, world, display, process) {
    this.canvas = canvas;
    this.world = world;
    this.display = display;
    this.process = process;

    // Buttons
    this.playButton = document.getElementById('uiPlayButton');
    this.stopButton = document.getElementById('uiStopButton');

    // Events
    this.events = {
        zoomPlus: false,
        zoomMinus: false,

        arrowUp: false,
        arrowDown: false,
        arrowLeft: false,
        arrowRight: false,

        rightClick: false,
    };
    this.mousePosition = null;
    this.updateEventsTimer = null;

    this._bind();
  }

UI.prototype._bind = function() {
    var that = this;

    // Events listeners
    canvas.addEventListener('mousedown', function (evt) {
        that.mouseClickEvent(evt, true); }, false);
    canvas.addEventListener('mouseup', function (evt) {
        that.mouseClickEvent(evt, false); }, false);
    canvas.addEventListener('mouseout', function (evt) {
        that.mouseClickEvent(evt, false); }, false);
    canvas.addEventListener('mousemove', function (evt) {
        that.mouseMoveEvent(evt); }, false);

    window.addEventListener('keydown', function (evt) {
        that.keyboardEvent(evt, true); }, false);
    window.addEventListener('keyup', function (evt) {
        that.keyboardEvent(evt, false); }, false);

    // Buttons    
    this.playButton.onclick = function () { that.playButtonClick(); };
    this.stopButton.onclick = function () { that.stopButtonClick(); };

    this.updateEventsTimer = window.setInterval(function () { that.updateEvents();}, 50);
};

// The _getMousePosition() private method returns the position relative
// to the canvas of the mouse.
UI.prototype._getMousePosition = function(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

UI.prototype.playButtonClick = function() {
    if (this.process.isPlaying()) {
        this.process.pause();
        this.playButton.value = 'play';
    } else {
        this.process.play();
        this.playButton.value = 'pause';
    }
};

UI.prototype.stopButtonClick = function() {
    this.process.stop();
    this.playButton.value = 'play';
};

UI.prototype.mouseClickEvent = function(evt, isDown) {
    this.events.rightClick = isDown;
    this.mousePosition = this._getMousePosition(evt);
};

UI.prototype._mouseSpreadsCells = function() {
    if (this.events.rightClick) {
        var worldPos = display.worldCoordFromMousePos(
            this.mousePosition.x, this.mousePosition.y);
        this.world.setTile(worldPos.x, worldPos.y, true);
    }
};

UI.prototype.mouseMoveEvent = function (evt) {
    this.mousePosition = this._getMousePosition(evt);
    this._mouseSpreadsCells();
};

UI.prototype.updateEvents = function() {
    if      (this.events.zoomPlus)  this.display.increaseZoom(1);
    else if (this.events.zoomMinus) this.display.increaseZoom(-1);

    if (this.events.arrowLeft)  this.display.translateCamera(-1, 0);
    if (this.events.arrowRight) this.display.translateCamera(1, 0);
    if (this.events.arrowUp)    this.display.translateCamera(0, -1);
    if (this.events.arrowDown)  this.display.translateCamera(0, 1);

    this._mouseSpreadsCells();
};

UI.prototype.keyboardEvent = function(evt, isDown) {
    if (evt.defaultPrevented) {
        return ;
    }

    switch (evt.keyCode) {
        // camera zoom
        case 107:
            this.events.zoomPlus = isDown;
            break;
        case 109:
            this.events.zoomMinus = isDown;
            break;

        // camera moves
        case 37:
            this.events.arrowLeft = isDown;
            break;
        case 39:
            this.events.arrowRight = isDown;
            break;
        case 38:
            this.events.arrowUp = isDown;
            break;
        case 40:
            this.events.arrowDown = isDown;
            break;

        default:
            return;
    }

    evt.preventDefault();
};

var canvas = document.getElementById('canvas');
var world = new World();
var display = new Display(canvas, world);
var process = new Process(world, display);
var ui = new UI(canvas, world, display, process);

// Browsers compatibility.
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Launch the 'game-loop'
window.requestAnimFrame(function callback(timestamp) {
    process.run(timestamp);
    window.requestAnimFrame(callback);
});
