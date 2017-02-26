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
                this.cellArray.push(new ConwayCell(x, y, cellSize));
            }
        }

        // Get references to the canvas element and its content
        this.container = document.getElementById(canvasID);
        this.context = this.container.getContext('2d');

        // Set the size of the canvas element
        this.container.width = widthInCells * (cellSize + this.margin) + this.margin;
        this.container.height = heightInCells * (cellSize + this.margin) + this.margin;
    }

    // Function to render the Conway Board on the page
    render()
    {
        for (var i = 0; i < this.cellArray.length; i++)
        {
            // Pass a reference to the context object to the current
            // Conway Cell so that the cell can render itself
            this.cellArray[i].render(this.context);
        }
    }
}
