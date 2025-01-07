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
  var repairroomNum = 22
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = sheet.getSheetByName("Action"); // Sheet where user inputs data
  
  // the user input is in cell A1 of the "Sheet1" sheet
  var fromIP = inputSheet.getRange("C13").getValue(); 
  var toIP = inputSheet.getRange("C14").getValue(); 
  //var macAddress = inputSheet.getRange("C15").getValue(); # do not need input mac
  //var snNum = inputSheet.getRange("C16").getValue();  # do not need input snNum
  var operator = inputSheet.getRange("C18").getValue();  


  // FROM and TO IP split by .
  var fromPos = fromIP.split('.');
  var toPos = toIP.split('.');
  

  // parse IP address to get location for FROM and TO loc
  // input "From IP" parse to check position
  if (fromPos.length === 4) {
    var fromSheetNum = parseInt(fromPos[1]);
    var fromCol = parseInt(fromPos[2]);
    var fromRow = parseInt(fromPos[3]);
  }
  // input "To IP" parse to check postition
  if (toPos.length === 4) {
    var toSheetNum = parseInt(toPos[1]);
    var toCol = parseInt(toPos[2]);
    var toRow = parseInt(toPos[3]);
  }

  // Move from certain sheet (C1-C21) or repair room
  var fromSheetN = "C" + fromSheetNum; // Convert to C*
  // Move to certain sheet (C1-C21) or repair room
  var targetSheetN = "C" + toSheetNum; // Convert to C*

  // Convert column num to letter
  var targetColLetter = String.fromCharCode(64 + toCol + 2);
  var fromColLetter = String.fromCharCode(64 + fromCol + 2);
  // Get the cell by combining col letter and row num
  var targetCell1 = targetColLetter + ((2*toRow) + 1);
  var targetCell2 = targetColLetter + ((2*toRow) + 1 + 1);
  var fromCell1 = fromColLetter + ((2*fromRow) + 1);
  var fromCell2 = fromColLetter + ((2*fromRow) + 1 + 1);

  // FROM or TO repair room
  if (fromSheetNum == 0){ // 0 means move from repairroom
    fromSheetN = "Repair Room";
    fromCell1 = "B" + (fromRow + 2);
    fromCell2 = "C" + (fromRow + 2);
  }
  if (toSheetNum == 0){ // 0 means move to repairroom
    targetSheetN = "Repair Room";
    targetCell1 = "B" + (toRow + 2);
    targetCell2 = "C" + (toRow + 2);
  }

  // move to location
  var fromSheet = sheet.getSheetByName(fromSheetN); 
  var targetSheet = sheet.getSheetByName(targetSheetN); 


  // TO location, check if empty before input data
  var to_cell_check = targetSheet.getRange(targetCell1).getValue();
  // check if its backup machine
  // check if its already a pulled machine
  // check if its empty slot that there is no machine to pull
  if (to_cell_check != ""){
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
  var from_cell_check = fromSheet.getRange(fromCell1).getValue();
  var from_color = fromSheet.getRange(fromCell1).getBackground(); // Check for the color for status
  
  // For Both C1-C21, and repairroom
  if (from_cell_check == ""){
    SpreadsheetApp.getUi().alert("There is no machine in this slot, Please check first!");
    return; // stop the script for checking data input location      
  }
  // For C1-C21
  // PULLED machie might move between containers
  //if (from_cell_check.includes("!")){ //This is a PULLED machine
  //  if (toSheetNum != 0){ // Not moving to repairroom, alert
  //    SpreadsheetApp.getUi().alert("This PULLED machine not moving to repairroom, Please check Target slot fisrt!");
  //    return; // stop the script for checking data input location  
  //  }
  //}
  if (!from_cell_check.includes("#") & !from_cell_check.includes("!")){ // Check if its BACKUP machine
    if (fromSheetNum != 0){ // Moving a machine not from repair room
      SpreadsheetApp.getUi().alert("This is a RUNNING machine, Please check first!");
      return; // stop the script for checking data input location 
    }
  }


  var macAddress = fromSheet.getRange(fromCell1).getValue();
  var snNum = fromSheet.getRange(fromCell2).getValue();

  // Insert the value into the specified cell
  if (toSheetNum == 0){
    targetSheet.getRange(targetCell1).setValue(macAddress.replace(/[#!]/g, ''));  // move to repair room
    targetSheet.getRange(targetCell2).setValue(snNum.replace(/[#!]/g, ''));  // Remove '#' and '!'
  }
  else{
    targetSheet.getRange(targetCell1).setValue(macAddress).setBackground(from_color); // move to container
    targetSheet.getRange(targetCell2).setValue(snNum).setBackground(from_color); // no need to remove sign
  }

  if (fromSheetNum == 0){ // from repair room delete to move rows up
    fromSheet.deleteRow(fromRow + 2);
    fromSheet.deleteRow(fromRow + 2);
    // set target position machine to # backup state as default
    targetSheet.getRange(targetCell1).setValue(macAddress + "#").setBackground("#00ff00"); // If from repair room, default set to backup 
    targetSheet.getRange(targetCell2).setValue(snNum + "#").setBackground("#00ff00"); // If from repair room, default set to backup
  }
  else{ // else not delete row
    fromSheet.getRange(fromCell1).clearContent().setBackground(null);
    fromSheet.getRange(fromCell2).clearContent().setBackground(null);
  }

  // Log the action for tracing
  var logSheet = sheet.getSheetByName("Log");
  // Add a new row to the log sheet with the details of the move
  logSheet.appendRow([new Date(), "MOVE", fromIP, toIP, macAddress, snNum, operator]);


  // Optionally clear the input cell after submission
  inputSheet.getRange("C13").clearContent();
  inputSheet.getRange("C14").clearContent();  
  //inputSheet.getRange("C15").clearContent();
  //inputSheet.getRange("C16").clearContent();
  
  // Provide feedback (e.g., show an alert message)
  SpreadsheetApp.getUi().alert("Move Miners Action Processed!");

}
