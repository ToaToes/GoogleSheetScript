// This code is to move machine at REQUIRED position to TARGET position, 
// FROM (C1-C21, or repairroom) TO (C1-C21, or repairroom)
/*
FROM C1-C21 TO C1-C21{
  1. clear content at the FROM location base on IP
  2. add machine to TARGET location base on IP
  3. CHECK if:
    1. FROM location empty [Alert]
    2. FROM location running [Alert]
    3. TO location not empty [Alert]
    4. if PULLED -> move to repairroom
    5. if BACKUP -> process okay
}
FROM C1-C21 TO Repairroom {
  1. clear content at the FROM location base on IP
  2. add machine to repairroom base on IP: 0.0.0.x (one col represent reqairroom machine list)
  3. CHECK if:
    1. FROM location empty [Alert]
    2. FROM location running [Alert]
    3. if PULLED -> move to repairroom
    4. if BACKUP -> backup move to repairroom [REMIND]
}
FROM Repairroom TO C1-C21{
  1. clear content at repairroom base on IP: 0.0.0.x
  2. add machine to C1-C21 base on IP
  3. CHECK if:
    1. TO location not empty [Alert]
}
FROM Repairroom TO Repairroom
  not considered
*/

function moveMiners() {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = sheet.getSheetByName("Sheet1"); // Sheet where user inputs data
  
  // the user input is in cell A1 of the "Sheet1" sheet
  var fromIP = inputSheet.getRange("C13").getValue(); 
  var toIP = inputSheet.getRange("C14").getValue(); 
  var macAddress = inputSheet.getRange("C15").getValue(); 
  var snNum = inputSheet.getRange("C16").getValue(); 

  var fromPos = fromIP.split('.'); // Split the input by dots
  var toPos = toIP.split('.')
  
  // input "From IP" parse to check position
  if (fromPos.length === 4) {
    var fromSheetNum = parseInt(parts[1]);
    var fromCol = parseInt(parts[2]);
    var fromRow = parseInt(parts[3]);
  }
  // input "To IP" parse to check postition
  if (toPos.length === 4) {
    var toSheetNum = parseInt(parts[1]);
    var toCol = parseInt(parts[2]);
    var toRow = parseInt(parts[3]);
  }

  // Move from certain sheet (C1-C21) or repair room
  var fromSheet = sheet.getSheets()[fromSheetNum]
  // Move to certain sheet (C1-C21) or repair room
  var targetSheet = sheet.getSheets()[toSheetNum];


  // Convert column num to letter
  var targetColLetter = String.fromCharCode(64 + toCol + 2);
  var fromColLetter = String.fromCharCode(64 + fromCol + 2);

  // Get the cell by combining col letter and row num
  var targetCell1 = targetColLetter + ((2*row) + 1)
  var targetCell2 = targetColLetter + ((2*row) + 1 + 1)
  var fromCell1 = fromColLetter + ((2*row) + 1)
  var fromCell2 = fromColLetter + ((2*row) + 1)


  // transfer to target cell: check if backup, check if running, check if pulled
  var to_cell_check = targetSheet.getRange(targetCell1).getValue()
  // check if its backup machine
  if (to_cell_check.includes('#')){
    SpreadsheetApp.getUi().alert("This is a backup machine!");
    return; // stop the script for checking data input
  }
  // check if its empty slot that there is no machine to pull
  if (!to_cell_check.isBlank()){
    SpreadsheetApp.getUi().alert("There is machine running at this slot!");
    return; // stop the script for checking data input
  }
  // check if its already a pulled machine
  if (to_cell_check.includes('!')){
    SpreadsheetApp.getUi().alert("This is a pulled machine!");
    return; // stop the script for checking data input
  }

  // transfer from cell: check if empty, check if running, check if pulled
  var from_cell_check = fromSheet.getRange(fromCell1).getValue()
  // check if its backup machine
  if (from_cell_check.includes('#')){
    //SpreadsheetApp.getUi().alert("This is a backup machine!");
    //return; // stop the script for checking data input

    // if includes # sign, it means its a backup machine, process to re-locate
    fromSheet.getRange(fromCell1).clearContent().setBackground(null)
    fromSheet.getrange(fromCell2).clearContent().setBackground(null)
  }
  // check if its empty slot that there is no machine to pull
  if (from_cell_check.isBlank()){
    SpreadsheetApp.getUi().alert("There is no machine at this slot!");
    return; // stop the script for checking data input
  }
  // check if its already a pulled machine / if the machine is in repair room
  if (fromSheetNum != 0){ // machine not from repair room
    if (from_cell_check.includes('!')){

    SpreadsheetApp.getUi().alert("This is a pulled machine!");
    return; // stop the script for checking data input
  }
  }




  // Insert the value into the specified cell
  targetSheet.getRange(targetCell1).setValue(macAddress + "#").setBackground("green")
  targetSheet.getRange(targetCell2).setValue(snNum + "#").setBackground("green")


  // Optionally clear the input cell after submission
  inputSheet.getRange("C9").clearContent();
  inputSheet.getRange("C10").clearContent();  
  inputSheet.getRange("C11").clearContent();
  
  // Provide feedback (e.g., show an alert message)
  SpreadsheetApp.getUi().alert("Backup Miners Action Processed!");

}
