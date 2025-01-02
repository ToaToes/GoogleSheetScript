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
  var repairroomNum = 3
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = sheet.getSheetByName("Sheet1"); // Sheet where user inputs data
  
  // the user input is in cell A1 of the "Sheet1" sheet
  var fromIP = inputSheet.getRange("C13").getValue(); 
  var toIP = inputSheet.getRange("C14").getValue(); 
  var macAddress = inputSheet.getRange("C15").getValue(); 
  var snNum = inputSheet.getRange("C16").getValue(); 


  // FROM and TO IP split by .
  var fromPos = fromIP.split('.');
  var toPos = toIP.split('.');
  

  // parse IP address to get location for FROM and TO loc
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

  if (fromSheetNum == 0){ // 0 means move from repairroom
    fromSheetNum = repairroomNum
  }
  if (toSheetNum == 0){ // 0 means move to repairroom
    toSheetNum = repairroomNum
  }

  // Move from certain sheet (C1-C21) or repair room
  var fromSheet = sheet.getSheets()[fromSheetNum]
  // Move to certain sheet (C1-C21) or repair room
  var targetSheet = sheet.getSheets()[toSheetNum];


  // Convert column num to letter
  var targetColLetter = String.fromCharCode(64 + toCol + 2);
  var fromColLetter = String.fromCharCode(64 + fromCol + 2);

  // Get the cell by combining col letter and row num
  var targetCell1 = targetColLetter + ((2*toRow) + 1)
  var targetCell2 = targetColLetter + ((2*toRow) + 1 + 1)
  var fromCell1 = fromColLetter + ((2*fromRow) + 1)
  var fromCell2 = fromColLetter + ((2*fromRow) + 1)


  // TO location, check if empty before input data
  var to_cell_check = targetSheet.getRange(targetCell1).getValue()
  // check if its backup machine
  // check if its already a pulled machine
  // check if its empty slot that there is no machine to pull
  if (!to_cell_check.isBlank()){
    SpreadsheetApp.getUi().alert("There is machine in this slot, Please check first!");
    return; // stop the script for checking data input location
  }


  /* FROM location, check:
    1. FROM C1-C21
      1. check if empty, alert
      2. check if state RUNNING, alert
      3. check if state BACKUP -> process
      4. check if state PULLED -> process to repairroom
    2. FROM repairroom
      1. check if empty, alert
  */
  var from_cell_check = fromSheet.getRange(fromCell1).getValue()
  
  // For Both C1-C21, and repairroom
  if (from_cell_check.isBlank()){
    SpreadsheetApp.getUi().alert("There is no machine in this slot, Please check first!");
    return; // stop the script for checking data input location      
  }
  // For C1-C21
  if (from_cell_check.includes("!")){ //This is a PULLED machine
    if (toSheetNum != 0){ // Not moving to repairroom, alert
      SpreadsheetApp.getUi().alert("This PULLED machine not moving to repairroom, Please check Target slot fisrt!");
      return; // stop the script for checking data input location  
    }
  }
  if (from_cell_check.getBackground() == "#ffffff"){
    SpreadsheetApp.getUi().alert("This is a RUNNING machine, Please check first!");
    return; // stop the script for checking data input location 
  }

  // Insert the value into the specified cell
  targetSheet.getRange(targetCell1).setValue(macAddress)
  targetSheet.getRange(targetCell2).setValue(snNum)
  fromSheet.getRange(fromCell1).clearContent()
  fromSheet.getRange(fromCell2).clearContent()


  // Optionally clear the input cell after submission
  inputSheet.getRange("C13").clearContent();
  inputSheet.getRange("C14").clearContent();  
  inputSheet.getRange("C15").clearContent();
  inputSheet.getRange("C16").clearContent();
  
  // Provide feedback (e.g., show an alert message)
  SpreadsheetApp.getUi().alert("Moving Miners Action Processed!");

}
