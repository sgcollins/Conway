var DEFAULT_CELL_SIZE = 20;
var pad = 1;     // Pixels to surround each cell

// Initialize canvas
var canvas = document.getElementById("conway_canvas");
fitCanvas(canvas, DEFAULT_CELL_SIZE);

// Create and initialize board
var conwayBoard = new Board(canvas, DEFAULT_CELL_SIZE);

render(conwayBoard, canvas, pad);

// Click event listener
canvas.addEventListener('click', function(e) {processClick(e, conwayBoard)});

// Run and Pause event listeners
var timeout = 0;
document.getElementById("run").addEventListener('click', run);
document.getElementById("pause").addEventListener('click', pause);

// Resize event listener
window.addEventListener("resize", function() {resize(canvas, conwayBoard)});


function resize (canvas, board)
// Precondition:  [canvas] is a HTML canvas element
//                [board] is a Board object
// Postcondition: Rows/Columns are added/removed to/from ends of board until
//                window is exactly filled
{
   fitCanvas (canvas, board.cellSize); // Fits canvas dimensions to the window

   // Height Resize
   var heightGap  = canvas.height - board.getPixelHeight();
   var newRows    = Math.floor(heightGap / board.cellSize);
   if (newRows >= 0) {
      board.addRows(newRows);
   }
   board.rowEnd  += newRows;  

   // Width Resize
   var widthGap   = canvas.width - board.getPixelWidth();
   var newColumns = Math.floor(widthGap / board.cellSize);
   if (newColumns >= 0) {
      board.addCols(newColumns);
   }
   board.colEnd  += newColumns;

   // Call the board's [crop] function
   board.crop();

   render(board, canvas, pad); 
}


function fitCanvas (canvas, cellSize) {
// Precondition:  [canvas] is a HTML canvas element
// Postcondition: [canvas] will be resized to fit the window's inner dimensions
   var fullHeight = getWindowDimensions()[0] - getElementPosition(canvas)[0];
   var fullWidth  = getWindowDimensions()[1] - getElementPosition(canvas)[1];
   canvas.height  = fullHeight - (fullHeight % cellSize);
   canvas.width   = fullWidth - (fullWidth % cellSize);
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


function getWindowDimensions () {
// Returns: 1x2 Array of pixel dimensions [windowHeight, windowWidth]
   var windowHeight = window.innerHeight ||
                      document.documentElement.clientHeight ||
                      document.body.clientHeight;
   var windowWidth  = window.innerWidth ||
                      document.documentElement.clientWidth ||
                      document.body.clientWidth;
   return [windowHeight, windowWidth];
}


function processClick (click, board) {
// Precondition:  [click] is a click event
//                [board] is a Board object
// Postcondition: State of the cell at coordinates of [click] is inverted
   var canvasCoords = getElementPosition(canvas);
   var row = Math.ceil((click.clientY - canvasCoords[0]) / board.cellSize);
   var col = Math.ceil((click.clientX - canvasCoords[1]) / board.cellSize);
   board.invertState(row, col);
   render(board, canvas, pad);
}


function render (board, canvas, pad) {
// Precondition:  [board] is a Board object
//                [canvas] is a HTML5 canvas element
//                [pad] is number of pixels surrounding each cell
// Postcondition: Current state of [board] is rendered on the canvas element
   var context = canvas.getContext('2d');
   var cells = board.getCells();
  
   for (var i = board.rowStart; i <= board.rowEnd; i++) {
      var rowPixel = (i * board.cellSize + 1);
      for (var j = board.colStart; j <= board.colEnd; j++) {
         if (cells[i][j].isAlive()) 
            context.fillStyle = "rgb(100, 100, 100)";
         else
            context.fillStyle = "rgb(0, 0, 0)";
         var colPixel = (j * board.cellSize + 1);
         context.fillRect(colPixel, rowPixel, board.cellSize - pad*2, board.cellSize - pad*2);
      }
   }
}


function run () {
   if (timeout === 0)
      timeout = window.setInterval(function() {update(conwayBoard, canvas)}, 50);
}


function roundTowardZero (number) {
   if (number > 0) {
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
   render(board, canvas, pad);
}