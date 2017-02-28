/* "ConwayCell" Constructor Function Definition 
 * Parameters: offsetLeft ---> Horizontal distance (pixels) between top-left
 *                             corners of canvas container and cell
 *             offsetTop ----> Vertical distance (pixels) between top-left 
 *                             corners of canvas container and cell
 *             width --------> Width of Conway Cell (pixels) */
function ConwayCell (offsetLeft, offsetTop, width) {
    this.offsetLeft = offsetLeft; // distance between canvas's and cell's left edges
    this.offsetTop = offsetTop;   // distance between canvas's and cell's top edges
    this.width = width; // width of the cell in pixels
    this.state = 0;     // state of the cell (0 = 'off' or 'dead'; 1 = 'on' or 'alive')
    this.nextState = this.state;
}

/* "invert" : ConwayCell Method Definition
 * Purpose: Inverts the state of Conway Cell */
ConwayCell.prototype.invert = function () {
    if (this.state == 0)
        this.state = 1;
    else
        this.state = 0;
}

/* "isAlive" : ConwayCell Method Definition
 * Purpose: Return true if this Conway Cell's state is 1; return false otherwise */
ConwayCell.prototype.isAlive = function() {
    if (this.state == 1)
        return true;
    else
        return false;
}

/* "render" : ConwayCell Method Definition
 * Purpose: Render a Conway Cell to a canvas element
 * Parameters: context ---> The 2d context of a HTML5 canvas element */
ConwayCell.prototype.render = function (context) {
    if (this.state == 0) {
        context.fillStyle = "black";
	context.fillRect(this.offsetLeft, this.offsetTop, this.width, this.width);
    }
    else {
        context.fillStyle = "rgb(80, 80, 80)";
	context.fillRect(this.offsetLeft, this.offsetTop, this.width, this.width);
    }
}

ConwayCell.prototype.setNextState = function (numberOfLivingNeighbors) {
    // Used in the generateNextStates method of the Board class
    // Based on Conway's rules, sets the 'nextState' property of this cell
    if (this.isAlive()) {
        if (numberOfLivingNeighbors < 2 || numberOfLivingNeighbors > 3) {
            this.nextState = 0;
        }
        else {
	    this.nextState = 1;
	}
    }
    else if (numberOfLivingNeighbors == 3) {
        this.nextState = 1;
    }
    else {
	this.nextState = 0;
    }
}

ConwayCell.prototype.updateState = function () {
    this.state = this.nextState;
}


/* "ConwayBoard" Constructor Function Definition
 * Parameters: numberOfCellsHigh ---> Height of the Conway Board (number of cells)
 *             numberOfCellsWide ---> Width of the Conway Board (number of cells)
 *             widthOfSquareCell ---> Width (in pixels) of one Conway Cell
 *             canvasID ------------> HTML id for a canvas element
 */
function ConwayBoard (numberOfCellsHigh, numberOfCellsWide, widthOfSquareCell, canvasID) {
    this.margin = 1;
    this.cellDim = widthOfSquareCell;
    this.width = numberOfCellsWide;
    this.height = numberOfCellsHigh;
    this.initializeCellArray();
    this.initializeContainer(canvasID);
}

/* "countLiving" - ConwayBoard Method Definition
 * Purpose: Given list of row and column indices, check the cells at these indices and
 *          count the number of live cells that they correspond to.
 * Parameters: indices ---> An array containing 1x2 arrays of indices.
 * Returns: The number of living cells referenced by the input indices */
ConwayBoard.prototype.countLiving = function (indices) {
    var numberOfLiving = 0;
    for (var i = 0; i < indices.length; i++) {
        var validIndex = (indices[i][0] >= 0 && indices[i][0] < this.height) &&
		         (indices[i][1] >= 0 && indices[i][1] < this.width);
        if (validIndex && this.cellArray[indices[i][0]][indices[i][1]].isAlive()) {
            numberOfLiving++;
        }
    }
    return numberOfLiving;
}

