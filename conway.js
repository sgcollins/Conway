/* "ConwayCell" Constructor Function Definition 
 * Parameters: offsetLeft ---> Horizontal distance (pixels) between top-left
 *                             corners of canvas container and cell
 *             offsetTop ----> Vertical distance (pixels) between top-left 
 *                             corners of canvas container and cell
 *             width --------> Width of Conway Cell (pixels) */
function ConwayCell (offsetLeft, offsetTop, width)
{
    this.offsetLeft = offsetLeft; // distance between canvas's and cell's left edges
    this.offsetTop = offsetTop;   // distance between canvas's and cell's top edges
    this.width = width; // width of the cell in pixels
    this.state = 0;     // state of the cell (0 = 'off' or 'dead'; 1 = 'on' or 'alive')
}

/* Method definition to invert the state of Conway Cell */
ConwayCell.prototype.invert = function ()
{
    if (this.state == 0)
        this.state = 1;
    else
        this.state = 0;
}

/* ConwayCell Method Definition
 * Purpose: Render a Conway Cell to a canvas element
 * Parameters: context ---> The 2d context of a HTML5 canvas element */
ConwayCell.prototype.render = function (context)
{
    if (this.state == 0)
    {
        context.fillStyle = "black";
        // console.log("\toffsetLeft: " + this.offsetLeft + "\toffsetTop: " + this.offsetTop +"\tWidth: " + this.width);
	// console.log(context);
	context.fillRect(this.offsetLeft, this.offsetTop, this.width, this.width);
    }
    else
    {
        context.fillStyle = "rgb(80, 80, 80)";
	context.fillRect(this.offsetLeft, this.offsetTop, this.width, this.width);
    }
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

/* ConwayBoard Method Definition - Constructor Helper
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

/* ConwayBoard Method Definition - Constructor Helper
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
    console.log("Height in cells: " + this.height);
    console.log("Cell Height: " + this.cellDim);
    console.log("Container Width: " + this.container.width);
    console.log("Container Height: " + this.container.height);
    
    // Add event listener and a function to handle clicks
    var board = this;
    this.container.addEventListener('click', function() {processClick(event, board)});
    function processClick(click, board) {
        var rect = board.container.getBoundingClientRect();
	var col = Math.floor((click.pageX - rect.left) / (board.cellDim	+ board.margin)),
	    row = Math.floor((click.pageY - rect.top) / (board.cellDim + board.margin));
        board.invertCell(row, col);
	board.render();
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
	    // console.log("Cell " + (i+1) * (j+1) + ":");
            this.cellArray[i][j].render(this.context);
        }
    }
}
