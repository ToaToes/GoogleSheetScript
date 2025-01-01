// This code is to mark machine at required position as RUNNING state, 
// 1. clear the background color
// 2. remove the # sign at the end

function rackMiners() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = sheet.getSheetByName("Sheet1"); // Sheet where user inputs data
  
  // the user input is in cell A1 of the "Sheet1" sheet
  var inputData = inputSheet.getRange("C5").getValue(); 
  var macAddress = inputSheet.getRange("C6").getValue(); 
  var snNum = inputSheet.getRange("C7").getValue(); 

  var parts = inputData.split('.'); // Split the input by dots
  
  // base on the ip address to assign the machine to certain address
  if (parts.length === 4) {
    var sheetNum = parseInt(parts[1]);
    var col = parseInt(parts[2]);
    var row = parseInt(parts[3]);
  }

  // Get the correct sheet
  var targetSheet = sheet.getSheets()[sheetNum];

  // Convert column num to letter
  var colLetter = String.fromCharCode(64 + col + 2);

  // Get the cell by combining col letter and row num
  var targetCell1 = colLetter + ((2*row) + 1)
  var targetCell2 = colLetter + ((2*row) + 1 + 1)


  // Insert the value into the specified cell
  targetSheet.getRange(targetCell1).setValue(macAddress).setBackground(null)
  targetSheet.getRange(targetCell2).setValue(snNum).setBackground(null)


  // Optionally clear the input cell after submission
  inputSheet.getRange("C5").clearContent();
  inputSheet.getRange("C6").clearContent();  
  inputSheet.getRange("C7").clearContent();
  
  // Provide feedback (e.g., show an alert message)
  SpreadsheetApp.getUi().alert("Pull Miners Action Processed!");
}
