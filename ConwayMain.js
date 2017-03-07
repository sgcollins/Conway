var cellSize = 12; // Default dimension of square cells (pixels)

// 
var canvas = document.getElementById("conway_canvas");
fitCanvas(canvas);

// Calculate default number of rows and columns
var numRows = Math.floor(canvas.height / cellSize);
var numCols = Math.floor(canvas.width / cellSize);
var renderArea = [1, numRows, 1, numCols];
var conwayBoard = new Board(renderArea[1] - renderArea[0] + 1, renderArea[3] - renderArea[2] + 1);
var pad = 0.5; // Pixels to surround each cell
render(conwayBoard, canvas, renderArea, cellSize, pad);

// Add event listeners
canvas.addEventListener('click', function(e) {processClick(e, conwayBoard)});
var timeout = 0;
document.getElementById("run").addEventListener('click', run);
document.getElementById("pause").addEventListener('click', pause);
window.addEventListener("resize", function() {fillWindow(canvas, conwayBoard, cellSize)});



// window.setInterval(function() {fillWindow(canvas, conwayBoard, cellSize)}, 500);

function fillWindow (canvas, board, cellSize)
// Precondition:  [canvas] is a HTML canvas element
//                [board] is a Board object
//                [cellSize] is height/width of the cells
// Postcondition: Rows/Columns are added/removed to/from ends of board until
//                window is exactly filled
{
   fitCanvas (canvas);
   var heightGap = canvas.height - (board.getCells().length * cellSize);
   var widthGap  = canvas.width  - (board.getCells()[0].length * cellSize);
   var newRows = towardZero(heightGap / cellSize);
   var newColumns = towardZero(widthGap / cellSize);
   board.adjustDimensions(newRows, newColumns);
   renderArea = [1, board.numRows, 1, board.numCols];
   render(board, canvas, renderArea, cellSize, pad); 
}

function fitCanvas (canvas) {
// Precondition:  [canvas] is a HTML canvas element
// Postcondition: [canvas] will be resized to fit the window's inner dimensions
   canvas.width  = window.innerWidth 
                   || document.documentElement.clientWidth
                   || document.body.clientWidth;
   canvas.height = window.innerHeight
                   || document.documentElement.clientHeight 
                   || document.body.clientHeight;
   canvas.height -= getElementPosition(canvas)[0];
   canvas.width -= getElementPosition(canvas)[1];
}


function getElementPosition (e) {
// Precondition:  [e] is an HTML element object
// Returns:       Coordinates of the top left corner of element [e] (relative to 
//                origin of browser window) in array [pixelsDown, pixelsRight]
   var totalTopOffset = 0,
       totalLeftOffset = 0;
   while (e) { // Loop up hierarchy of HTML elements until body reached
      if (e.tagName == "BODY") {
         // Some browsers store scroll amount in body element; others store in
         // document element. Following statements return the desired amounts
         var scrollTop  = e.scrollTop  || document.documentElement.scrollTop;
         var scrollLeft = e.scrollLeft || document.documentElement.scrollLeft;

         // cumulativeOffset += margin_padding_offset - scroll_offset + border_offset 
         totalTopOffset  += (e.offsetTop - scrollTop + e.clientTop);
         totalLeftOffset += (e.offsetLeft - scrollLeft + e.clientLeft);
      }
      else { // Add margin, padding, border offset and subtract scroll offset
         totalTopOffset  += (e.offsetTop + e.clientTop - e.scrollTop);
         totalLeftOffset += (e.offsetLeft + e.clientLeft - e.scrollLeft);
      }
      e = e.offsetParent;
   }
   return [totalTopOffset, totalLeftOffset];
}   


function processClick (click, board) {
// Precondition:  [click] is a click event
//                [board] is a Board object
// Postcondition: State of the cell at coordinates of [click] is inverted
   var canvasCoords = getElementPosition(canvas);
   var row = Math.ceil((click.clientY - canvasCoords[0]) / cellSize);
   var col = Math.ceil((click.clientX - canvasCoords[1]) / cellSize);
   board.invertState(row, col);
   render(board, canvas, renderArea, cellSize, pad);
}


function render (board, canvas, renderArea, cellSize, pad) {
// Precondition:  [board] is a Board object
//                [canvas] is a HTML5 canvas element
//                [renderArea] is 1x4 array [rowStart, rowEnd, colStart, colEnd]
//                [pad] is number of pixels surrounding each cell
// Postcondition: Current state of [board] is rendered on the canvas element
   var context = canvas.getContext('2d');
   var cells = board.getCells();
  
   for (var i = renderArea[0] - 1; i < renderArea[1]; i++) {
      var rowPixel = (i * cellSize + 1);
      for (var j = renderArea[2] - 1; j < renderArea[3]; j++) {
         if (cells[i][j].isAlive()) 
            context.fillStyle = "rgb(100, 100, 100)";
         else
            context.fillStyle = "rgb(0, 0, 0)";
         var colPixel = (j * cellSize + 1);
         context.fillRect(colPixel, rowPixel, cellSize - pad*2, cellSize - pad*2);
      }
   }
}


function run () {
   if (timeout === 0)
      timeout = window.setInterval(function() {update(conwayBoard, canvas)}, 50);
}


function towardZero (number) {
   if (number >= 0) {
      return Math.floor(number);
   }
   else {
      return Math.ceil(number);
   }
}


function pause () {
   window.clearInterval(timeout);
   timeout = 0;
}


function update (board, canvas) {
   board.update();
   //fitCanvas(canvas);
   /* Experimental code to get the canvas to resize with window
   cellSize = Math.floor(canvas.height / numRows);
   if (cellSize > Math.floor(canvas.width / numCols))
      cellSize = Math.floor(canvas.width / numCols);
   */ 
   render(board, canvas, renderArea, cellSize, pad);
}