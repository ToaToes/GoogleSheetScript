/*
This is to debug and log the color of certain background in a sheet, find out its hex number
*/

function debugBackgroundColor() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getDataRange();
  var numRows = range.getNumRows();
  var numCols = range.getNumColumns();
  
  for (var i = 1; i <= numRows; i++) {
    for (var j = 1; j <= numCols; j++) {
      var currentCell = range.getCell(i, j);
      var backgroundColor = currentCell.getBackground();
      Logger.log("Cell (" + i + "," + j + "): " + backgroundColor + currentCell.getValue());
    }
  }
}
