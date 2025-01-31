/*
This is to count up all expense that has grey background for total expense

*/


function sumByColor() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getDataRange();
  var numRows = range.getNumRows();  // Get the entire data range of the sheet
  var numCols = range.getNumColumns();
  var sum = 0;
  
  // Loop through all the cells in the range
  for (var i = 1; i <= numRows; i++) {
    for (var j = 1; j <= numCols; j++) {
      var currentCell = range.getCell(i,j)
      // Check if the background color is grey (you can change the color code if needed)
      if (currentCell.getBackground() === "#d9d9d9") {  // Light grey color code
        
        var cellVal = currentCell.getValue();
        if (typeof cellVal === 'number'){
          sum += cellVal
          //Logger.log(sum)
        }
      }
    }
  }
  return sum; // Return the sum
}
