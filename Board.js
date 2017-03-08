function Board (canvas, cellSize) {
// Precondition:  Cell constructor function and prototypes have been defined
// Postcondition: Board object has been created and initialized
   this.cellSize = cellSize;

   this.numRows = Math.floor(canvas.height / this.cellSize);
   this.numCols = Math.floor(canvas.width  / this.cellSize);

   this.rowStart = 0;                // Index of row to start rendering at
   this.rowEnd   = this.numRows - 1; // Index of row to end rendering at
   this.colStart = 0;                // Index of column to start rendering at
   this.colEnd   = this.numCols - 1; // Index of column to end rendering at

   // Create and initialize an array of cells
   this.cellArray = new Array();
   for (var i = 0; i < this.numRows; i++) {
      this.cellArray.push(new Array());
      for (var j = 0; j < this.numCols; j++) {
         this.cellArray[i].push(new Cell());
      }
   }
}


Board.prototype.addCols = function (newCols) {
   for (var i = 0; i < this.numRows; i++) {
      for (var j = 0; j < newCols; j++) {
         this.cellArray[i].push(new Cell());
      }
   }
   this.numCols += newCols;
}


Board.prototype.addRows = function (newRows) {
   for (var i = 0; i < newRows; i++) {
      this.cellArray.push(new Array());
      this.numRows++;
      for (var j = 0; j < this.numCols; j++) {
         this.cellArray[this.numRows - 1].push(new Cell());
      }
   }
}


/*
Board.prototype.adjustDimensions = function (newRows, newColumns) {
// Precondition:  - [newRows] represents number of rows to add (if positive) or
//                  number of rows to remove (if negative)
//                - [newColumns] represents number of columns to add (if 
//                  positive) or number of columns to remove (if negative)
// Postcondition: Dimensions of board are adjusted
   if (newRows > 0) {
      var rows = this.numRows;
      var cols = this.numCols;
      for (var i = rows; i < (rows + newRows); i++) {
         this.cellArray.push(new Array());
         this.numRows++;
         for (var j = 0; j < cols; j++) {
            this.cellArray[i].push(new Cell());
         }
      }
      this.rowEnd = this.numRows - 1;
   }

   if (newColumns > 0) {
      var rows = this.numRows;
      var cols = this.numCols;     
      for (var j = 0; j < newColumns; j++) {
         for (var i = 0; i < rows; i++) {
            this.cellArray[i].push(new Cell());
         }
         this.numCols++;
      }
      this.colEnd = this.numCols - 1;
   }
}
*/

Board.prototype.countLiving = function (indices) {
// Precondition:  [indices] is array of pairs of indices, with each pair taking
//                the form of an array [rowIndex, colIndex]
// Returns:       Number of cells, referenced by [indices], with state = 1
   var numLiving = 0;
   for (var i = 0; i < indices.length; i++) {
      var r = indices[i][0], // Row index
          c = indices[i][1]; // Column index
      var valid = (r >= 0 && r < this.numRows) && (c >= 0 && c < this.numCols);
      if (valid && this.cellArray[r][c].isAlive()) {
         numLiving++;
      }
   }
   return numLiving;
}


Board.prototype.crop = function () {
   var cropped = new Array();
   for (var i = 0; i <= (this.rowEnd - this.rowStart); i++) {
      cropped.push(new Array());
      for (var j = 0; j <= (this.colEnd - this.colStart); j++) {
         cropped[i].push(this.cellArray[this.rowStart + i][this.colStart + j]);
      }
   }

   // Update the indices that are to be rendered
   this.rowStart  = 0;
   this.rowEnd    = cropped.length - 1;
   this.colStart  = 0;
   this.colEnd    = cropped[0].length - 1;

   // Update the dimension properties
   this.numRows = cropped.length;
   this.numCols = cropped[0].length;

   this.cellArray = cropped;
}


Board.prototype.generateNextStates = function () {
// Precondition:  Board's cellArray has been created an initialized
// Postcondition: nextState determined for each cell by executing Conway's rules
   for (var i = 0; i < this.numRows; i++) {
      for (var j = 0; j < this.numCols; j++) {
         var currentCell = this.cellArray[i][j];
         var neighborIndices = [[i-1, j-1],  [i-1, j],  [i-1, j+1],
		                          [i  , j-1],  /*[i,j]*/  [i  , j+1],
                                [i+1, j-1],  [i+1, j],  [i+1, j+1]];
         var liveNeighbors = this.countLiving(neighborIndices);

         if (currentCell.isAlive()) {
            if (liveNeighbors < 2 || liveNeighbors > 3)  // isolation & crowding
               currentCell.invertNextState();
            else
               currentCell.retainState();
         }
         else {
            if (liveNeighbors === 3) // Cell dead with 3 live neighbors
               currentCell.invertNextState();
            else
               currentCell.retainState();
         }
      }
   }
}


Board.prototype.getCells = function () {
   return this.cellArray;
}


Board.prototype.getPixelHeight = function () {
   return ((this.rowEnd - this.rowStart + 1) * this.cellSize);
}


Board.prototype.getPixelWidth = function () {
   return ((this.colEnd - this.colStart + 1) * this.cellSize);
}


Board.prototype.invertState = function (row, col) {
// Precondition:  [row] and [col] are integers
// Postcondition: State of cell at ([row] - 1, [col] -1) is inverted
   if (row <= this.numRows && row > 0 && col <= this.numCols && col > 0) {
      this.cellArray[row - 1][col -1].invert();
   }
}


Board.prototype.update = function () {
// Precondition:  Board's cellArray has been created and initialized
// Postcondition: nextState is determined and state is updated for each cell
   this.generateNextStates();
   for (var i = 0; i < this.numRows; i++) {
      for (var j = 0; j < this.numCols; j++) {
         this.cellArray[i][j].updateState();
      }
   }
}