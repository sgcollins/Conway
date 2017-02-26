// Constructor function for a Conway Cell
// Inputs: x ---> Horizontal position of the cell (unit=cells)
//                relative to the left edge of the container
//         y ---> Vertical position of the cell (unit=cells)
//                relative to the top edge of the container
class ConwayCell
{
    constructor(x, y, width)
    {
        this.x_position = x;
        this.y_position = y;
        this.width = width;
        this.state = 0;
    }

    invert()
    {
        this.state = 1 % this.state;
    }

    render(context)
    {
        if (this.state == 0)
        {
            context.fillStyle = 'green';
            context.fillRect(this.x_position, 
                             this.y_position,
                             this.width,
                             this.width);
        }
        else
        {
            context.fillStyle = 'red';
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
	//
	// Indices are mapped according to the following structure:
	// 0 4 8
	// 1 5 9
	// 2 6 10
	// 3 7 11
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
                this.cellArray.push(new ConwayCell(x, y, cellSize));
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
	console.log(index);
	this.cellArray[index].invert();
    }
}

// Function to handle click event
function processClick(clickEvent, board)
{
    console.log(board);
    console.log(clickEvent);
    // Get the coordinates of click relative to top left corner of the container
    var click_x_coord = clickEvent.pageX - board.container.offsetLeft,
        click_y_coord = clickEvent.pageY - board.container.offsetTop;

    // Convert coordinates of click to row and column indices of the Cell Array
    var col = Math.ceil(click_x_coord / (board.cellSize + board.margin)),
        row = Math.ceil(click_y_coord / (board.cellSize + board.margin));

    // Log the coordinates of click
    console.log("Row: " + row);
    console.log("Col: " + col);

    // Update the board
    board.invertCell(row, col);

    // Render the board again
    board.render();
}
