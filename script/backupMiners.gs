// This code is to mark machine at required position as BACKUP state, (machine ready to rack)
// 1. set the background color to GREEN
// 2. add # sign at the end to show state (backup state)


function backupMiners() {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = sheet.getSheetByName("Action"); // Sheet where user inputs data
  
  // the user input is in cell A1 of the "Action" sheet
  var inputData = inputSheet.getRange("C9").getValue(); 
  var macAddress = inputSheet.getRange("C10").getValue(); 
  var snNum = inputSheet.getRange("C11").getValue(); 
  var operator = inputSheet.getRange("C18").getValue();  

  var parts = inputData.split('.'); // Split the input by dots
  
  // base on the ip address to assign the machine to certain address
  if (parts.length === 4) {
    var sheetNum = parseInt(parts[1]);
    var col = parseInt(parts[2]);
    var row = parseInt(parts[3]);
  }

  // Get the correct sheet
  var sheetN = "C" + sheetNum // Convert to C*
  var targetSheet = sheet.getSheetByName(sheetN); 

  // Convert column num to letter
  var colLetter = String.fromCharCode(64 + col + 2);

  // Get the cell by combining col letter and row num
  var targetCell1 = colLetter + ((2*row) + 1)
  var targetCell2 = colLetter + ((2*row) + 1 + 1)


  // check if the cell at the position contains correct information
  var cell_check = targetSheet.getRange(targetCell1).getValue()
  // check if its backup machine
  if (cell_check.includes('#')){
    SpreadsheetApp.getUi().alert("This is already a backup machine!");
    return; // stop the script for checking data input
  }
  // check if its empty slot that there is no machine to pull
  if (cell_check == ""){
    SpreadsheetApp.getUi().alert("There is no machine at this slot!");
    return; // stop the script for checking data input
  }
  // check if its already a pulled machine
  if (cell_check.includes('!')){
    SpreadsheetApp.getUi().alert("This is a pulled machine!");
    return; // stop the script for checking data input
  }


  // Insert the value into the specified cell
  targetSheet.getRange(targetCell1).setValue(macAddress + "#").setBackground("#00ff00")
  targetSheet.getRange(targetCell2).setValue(snNum + "#").setBackground("#00ff00")


  // Log the action for tracing
  var logSheet = sheet.getSheetByName("Log");
  // Add a new row to the log sheet with the details of the move
  logSheet.appendRow([new Date(), "BACKUP", "", inputData, macAddress, snNum, operator]);


  // Optionally clear the input cell after submission
  inputSheet.getRange("C9").clearContent();
  inputSheet.getRange("C10").clearContent();  
  inputSheet.getRange("C11").clearContent();
  
  // Provide feedback (e.g., show an alert message)
  SpreadsheetApp.getUi().alert("Backup Miners Action Processed!");

}