/* "initializeCellArray" - ConwayBoard Method Definition
 * Purpose: Return a 2 dimensional array of Conway Cells
 * Parameters: None
 * Returns: (vertical length) x (horizontal length) array of Conway Cells */
ConwayBoard.prototype.initializeCellArray = function () {
    this.cellArray = new Array();
    for (var i = 0; i < this.height; i++) {
	var offsetTop = i * (this.margin + this.cellDim);
	this.cellArray.push(new Array());
        for (var j = 0; j < this.width; j++) {
            var offsetLeft = j * (this.margin + this.cellDim);
	    this.cellArray[i].push(new ConwayCell(offsetLeft, offsetTop, this.cellDim));
	}
    }
}

/* "initializeContainer" - ConwayBoard Method Definition
 * Purpose: 1. Initializes 'container' property to a the HTML5 canvas
 *             that corresponds to the input ID
 *          2. Initializes 'context' property to the 2d context of the HTML5 canvas
 *          3. Sets the canvas dimensions (in pixels)
 *          4. Adds an event listener and function to handle clicking inside the canvas
 * Parameters: canvasID ---> HTML id for a canvas element */
ConwayBoard.prototype.initializeContainer = function (canvasID) {
    this.container = document.getElementById(canvasID);
    this.context = this.container.getContext('2d');
    
    // Set dimensions of the canvas
    this.container.width = this.width * (this.cellDim + this.margin);
    this.container.height = this.height * (this.cellDim + this.margin);
    
    // Add event listener and a function to handle clicks
    var board = this;
    this.container.addEventListener('click', function(event) {processClick(event, board)});
    function processClick(click, board) {
        var rect = board.container.getBoundingClientRect();
	var col = Math.floor((click.pageX - rect.left) / (board.cellDim	+ board.margin)),
	    row = Math.floor((click.pageY - rect.top) / (board.cellDim + board.margin));
        board.invertCell(row, col);
	board.render();
    }
}

/* "generateNextStates" - Conway Board Method Definition
 * Purpose: Determines the appropriate next state of every cell on the Conway Board and
 *          sets the nextState property of each cell to that value. */
ConwayBoard.prototype.generateNextStates = function () {
    for (var i = 0; i < this.height; i++) {
        for (var j = 0; j < this.width; j++) {
	    var neighborIndices = [[i-1, j-1],
		                   [i-1, j  ],
		                   [i-1, j+1],
		                   [i  , j-1],
		                   [i  , j+1],
		                   [i+1, j-1],
		                   [i+1, j  ],
		                   [i+1, j+1]];
	    this.cellArray[i][j].setNextState(this.countLiving(neighborIndices));
        }
    }
}

/* ConwayBoard Method Definition
 * Purpose: Given coordinates of a Conway Cell, call that cell's invert method,
 *          which inverts its state
 * Parameters: row ---> Row number (starting from 0) of a Conway Cell
 *             col ---> Column number (starting form 0) of a Conway Cell */
ConwayBoard.prototype.invertCell = function (row, col) {
    this.cellArray[row][col].invert();
}

/* ConwayBoard Method Definition
 * Purpose: Render all of the Conway Cells on the Conway Board */
ConwayBoard.prototype.render = function () {
    for (var i = 0; i < this.height; i++) {
        for (var j = 0; j < this.width; j++) {
            this.cellArray[i][j].render(this.context);
        }
    }
}

/* ConwayBoard Method Definition
 * Purpose: Run one generation of Conway's Game of Life and render the board */
ConwayBoard.prototype.simulate = function () {
    this.generateNextStates();
    this.updateStates();
    this.render();
}

/* "updateStates" - ConwayBoard Method Definition
 * Purpose: Call updateState method for each cell in cellArray */
ConwayBoard.prototype.updateStates = function () {
    for (var i = 0; i < this.height; i++) {
        for (var j = 0; j < this.width; j++) {
            this.cellArray[i][j].updateState();
        }
    }   
}
