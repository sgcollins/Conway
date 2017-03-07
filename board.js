function Board (cellsTall, cellsWide) {
// Precondition:  Cell constructor function and prototypes have been defined
// Postcondition: Board object has been created and initialized
   this.numCols = cellsWide;
   this.numRows = cellsTall;

   // Create and initialize an array of cells
   this.cellArray = new Array();
   for (var i = 0; i < this.numRows; i++) {
      this.cellArray.push(new Array());
      for (var j = 0; j < this.numCols; j++) {
         this.cellArray[i].push(new Cell());
      }
   }
}


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
         console.log(liveNeighbors);

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