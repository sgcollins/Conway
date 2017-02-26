// Constructor function for a Conway Cell
// Inputs: x ---> Horizontal position of the cell (unit=cells)
//                relative to the left edge of the container
//         y ---> Vertical position of the cell (unit=cells)
//                relative to the top edge of the container
class ConwayCell
{
    constructor(x, y, width, row, col)
    {
        this.x_position = x;
        this.y_position = y;
        this.width = width;
        this.state = 0;
	this.row = row;
	this.col = col;
    }

    invert()
    {
        if (this.state == 0)
            this.state = 1;
	else
            this.state = 0;
    }

    render(context)
    {
        if (this.state == 0)
        {
            context.fillStyle = 'black';
            context.fillRect(this.x_position, 
                             this.y_position,
                             this.width,
                             this.width);
        }
        else
        {
            context.fillStyle = 'rgb(80, 80, 80)';
            context.fillRect(this.x_position, 
                             this.y_position,
                             this.width,
                             this.width);
        }
    }
}


// Constructor function for the board that contains Conway cells
// Inputs: cellSize -------> Width (in pixels) of each conway cell
//         widthInCells ---> Number of cells that the board is wide
//         heightInCells --> Number of cells that the board is tall
//         canvasID -------> The HTML ID of a canvas element
class ConwayBoard
{
    constructor(cellSize, widthInCells, heightInCells, canvasID)
    {
        this.margin = 1; // Number of pixels between cells
	this.cellSize = cellSize; // Width and Height of Conway Cells
	this.width = widthInCells;  // Width in cells
	this.height = heightInCells; // Height in cells

        // Array of Conway Cells
        this.cellArray = [];

        // Populate Cell Array with N Conway Cells 
        // (where N = widthInCells * heightInCells)
        for (var row = 1; row <= heightInCells; row++)
        {
            // Vertical coordinate of TOP-LEFT corners of cells
            // in this row
            var y = (row - 1) * cellSize + row * this.margin;

            for (var col = 1; col <= widthInCells; col++)
            {
                // Horizontal coordinate of TOP-LEFT corner of
                // this cell
                var x = (col - 1) * cellSize + col * this.margin;

                // Add the Conway Cell to the array
                this.cellArray.push(new ConwayCell(x, y, cellSize, row, col));
            }
        }

        // Get references to the canvas element and its content
        this.container = document.getElementById(canvasID);
        this.context = this.container.getContext('2d');

        // Set the size of the container
        this.container.width = widthInCells * (cellSize + this.margin) + this.margin;
        this.container.height = heightInCells * (cellSize + this.margin) + this.margin;

	// Add event listener for clicks
	board = this;
	this.container.addEventListener('click', function() {processClick(event, board)});
    }

    // Method to render the Conway Board on the page
    render()
    {
        for (var i = 0; i < this.cellArray.length; i++)
        {
            // Pass a reference to the context object to the current
            // Conway Cell so that the cell can render itself
            this.cellArray[i].render(this.context);
        }
    }

    // Method to invert the state of a Conway Cell in the board's Cell Array
    invertCell(row, col)
    {
        var index = (row - 1) * this.width + col - 1;
	this.cellArray[index].invert();
    }

    // Method to simulate Conway's Game of Life
    simulate()
    {
        var step = 1, maxStep = 1;
	while (step <= maxStep)
	{
            var newCellArray = [];
	    for (var i = 0; i < this.cellArray.length; i++)
	    {
                if (this.cellArray[i].state == 1)
                {
                    newCellArray.push(0);
	            newCellArray.push(1);
		    i++;
	        }
		else
	            newCellArray.push(0);
	    }
	    
            for (var i = 0; i < this.cellArray.length; i++)
            {
	        this.cellArray[i].state = newCellArray[i];
            }
	    this.render();
	    step++;
	}
    }
}

// Function to handle click event
function processClick(clickEvent, board)
{
    // Get coordinates of the container
    var rect = board.container.getBoundingClientRect();
  
    // Get the coordinates of click relative to top left corner of the container
    var click_x_coord = clickEvent.pageX - rect.left,
        click_y_coord = clickEvent.pageY - rect.top;

    // Convert coordinates of click to row and column indices of the Cell Array
    var col = Math.ceil(click_x_coord / (board.cellSize + board.margin)),
        row = Math.ceil(click_y_coord / (board.cellSize + board.margin));

    // Update the board
    board.invertCell(row, col);

    // Render the board again
    board.render();
}
