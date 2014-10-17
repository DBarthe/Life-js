/**
 * File : script.js (to be changed)
 * Author: Barthelemy DELEMOTTE
 * Starting : October 2014
 * Purpose: Implementing a game of life in javascript with html canvas. 
 */



/**
 * Class Tile
 *
 * Designed to:
 *      - store informations about a cell
 *          - state (alive, dead)
 *          - meta (if alive : just-born, will-die, short-lived, long-lived)
 */
function Tile() {
}

// The isAlive() method returns true if the tile is alive. 
Tile.prototype.isAlive = function() {
};

// The isDead() method returns true if the tile is dead
Tile.prototype.isDead = function() {
    return !this.lives ;
};

// The born() method set the cell's state to 'alive'.
Tile.prototype.born = function() {
};

// The die() method set the cell's state to 'dead'
Tile.prototype.die = function() {
};

// The MetaState static enumerate type is used by Tile to tell its meta-state.
Tile.MetaState = {'justBorn' : 0, 'willDie' : 1, 'shortLived' : 2, 'longLived' : 3} ;

// The getMetaState() method returns the meta-state of the cell (in the Tile.MetaState type).
// Because a dead cell haven't meta-state, this method returns undefined if the cell is dead.
Tile.prototype.getMetaState = function() {
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
}

// The getTile(int,int) method allows to access to a tile by giving its coordinates.
World.prototype.getTile = function(x, y) {
};

// The setTitle(int,int,bool) method sets the tile's state at the given coordinates
// (true for alive, false for dead)
World.prototype.setTile = function(x, y, state) {
};

// The clear() method kills all cells.
World.prototype.clear = function() {
};

// The setSeveralTiles() method set to alive several tile's states to 'alive'.
// The parameter 'group' must be an array of 2-lenght arrays. For exemple:
//    group = [[x1,y1], [x2,y2], ... ]
World.prototype.setSeveralTiles = function(group) {
};

// The unsetSeveralTiles() method is the same than setSeveralTiles(), but killing cells.
World.prototype.unsetSeveralTiles = function(group) {
};

// The nextGeneration() method do one cycle, modifying the grid.
World.prototype.nextGeneration = function() {
};

// The getWidth() method returns the current grid width.
World.prototype.getWidth = function () {
};

// The getHeight() method returns the current grid height.
world.prototype.getHeight = function {
};


/**
 * Class Process
 *
 * Designed to:
 *      - Clock the world
 *      - Can be paused, played, stoped, sped up, ...
 *      - Synchronize World and Display
 */
function Process() {
}

// The play() method starts the game.
Process.prototype.play = function() {
};

// The pause() method stops the game but keeps the world's state.
Process.prototype.pause = function() {
};

// The stop() method stops the game and clear the world.
Process.prototype.stop = function() {
};

// The begin() method stops the game and set the world to the initial state.
Process.prototype.begin = function() {
};

// The restart() method is like begin() but plays straight.
Process.prototype.restart = function() {
};

// The setInterval() method sets the interval between each generation.
Process.prototype.setInterval = function(intval) {
};

// The getInterval() method gets the interval between each generation.
Process.prototype.getInterval = function() {
};

// The increaseInterval() method increase the interval between each generation.
// The 'intval' can be negative. 
Process.prototype.increaseInterval = function(intval) {
};

// The run() method is called at each frame by requestAnimationFrame().
// This method do several generations according to the generation's interval
// and one draw().
Process.prototype.run = function() {
};


/**
 * Class Display
 *
 * Designed to:
 *      - Draw the world on a canvnas
        - Manage a camera : position, zoom
        - display additional layers
        - resize canvnas and set others attributes
 */
function Display() {
}

// The draw() method refreshs the canvas
Display.prototype.draw = function() {
};

// The scale() method changes the scale of the canvas
Display.prototype.scale = function(width, height) {
};

// The setCameraPosition() method sets the camera's center position to (x,y)
Display.prototype.setCameraPosition = function(x, y) {
};

// The getCameraPosition() method returns the camera's center position
// in an 2-length array [x, y]
Display.prototype.getCameraPosition = function() {
};

// The translateCamera() method applys a translation (x,y) to the camera's position
Display.prototype.translateCamera = function(x, y) {
};

// The setCameraPosition() method sets the camera's center position to the map center.
Display.prototype.fitCameraPosition = function(x, y) {
};

// The setZoom() method set the zoom to an absolute value in percentage.
Display.prototype.setZoom = function(percentage) {
};

// The zoom() method increase or decrease the zoom according to the given points
Display.prototype.zoom = function(points) {
};


/**
 * Class UI
 *
 * Designed to:
 *      - offer a control panel to the user
 *      - switch user commands to others instances (world, display, ...)
 */
function UI() {
}