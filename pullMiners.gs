// This code is to mark machine at required position as PULLED state, (machine not running)
// 1. set the background color to RED
// 2. add ! sign at the end to show state (not running)

function pullMiners() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = sheet.getSheetByName("Sheet1"); // Sheet where user inputs data
  
  // the user input is in cell A1 of the "Sheet1" sheet
  var inputData = inputSheet.getRange("C1").getValue(); 
  var macAddress = inputSheet.getRange("C2").getValue(); 
  var snNum = inputSheet.getRange("C3").getValue(); 

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

  // check if the cell at the position contains correct information
  var cell_check = targetSheet.getRange(targetCell1).getValue()
  // check if its backup machine
  if (cell_check.includes('#')){
    SpreadsheetApp.getUi().alert("This is a backup machine!");
    return; // stop the script for checking data input
  }
  // check if its empty slot that there is no machine to pull
  if (cell_check.isBlank()){
    SpreadsheetApp.getUi().alert("There is no machine at this slot!");
    return; // stop the script for checking data input
  }
  // check if its already a pulled machine
  if (cell_check.includes('!')){
    SpreadsheetApp.getUi().alert("This is already a pulled machine!");
    return; // stop the script for checking data input
  }

  // Insert the value into the specified cell
  targetSheet.getRange(targetCell1).setValue(macAddress + "!").setBackground("red")
  targetSheet.getRange(targetCell2).setValue(snNum + "!").setBackground("red")


  // Optionally clear the input cell after submission
  inputSheet.getRange("C1").clearContent();
  inputSheet.getRange("C2").clearContent();  
  inputSheet.getRange("C3").clearContent();
  
  // Provide feedback (e.g., show an alert message)
  SpreadsheetApp.getUi().alert("Pull Miners Action Processed!");
}
