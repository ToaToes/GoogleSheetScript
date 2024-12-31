Breakdown of Actions:
1. Pull: Marks an item in a specified row/column as red, adds ! at the end.
2. Rack: Resets an item (removes the green background, removes # at the end).
3. Move: Moves an item from one cell to another (specifies source and destination).
4. Backup: Marks an item with a green background and adds # at the end.

Full Script Example:
Here’s a script that implements these actions:

```
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Actions')
    .addItem('Pull', 'pullItem')
    .addItem('Rack', 'rackItem')
    .addItem('Move', 'moveItem')
    .addItem('Backup', 'backupItem')
    .addToUi();
}

function pullItem() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var activeRange = sheet.getActiveRange();  // Get the selected cell range
  
  activeRange.setBackground('red');  // Set background to red
  var currentValue = activeRange.getValue();
  
  if (currentValue && !currentValue.endsWith('!')) {
    activeRange.setValue(currentValue + '!');  // Add '!' at the end
  }
}

function rackItem() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var activeRange = sheet.getActiveRange();  // Get the selected cell range
  
  activeRange.setBackground(null);  // Remove background (default = no color)
  var currentValue = activeRange.getValue();
  
  if (currentValue && currentValue.endsWith('#')) {
    activeRange.setValue(currentValue.slice(0, -1));  // Remove '#' at the end
  }
}

function moveItem() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Prompt user for source and destination coordinates
  var sourceCell = Browser.inputBox("Enter the source cell (e.g., A1):");
  var destCell = Browser.inputBox("Enter the destination cell (e.g., B2):");
  
  var sourceRange = sheet.getRange(sourceCell);
  var destRange = sheet.getRange(destCell);
  
  var valueToMove = sourceRange.getValue();  // Get the value of the source cell
  
  destRange.setValue(valueToMove);  // Move the value to the destination cell
  sourceRange.setValue("");  // Clear the source cell
}

function backupItem() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var activeRange = sheet.getActiveRange();  // Get the selected cell range
  
  activeRange.setBackground('green');  // Set background to green
  var currentValue = activeRange.getValue();
  
  if (currentValue && !currentValue.endsWith('#')) {
    activeRange.setValue(currentValue + '#');  // Add '#' at the end
  }
}

```

Explanation of Each Function:
### onOpen():
This function is automatically run when the spreadsheet is opened. It creates a custom menu (Custom Actions) in the spreadsheet UI that lets users trigger the other functions (Pull, Rack, Move, and Backup).
#### pullItem():
Marks the selected cell(s) with a red background and appends ! to the cell's content.
### rackItem():
Resets the background color of the selected cell(s) to default (no background) and removes the # at the end of the content.
### moveItem():
Prompts the user to input a source cell and a destination cell. It then moves the value from the source cell to the destination and clears the source cell.
### backupItem():
Sets the background color of the selected cell(s) to green and appends # to the content.


## How to Use:
1. Add the Script:
2. Open your Google Sheets document.
3. Go to Extensions > Apps Script.
4. Paste the provided script into the editor and save it.

## Use the Buttons:
Reload the Google Sheet, and a new menu called Custom Actions will appear.
Under this menu, you'll see four options: Pull, Rack, Move, and Backup. You can click each one to execute the corresponding action.


Move Action:
The Move function prompts you to enter a source cell (e.g., A1) and a destination cell (e.g., B2). It will transfer the value from the source to the destination and clear the source.


Customization:
If you'd like to automate the process further (e.g., specify the exact rows/columns for Pull and Rack, or change the colors), you can modify the script to ask for specific ranges or adjust the behavior of the functions accordingly.
