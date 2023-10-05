/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// const { report } = require("process");


// initialization:
var thunderJS
const IP_ADDRESS = localStorage.getItem('userInput')
var defaultHost = localStorage.getItem('host')
var host;
var heartbeat = false

var config = {};
var eventDict = {};
var collapsibleData = {};
var checkedIndicesDict = {};
var passedDict = {};
var failedDict = {};
var NAedDict = {};

var totalNumberOfTestcases = 0;
var passedNumberOfTestcases = 0;
var NANumberOfTestcases = 0;
const emptyArray = ["", "None", NaN, {}, []]

document.addEventListener('DOMContentLoaded', function () {
  //add event listners to buttons
  listJsonFilesAndLoadData()
  buttonListnerIitialization();


  var reportTable = {}
  reportTable["Module"] = ["TOTAL"]
  reportTable["Passed"] = [0]
  reportTable["Failed"] = [0]
  reportTable["NA"] = [0]
  reportTable["Total"] = [0]
  updateReportTable(reportTable)


  // Retrieve the string from localStorage
  const dataToSend = localStorage.getItem('userInput');

  // Send the data to the server using a fetch POST request
  fetch('/save-string', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain', // Set the content type to plain text
    },
    body: dataToSend, // Send the retrieved data as the request body
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result); // Server response
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // ... add more function calls as needed
});

function buttonListnerIitialization() {
  addButtonClickListener('changeIP', 'saveInput');
  addButtonClickListener('selectAllTestCases', 'selectAllTestCases');
  addButtonClickListener('RunAllTestCases', 'RunAllTestCases');
  addButtonClickListener('deleteAllSelectedTestCases', 'deleteAllSelectedTestCases');
  addButtonClickListener('runSelectedTestCases', 'runSelectedTestCases');
  addButtonClickListener('toggleCheckboxes', 'toggleCheckboxes');
  addButtonClickListener('downloadLogs','downloadLogs');
  addButtonClickListener('downloadDivContentAsPDF_reportTable','downloadReportSummary','reportTable');



}

function addButtonClickListener(buttonId, functionName, ...args) {
  var button = document.getElementById(buttonId);

  if (button) {
    button.addEventListener('click', function () {
      // Check if the function name exists in the global scope
      if (typeof window[functionName] === 'function') {
        window[functionName](...args); // Call the function with arguments
      } else {
        console.error('Function does not exist:', functionName);
      }
    });
  } else {
    console.error('Button not found with ID:', buttonId);
  }
}



// onclick="saveInput()"
function saveInput() {
  const userInput = document.getElementById('userInput').value;

  if (userInput.trim() !== '') {
    localStorage.setItem('userInput', userInput);
    displayInput();
    location.reload();
  } else {
    alert('Please enter some text before saving.');
  }

}

// Function to display user input from localStorage
function displayInput() {
  const savedInput = localStorage.getItem('userInput');
  const displayDiv = document.getElementById('displayDiv');

  if (savedInput) {
    displayDiv.textContent = 'IP: ' + savedInput;
  } else {
    displayDiv.textContent = '';
  }
}

// Call displayInput() to show the saved input on page load
displayInput();



/*
Connect Device / Heartbeat Process
*/
try {
  localStorage.setItem('host', host)
  thunderJS = ThunderJS({
    host: IP_ADDRESS,
    port: 9998,
  })
}
catch { }




//event notifications

//to check the connection event
thunderJS.on('connect', () => {
  console.log('Device Connected!!!')
  heartbeat = true
})
thunderJS.on('disconnect', () => {
  console.log('Device Disconnected!!!')
  heartbeat = false
})




//Displaysettings Resolution changed
thunderJS.on('org.rdk.DisplaySettings', 'resolutionChanged', notification => {
  const { width, height, videoDisplayType, resolution } = notification
  console.log('<<resolutionChanged  event>>' + JSON.stringify(notification))
  console.log('Width:', width)
  console.log('Height:', height)
  console.log('Video Display Type:', videoDisplayType)
  console.log('Resolution:', resolution)
  eventDict['resolutionChanged'] = notification
})

//DisplaySettiang vdeo format changed
thunderJS.on('org.rdk.DisplaySettings', 'videoFormatChanged', notification => {
  const { supportedVideoFormat, currentVideoFormat } = notification
  console.log('<<videoFormatChanged  event>>' + JSON.stringify(notification))
  console.log('supportedVideoFormat:', supportedVideoFormat)
  console.log('currentVideoFormat:', currentVideoFormat)
  eventDict['videoFormatChanged'] = notification
})

//set zoom setting
thunderJS.on('org.rdk.DisplaySettings', 'zoomSettingUpdated', notification => {
  const { zoomSetting, videoDisplayType } = notification
  console.log('<<zoomSettingUpdated  event>>' + JSON.stringify(notification))
  console.log('zoomSetting:', zoomSetting)
  console.log('videoDisplayType', videoDisplayType)
  eventDict['zoomSettingUpdated'] = notification
})

//set preresolutionchanged
thunderJS.on('org.rdk.DisplaySettings', 'resolutionPreChange', notification => {
  const { resolution } = notification
  console.log('<<resolutionPreChange  event>>' + JSON.stringify(notification))
  console.log('Resolution:', resolution)
  eventDict['resolutionPreChange'] = notification
})


//set warehouse reset_Device
thunderJS.on('org.rdk.Warehouse', 'resetDone', notification => {
  const { } = notification
  console.log('<<resetDone  event>>' + JSON.stringify(notification))
  eventDict['resetDone'] = notification
})
//get Playerinfo dolby_audiomodechanged
thunderJS.on('PlayerInfo', 'dolby_audiomodechanged', notification => {
  const { mode, enable } = notification
  console.log('<<dolby_audiomodechanged  event>>' + JSON.stringify(notification))
  console.log('mode:', mode)
  console.log('enable:', enable)
  eventDict['dolby_audiomodechanged'] = notification
})

// //set warehouse reset_Device
// thunderJS.on('PlayerInfo', 'statechange', notification => {
//   const { STATE, CALLSIGN, REASON } = notification
//   console.log('<<statechange  event>>' + JSON.stringify(notification))
//   console.log('STATE:', STATE)
//   console.log('CALLSIGN', CALLSIGN)
//   console.log('REASON', REASON)
//   eventDict['statechange'] = notification
// })

/////Webkit events:-

//get webkit loadfinished
thunderJS.on('WebKitBrowser', 'loadfinished', notification => {
  const { url, httpstatus } = notification
  console.log('<<loadfinished  event>>' + JSON.stringify(notification))
  console.log('url:', url)
  console.log('httpstatus:', httpstatus)
  eventDict['loadfinished'] = notification
})

//get webkit visibilitychange
thunderJS.on('WebKitBrowser', 'visibilitychange', notification => {
  const { hidden } = notification
  console.log('<<visibilitychange  event>>' + JSON.stringify(notification))
  console.log('hidden:', hidden)
  eventDict['visibilitychange'] = notification
})

//get webkit loadfailed
thunderJS.on('WebKitBrowser', 'loadfailed', notification => {
  const { url } = notification
  console.log('<<loadfailed  event>>' + JSON.stringify(notification))
  console.log('url:', url)
  eventDict['loadfailed'] = notification
})

//get webkit urlchange
thunderJS.on('WebKitBrowser', 'urlchange', notification => {
  const { url, loaded } = notification
  console.log('<<urlchange  event>>' + JSON.stringify(notification))
  console.log('url:', url)
  console.log('loaded:', loaded)
  eventDict['urlchange'] = notification
})

//get webkit statechange
thunderJS.on('WebKitBrowser', 'statechange', notification => {
  const { suspended } = notification
  console.log('<<statechange  event>>' + JSON.stringify(notification))
  console.log('suspended:', suspended)
  eventDict['statechange'] = notification
})

//get System onMacAddressesRetreived
thunderJS.on('System', 'onMacAddressesRetreived', notification => {
  const { } = notification
  console.log('<<onMacAddressesRetreived  event>>' + JSON.stringify(notification))
  eventDict['onMacAddressesRetreived'] = notification
})


//get System onNetworkStandbyModeChanged
thunderJS.on('org.rdk.System', 'onNetworkStandbyModeChanged', notification => {
  const { } = notification
  console.log('<<onNetworkStandbyModeChanged  event>>' + JSON.stringify(notification))
  eventDict['onNetworkStandbyModeChanged'] = notification
})

//get Timer timerExpired
thunderJS.on('org.rdk.Timer', 'timerExpired', notification => {
  const { timerId, mode, status } = notification
  console.log('<<timerExpired  event>>' + JSON.stringify(notification))
  console.log('timerId:', timerId)
  console.log('mode:', mode)
  console.log('status:', status)
  eventDict['timerExpired'] = notification
})

//get Timer timerExpiryReminder
thunderJS.on('org.rdk.Timer', 'timerExpiryReminder', notification => {
  const { timerId, mode, timeRemaining } = notification
  console.log('<<timerExpiryReminder  event>>' + JSON.stringify(notification))
  console.log('timerId:', timerId)
  console.log('mode:', mode)
  console.log('timeRemaining:', timeRemaining)
  eventDict['timerExpiryReminder'] = notification
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////



// prerequisite dictionary
const services = {
  "DeviceInfo": {
    "api": "Controller.1.activate",
    "input": { "callsign": "DeviceInfo" }
  },
  "WebKitBrowser": {
    "api": "Controller.1.activate",
    "input": { "callsign": "WebKitBrowser" }
  },
  "UserPreferences": {
    "api": "Controller.1.activate",
    "input": { "callsign": "org.rdk.UserPreferences" }
  },
  "Warehouse": {
    "api": "Controller.1.activate",
    "input": { "callsign": "org.rdk.Warehouse" }
  },
  "DisplaySettings": {
    "api": "Controller.1.activate",
    "input": { "callsign": "org.rdk.DisplaySettings" }
  },
  "PlayerInfo": {
    "api": "Controller.1.activate",
    "input": { "callsign": "PlayerInfo" }
  },
  "System": {
    "api": "Controller.1.activate",
    "input": { "callsign": "org.rdk.System" }
  },
  "Timer": {
    "api": "Controller.1.activate",
    "input": { "callsign": "org.rdk.Timer" }
  }
}


//rendering the config file

fetch("config.json")
  .then(response => response.json())
  .then(jsonData => {
    // Use the JSON data as needed
    config = jsonData
    // console.log("Config data-\n", config)
  })
  .catch(error => {
    console.error('Error reading CONFIG.JSON file:', error);
  });


function listFilesInDirectory() {
  fetch('/list-modules') // Fetch from the server-side endpoint
    .then(response => response.json())
    .then(data => {
      const moduleFilesDiv = document.getElementById('moduleFiles');
      moduleFilesDiv.innerHTML = ''; // Clear any existing content

      data.forEach(fileName => {
        if (fileName.includes('.json')) {
          // console.log(fileName)
          const jsonFile = fileName.slice(0, fileName.lastIndexOf('.json'))
          // renderJsonData(jsonFile);
          jsonFileDict[jsonFile] = jsonData;
          createButton(jsonFile);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching file list:', error);
    });
}
// listFilesInDirectory();

function listJsonFilesAndLoadData() {
  fetch('/list-json') // Fetch JSON data from the server-side endpoint
    .then(response => response.json())
    .then(data => {
      const moduleFilesDiv = document.getElementById('moduleFiles');
      moduleFilesDiv.innerHTML = ''; // Clear any existing content

      // Process and use the JSON data from each file
      Object.keys(data).forEach(fileName => {
        const jsonData = data[fileName];

        // console.log(fileName)
        const jsonFile = fileName.slice(0, fileName.lastIndexOf('.json'))
        // renderJsonData(jsonFile);
        jsonFileDict[jsonFile] = jsonData;
        createButton(jsonFile);

      });
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    });
}



//collecting the files inside Modules
const directoryPath = 'Modules/';
const files = fetch('config.json');
console.log(files)
// listFilesInDirectory(directoryPath);

//importing json input file
var jsonFileDict = {}
var testcase_config;
function renderJsonData(jsonFileName) {
  fetch(directoryPath + jsonFileName + '.json')
    .then(response => response.json())
    .then(jsonData => {
      // Use the JSON data as needed
      // console.log(jsonFileName);
      jsonFileDict[jsonFileName] = jsonData;
      createButton(jsonFileName)
    })
    .catch(error => {
      console.error('Error reading JSON file:', error);
    });
}


//creating buttons for each service
function createButton(buttonName) {
  const divId = "moduleFiles";
  // Find the div element based on the provided ID
  const divElement = document.getElementById(divId);

  // Create a new button element
  const buttonElement = document.createElement('button');
  buttonElement.textContent = buttonName; // Set the button text

  // Apply some basic styling
  buttonElement.style.padding = '10px 20px';
  buttonElement.style.margin = '5px';
  buttonElement.style.border = '1px solid #000';
  buttonElement.style.borderRadius = '5px';
  buttonElement.style.backgroundColor = 'green';
  buttonElement.style.color = 'white';
  buttonElement.style.width = '150px';

  // Add event listener to the button
  buttonElement.addEventListener('click', () => renderInformation(buttonName));

  // Append the button to the div element
  divElement.appendChild(buttonElement);
}







// inserting the config data using the config dictionary/json file
function feedConfigData(obj) {

  console.log("Feeding Config data in ...", obj)
  if (typeof obj === 'string' && obj != 'NOT_EMPTY') {
    obj = (config.hasOwnProperty(obj)) ? config[obj] : obj
    return obj
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // console.log(key)
      if (config.hasOwnProperty(obj[key])) {
        obj[key] = config[obj[key]]
      }
    }
  }
  return obj
}

// import { aman } from "./feedConfigData.js";
// var aman
// originalConsoleLog(aman)




// Function to add checked indices to the dictionary
function addCheckedIndices(buttonName) {
  // Get all checkboxes for the specific buttonName
  var checkboxes = document.querySelectorAll(`input[type="checkbox"][data-button="${buttonName}"]`);

  // Create a set to store the checked indices
  var checkedIndices = checkedIndicesDict[buttonName] || new Set();

  // Iterate over the checkboxes and add checked indices to the set
  checkboxes.forEach(function (checkbox, index) {
    if (checkbox.checked) {
      checkedIndices.add(index);
    }
  });

  // Update the dictionary with the checked indices for the specific buttonName
  checkedIndicesDict[buttonName] = checkedIndices;
}


function renderInformation(buttonName) {
  // Get the div element where the information will be rendered
  const informationDiv = document.getElementById('informationDiv');

  // Show the checklist div
  informationDiv.style.display = 'block';

  // Clear the previous contents
  informationDiv.innerHTML = '';

  var moduleTitle = document.createElement('h1')
  moduleTitle.textContent = `${buttonName}`;
  informationDiv.appendChild(moduleTitle);

  // Create a list element
  const listElement = document.createElement('ul');

  // Create the "select all" checkbox
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.id = 'selectAll';
  selectAllCheckbox.addEventListener('change', toggleCheckboxes);

  // Create label for the "select all" checkbox
  const selectAllLabel = document.createElement('label');
  selectAllLabel.htmlFor = 'selectAll';
  selectAllLabel.textContent = 'Select All';
  selectAllLabel.className = "checkbox-container";

  // Append the "select all" checkbox and label to the list
  const selectAllItem = document.createElement('li');
  selectAllItem.appendChild(selectAllCheckbox);
  selectAllItem.appendChild(selectAllLabel);
  listElement.appendChild(selectAllItem);

  // Array of information items
  const informationItems = jsonFileDict[buttonName];

  // Create checkboxes for each information item
  informationItems.forEach((item, index) => {
    // Create list item element
    const listItemElement = document.createElement('li');

    // Create checkbox element
    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    checkboxElement.id = `checkbox${index}`;
    checkboxElement.setAttribute('data-button', buttonName);


    // Create label for the checkbox
    const labelElement = document.createElement('label');
    labelElement.htmlFor = `checkbox${index}`;
    labelElement.textContent = item["Test Case ID"] + "-" + item["Test Case Name"];

    // Append the checkbox and label to the list item
    listItemElement.appendChild(checkboxElement);
    listItemElement.appendChild(labelElement);

    // Append the list item to the list
    listElement.appendChild(listItemElement);
  });

  // Append the list to the information div
  informationDiv.appendChild(listElement);

  // Function to toggle the checkboxes based on the "select all" checkbox
  function toggleCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  }

  var addButton = document.getElementById('addTC');
  addButton.addEventListener('click', function () {
    addCheckedIndices(buttonName);
    printAddedTestcases(checkedIndicesDict);
    // console.log(checkedIndicesDict);
  });


}

//range block
function toggleCheckboxes() {
  var rangeInput = document.getElementById('rangeInput').value;
  var range = rangeInput.split('-');

  var start = parseInt(range[0]);
  var end = parseInt(range[1]);

  var checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Ensure start and end indices are within bounds
  if (isNaN(start) || isNaN(end) ||
    start < 0 || start >= checkboxes.length ||
    end < 0 || end >= checkboxes.length ||
    start > end) {
    console.error('Invalid range specified!');
    return;
  }

  for (var i = start; i <= end; i++) {
    checkboxes[i].checked = true;
  }
}



//to print in the added section
function printAddedTestcases(dictionary) {
  // var keys = Object.keys(dictionary).sort();

  var keys = Object.keys(dictionary)
  var div = document.getElementById("AddedTestcases");

  // Create an unordered list element
  var list = document.createElement("ul");

  // Iterate over the keys and create list items
  keys.forEach(function (key) {
    if (dictionary[key].size == 0) return
    var listItem = document.createElement("li");
    var subList = document.createElement("ul");

    // Add a class to the sublist for styling
    subList.classList.add("sublist");

    // Iterate over the values for the current key and create subtext list items
    dictionary[key].forEach(function (value) {
      var subListItem = document.createElement("button");
      subListItem.style.textAlign = "left"; // Left-justify the button text
      // Add a hover effect using CSS
      subListItem.addEventListener("mouseover", function () {
        subListItem.style.backgroundColor = "red";
      });
      subListItem.addEventListener("mouseout", function () {
        subListItem.style.backgroundColor = ""; // Revert to default background color when not hovering
      });
      subListItem.textContent = jsonFileDict[key][value]["Test Case ID"] + "-" + jsonFileDict[key][value]["Test Case Name"];
      //delete the button
      subListItem.addEventListener("click", function () {
        checkedIndicesDict[key].delete(value)
        printAddedTestcases(dictionary)
      });
      subList.appendChild(subListItem);
    });
    // Add the subtext list to the main list item
    listItem.textContent = key;
    // Add a click event listener to the subListItem

    listItem.appendChild(subList);

    list.appendChild(listItem);
  });

  // Clear any existing content in the div
  div.innerHTML = "";

  // Append the list to the div
  div.appendChild(list);
}

// // delet button from the added TC list
// function deleteTC()

//data feeder

function variableDataFeeder(keyConfig) {
  if (config.hasOwnProperty(keyConfig)) {
    return config[keyConfig]
  }
  return null
}

//creating an isEqual function to compare objects
function areObjectsEqual(obj1, obj2) {
  const sortedObj1 = JSON.stringify(obj1, Object.keys(obj1).sort());
  const sortedObj2 = JSON.stringify(obj2, Object.keys(obj2).sort());
  const result = sortedObj2.includes(sortedObj1);
  return result;
}

//deep comparison of dictionaries/lists
function deepCompareObjects(obj1, obj2, path = 'root') {
  if ((obj1 === 'NOT_EMPTY' && obj2) || (obj2 === 'NOT_EMPTY' && obj1)) {
    return 'Objects are equal'
  }
  if (typeof obj1 !== typeof obj2) {
    return `Type mismatch at ${path}: ${typeof obj1} !== ${typeof obj2}`;
  }

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      return `Array length mismatch at ${path}: ${obj1.length} !== ${obj2.length}`;
    }

    const sortedObj1 = [...obj1].sort();
    const sortedObj2 = [...obj2].sort();

    for (let i = 0; i < sortedObj1.length; i++) {
      const result = deepCompareObjects(sortedObj1[i], sortedObj2[i], `${path}[${i}]`);
      if (result !== 'Objects are equal') {
        return result;
      }
    }
    return 'Objects are equal';
  } else if (typeof obj1 === 'object' && obj1 !== null) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return `Object key count mismatch at ${path}: ${keys1.length} !== ${keys2.length}`;
    }

    for (const key of keys1) {
      const result = deepCompareObjects(obj1[key], obj2[key], `${path}.${key}`);
      if (result !== 'Objects are equal') {
        return result;
      }
    }
    return 'Objects are equal';
  } else {
    return obj1 === obj2 ? 'Objects are equal' : `Value mismatch at ${path}: ${obj1} !== ${obj2}`;
  }
}

// Storing the original console.log function for later use

//////
//live log
const originalConsoleLog = console.log;
console.log = function () {
  // Live logs container element
  const Livelog = document.getElementById('Livelog');
  // Checking if the log message contains "html2canvas"
  if (!Array.from(arguments).join(' ').includes('html2canvas')) {
    // Process each argument and convert it to a string with line breaks
    const messageLines = Array.from(arguments).map((arg) => {
      if (typeof arg === 'object') {
        try {
          // Try to stringify the object, arrays, and dictionaries
          return JSON.stringify(arg, null, 2); // Use 2 spaces for indentation
        } catch (error) {
          // If there is an error in stringifying, display the error message
          return String(error);
        }
      }
      return String(arg);
    });
    // Combine the lines into a single string with line breaks
    const timestamp = '[' + getTime() + ']'
    const message = timestamp + ' ' + messageLines.join(' ');
    // Split the message into individual lines and add each line to the live logs container
    const lines = message.split('\n');
    for (const line of lines) {
      const logLine = document.createElement('p');
      logLine.textContent = line;
      logLine.style.marginBottom = '1px';
      logLine.style.marginLeft = '10px';
      Livelog.appendChild(logLine);
    }
  }
  // Original console.log function with the same arguments
  originalConsoleLog.apply(console, arguments);
};
//////


//to select all the testcases
async function selectAllTestCases() {
  console.log("Selecting all Modules: " + Object.keys(jsonFileDict).length)
  // console.log(jsonFileDict)

  for (TCModule in Object.keys(jsonFileDict)) {
    const ModuleName = Object.keys(jsonFileDict)[TCModule]

    if (!checkedIndicesDict.hasOwnProperty(ModuleName)) {
      checkedIndicesDict[ModuleName] = new Set();
    }
    console.log("Module Name: " + ModuleName)
    for (index in jsonFileDict[ModuleName]) {
      checkedIndicesDict[ModuleName].add(index);
    }
  }
  printAddedTestcases(checkedIndicesDict);
}

//to run all the testcases
async function RunAllTestCases() {
  console.log("Running all Modules: " + Object.keys(jsonFileDict).length)
  // console.log(jsonFileDict)
  for (TCModule in Object.keys(jsonFileDict)) {
    const ModuleName = Object.keys(jsonFileDict)[TCModule]
    console.log("Module Name: " + ModuleName)
    for (index in jsonFileDict[ModuleName]) {
      // const jsonObject = jsonFileDict[ModuleName][index]
      await RunTestCase(ModuleName, index)
    }
    createCollapsibleButton(ModuleName, collapsibleData[ModuleName]);
  }
  updateProgress();
}


var numberOfPassedTC = 0;
//to run selected testcases

var reportCSVobject = [["Module", "Testcase", "Result"]]

async function runSelectedTestCases() {

  const loadingAnimation = document.getElementById('loader');
  loadingAnimation.style.display = 'block';

  //calculating testcase time execution
  var startTime = performance.now();

  if (!checkedIndicesDict) {
    alert("No Testcases selected!!!");
    console.log("No Testcases selected!!!");
    return
  }

  const report = document.getElementById("hiddenReportDiv")
  const plugins_title = document.createElement('h3')
  plugins_title.textContent = "Plugin List: "
  report.appendChild(plugins_title)

  for (var key in checkedIndicesDict) {

    const PluginDiv = document.createElement('div')
    const ModuleName = document.createElement('button')

    // Change button background color
    ModuleName.style.backgroundColor = "black";

    // Change button text color
    ModuleName.style.color = "white";

    // Change button padding
    ModuleName.style.padding = "10px 20px";

    // Add a border
    ModuleName.style.border = "2px solid black";

    // Set a rounded border
    ModuleName.style.borderRadius = "5px";

    // Change font size
    ModuleName.style.fontSize = "16px";

    ModuleName.textContent = key
    ModuleName.className = "moduleButton"
    const reportId = `report-${key}`;
    const module_div = document.createElement('div');
    module_div.id = reportId;
    module_div.className = `moduleContent`
    module_div.style.display = 'none'
    // module_div.style.display = 'none'
    ModuleName.addEventListener("click", () => {
      toggleVisibility(reportId);
    });


    PluginDiv.appendChild(ModuleName)
    PluginDiv.appendChild(module_div)
    report.appendChild(PluginDiv)
    // const lineBreak = document.createElement("br");
    // report.appendChild(lineBreak)

    var value = checkedIndicesDict[key];
    console.log("Running Module:", key);
    originalConsoleLog("Key:", key, "Value:", value);

    collapsibleData[key] = []
    await activatePlugin(key)
    for (var index of value) {
      console.log("Key:", key, "Value:", index);
      await RunTestCase(key, index);
    }

    createCollapsibleButton(key, collapsibleData[key]);
  }

  // Hide the loader after executing test cases
  loadingAnimation.style.display = 'none';

  var endTime = performance.now();
  var timeTakenInMilliseconds = endTime - startTime;
  var timeTakenInSeconds = timeTakenInMilliseconds / 1000;
  var timeTakenInMinutes = timeTakenInSeconds / 60

  const time_taken = (timeTakenInMinutes.toFixed(0) > 1) ? timeTakenInMinutes.toFixed(0) + " min " + (timeTakenInSeconds % 60).toFixed(3) + " sec" : (timeTakenInSeconds % 60).toFixed(3) + " sec"
  console.log("Testcase execution time: ", time_taken)

  console.log("Number of Executed Testcases: ", totalNumberOfTestcases);

  originalConsoleLog("Testcase execution time: ", time_taken)

  originalConsoleLog("Number of Executed Testcases: ", totalNumberOfTestcases);

  const executionStats = document.createElement('h3')
  executionStats.textContent = "Execution time: " + time_taken + " for " + totalNumberOfTestcases + " testcases"
  report.appendChild(executionStats)


  console.log("Updating progress...")
  updateProgress();
  console.log("Attaching Summary...")
  attachSummaryList();
  summaryTable();

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
var passedArray = [];
var failedArray = [];


async function newRunTestCase(pluginName, testcase_index) {
  const tc = jsonFileDict[pluginName][testcase_index];
  var stepData = [];

  //fixed testcase data - description
  const testCaseId = tc["Test Case ID"]
  const testCaseName = tc["Test Case Name"]
  const testObjective = tc["Test Objective"]
  const testType = tc["Test Type"]
  const testCasePrerequisites = (tc.hasOwnProperty("TestCase Prerequisites")) ? tc["TestCase Prerequisites"] : "None"
  var testCaseResult = false;

  //checking if it is NA
  const notAvailable = config["NA"].includes(testCaseName)
  if (notAvailable) {
    testCaseResult = "NA"
    if (!NAedDict.hasOwnProperty(pluginName)) {
      NAedDict[pluginName] = []
    }
    NAedDict[pluginName].push(testCaseName)
  }
  else {
    const steps = tc["APIs"];

    for (let step in steps) {
      const step_api = tc["APIs"][step]
      // if(step.hasOwnProperty('api_list')){

      // }
      const step_result = await newRunAPI(step_api)
      step_result.hasOwnProperty('')
      //Logging the result
      const stepResult = (result) ? "-> Passed." : "-> Failed!";

      // log(`Step ${step + 1}: ${stepResult}`);
      console.log(`Step ${step + 1}: ${stepResult}`);
      if (!result) {
        failedTestCase(step + 1, testcase)
        if (!failedDict.hasOwnProperty(apimodule)) {
          failedDict[apimodule] = []
        }
        failedDict[apimodule].push(testCaseName)
        console.log("\n")
      }
      if (result && step == numberOfAPIs - 1) {
        passedNumberOfTestcases++;
        passedTestCase(testcase);
        if (!passedDict.hasOwnProperty(apimodule)) {
          passedDict[apimodule] = []
        }
        passedDict[apimodule].push(testCaseName)
        testCaseResult = true
        console.log("\n");
      }


    }
  }

}

async function newRunAPI(step_api) {

  const api_string = step_api["api"];
  const method = api_string.slice(0, api_string.indexOf("1") + 1) || api_string.slice(0, api_string.lastIndexOf("."));
  const plugin = api_string.slice(api_string.lastIndexOf(".") + 1);

  var params = (step_api.hasOwnProperty('Input Parameters')) ? step_api['Input Parameters'] : {}

  const expectedOutput = feedConfigData(step_api["Expected Output"]);

  var result = false;
  var apiResponse = null;

  const response = runAPICall(method, plugin, params)
  const output_response = await checkobjects(expectedOutput, response)
  return output_response
}

async function checkobjects(expectedOutput, response) {
  if (response == true) {
    output_response = 'Objects are equal'
  }
  else {
    // TestCase Check
    const option = (step_api.hasOwnProperty("Option")) ? true : false

    if (option) {
      const expected_options = (step_api["Option"] !== "") ? expectedOutput[step_api["Option"]] : expectedOutput
      for (let op in expected_options) {
        output_response = deepCompareObjects(expected_options[op], response)
        if (output_response == 'Objects are equal') break
      }
    }
    else {
      output_response = deepCompareObjects(expectedOutput, response)
    }

  }

  var newRunAPIResponse = {}
  if (output_response == 'Objects are equal') newRunAPIResponse["output"] = true
  else {
    newRunAPIResponse["output"] = false
    newRunAPIResponse["reason"] = output_response
  }

  return newRunAPIResponse

}



async function activatePlugin(service) {
  console.log(`Activating Service: ${service}`)
  const activating = await customAPIcall(services[service]["api"], services[service]["input"])
}


async function deactivatePlugin(service) {
  console.log(`Activating Service: ${service}`)
  const services = {
    "DeviceInfo": {
      api: "Controller.1.deactivate",
      input: { "callsign": "DeviceInfo" }
    },
    "DeviceInfo": {
      api: "Controller.1.deactivate",
      input: { "callsign": "DeviceInfo" }
    }
  }
  const activating = await customAPIcall(services[service].api, services[service].input)
}

async function RunTestCase(apimodule, testcase) {

  var testcaseExecution = {}

  testcaseExecution["Information"] = {}
  testcaseExecution["API_LIST"] = {}
  testcaseExecution["Result"] = {}

  //Test Information
  //API - get the list of API
  //Report the logs and testcase RESULT



  //increasing number of totalNumberOfTestcases
  totalNumberOfTestcases++;

  // tc = testcase_config[testcase];
  const tc = jsonFileDict[apimodule][testcase];
  var stepData = [];

  log("\n")
  const testCaseId = tc["Test Case ID"]
  const testCaseName = tc["Test Case Name"]
  const testObjective = tc["Test Objective"]
  const testType = tc["Test Type"]
  const testCasePrerequisites = tc["TestCase Prerequisites"]
  var testCaseResult = false;

  //Printing testcase info in livelog
  console.log("\n",
    "Test Case ID:\t", testCaseId, "\n", "\n",
    "Test Case Name:\t", testCaseName, "\n",
    "Test Objective:\t", testObjective, "\n",
    "Test Type:\t", testType, "\n",
    "TestCase Prerequisites:\t", testCasePrerequisites, "\n",
  );

  var compareResult

  //checking if the testcase is NA
  const notAvailable = config["NA"].includes(testCaseName)
  if (!notAvailable) {
    log(testCaseId);
    const numberOfAPIs = tc["APIs"].length;

    for (var step = 0; step < tc["APIs"].length; step++) {
      const step_api = tc["APIs"][step]
      var clientFlag = false

      //loop testcases wothout changes or saving
      if (step_api.hasOwnProperty('LOOP_COUNT')) {
        console.log("LOOPING...")
        const loop_count = step_api['LOOP_COUNT'] //10 times
        const api_list = step_api['api_list'] //3 api calls

        for (let rep = 0; rep < loop_count; rep++) { //outer loop
          for (let api_index in api_list) { //inner loop for api calls
            const updated_api_object = api_list[api_index]
            // tc["APIs"].push(updated_api_object)
            tc["APIs"].splice(-1, 0, updated_api_object);
          }
        }
        continue;
      }



      const fullString = step_api["api"];
      const brokenAPI = breakAPI(fullString)
      const module = brokenAPI[0]
      const plugin = brokenAPI[1]
      var params = {};
      var result = false;
      var apiResponse = null;


      var expectedOutput = step_api["Expected Output"];

      console.log(
        "Testcase Step: ", (step + 1), "\n",
        "API: ", module, "\n",
        "Calling-> ", plugin, "\n");

      params = step_api["Input Parameters"];
      var response = null
      try {
        //checking if the plugin is event listner
        if (module.startsWith("client")) {
          console.log("Catching notification...")
          clientFlag = true
          await waitForObjectInDictionary(plugin, 10000)
            .then(output => {
              console.log(output); // Will log either "Found" or "Not found"
              result = true
            })
            .catch(error => {
              console.log(error);  // Will log "Not found" if object wasn't found in time
            });
        }
        if (!result) {
          if (input == "" || input == "None" || input == NaN) {
            originalConsoleLog("No input!!!")
            response = await thunderJS.call(module, plugin);
          }
          else {
            response = await thunderJS.call(module, plugin, params);
          }

          if (Array.isArray(response)) {
            if (typeof response[0] === 'object') { response = response[0] }
          }

          //adding sleep time after reboot
          if (plugin == "reboot") {
            console.log('Rebooting the Device...')
            // await sleep(60000)
            // await sleep(5000)

            //checking if device is off
            while (heartbeat) await sleep(500)

            await sleep(2000)
            //checking if device in on
            while (!heartbeat) await sleep(500)

            // waiting time for services to get active
            await sleep(10000)
          }
          // Handle the API response

          apiResponse = response;

          // update the config data
          expectedOutput = feedConfigData(expectedOutput);
          console.log(
            "Expected Output:\t", expectedOutput,
            '\nAPI response:\t:', apiResponse,
          );


          // TestCase Check
          var output_response = ""
          if (step_api.hasOwnProperty("Option")) {
            const key = step_api["Option"]
            var options = (expectedOutput.hasOwnProperty(key)) ? expectedOutput[key] : []
            var response_value = (apiResponse.hasOwnProperty(key)) ? apiResponse[key] : apiResponse

            if (key === "") {
              options = expectedOutput
              response_value = apiResponse
            }
            console.log("Options for ", key)
            console.log(options)
            console.log("Finding->", response_value)
            output_response = (options.includes(response_value)) ? 'Objects are equal' : `"${response_value}" - Option Not Found in "${options}"`
          }
          else if (step_api.hasOwnProperty("LIMIT")) {
            const limit_obj = step_api["LIMIT"]
            const key = Object.keys(limit_obj)[0]
            const value = limit_obj[key]

            output_response = (apiResponse[key] < value) ? 'Objects are equal' : 'Exceeded the Limit!'

          }
          else if (step_api.hasOwnProperty("Compare")) {
            const key_array = step_api["Compare"]
            var focused_response = {}
            var focused_expected = {}
            for (var index in key_array) {
              const key = key_array[index]
              focused_expected[key] = (expectedOutput.hasOwnProperty(key)) ? expectedOutput[key] : `${key} not available`
              focused_response[key] = (apiResponse.hasOwnProperty(key)) ? apiResponse[key] : `${key} not available`
            }
            output_response = deepCompareObjects(focused_expected, focused_response)
          }
          else {
            if (expectedOutput == "NOT_EMPTY") {
              output_response = (apiResponse) ? 'Objects are equal' : 'Output is Empty'
            } else {
              output_response = deepCompareObjects(expectedOutput, apiResponse)
            }
          }

          compareResult = {
            reason: (output_response == 'Objects are equal') ? "" : output_response,
            status: (output_response == 'Objects are equal') ? true : false
          }
          result = compareResult.status
        }

      } catch (error) {
        // Handle the API error
        log('API error:', error);
        console.error('API error:', error);
      }

      //Logging the result
      const stepResult = (result) ? "SUCCESS" : "FAILURE";

      // log(`Step ${step + 1}: ${stepResult}`);
      console.log(`Step ${step + 1}: ${stepResult}`);
      if (!result) {
        failedTestCase(step + 1, testcase)
        if (!failedDict.hasOwnProperty(apimodule)) {
          failedDict[apimodule] = []
        }
        failedDict[apimodule].push(testCaseName)
        console.log("\n")
      }
      if (result && step == numberOfAPIs - 1) {
        passedNumberOfTestcases++;
        passedTestCase(testcase);
        if (!passedDict.hasOwnProperty(apimodule)) {
          passedDict[apimodule] = []
        }
        passedDict[apimodule].push(testCaseName)
        testCaseResult = true
        console.log("\n");
      }

      const API_Key = (clientFlag) ? "Notification" : "API"

      var stepDataObject = {}
      stepDataObject["Step Number"] = step + 1
      stepDataObject[API_Key] = fullString
      if (typeof params === 'object') {
        if (Object.keys(params).length !== 0) stepDataObject["Input Parameters"] = params
      }
      stepDataObject["Expected Output"] = expectedOutput
      if (response !== null || clientFlag) stepDataObject[(clientFlag) ? "Notification Data" : "Api Response"] = (clientFlag) ? eventDict[plugin] : response
      stepDataObject[`Step ${step + 1} Result`] = (result) ? "SUCCESS" : "FAILURE"

      if (!result) {
        stepDataObject["Reason"] = compareResult
        originalConsoleLog(compareResult)
      }

      stepData.push(stepDataObject)
      if (!result) { break }

      //save the data and append the testcases
      if (step_api.hasOwnProperty('SAVE')) {
        const save_key = step_api['SAVE'][0]
        const save_array = response[save_key]
        console.log("Saving Data: ", save_array)

        const loop_object = step_api['LOOP']
        const key_word = loop_object['KEY_WORD'][0]
        const api_list = loop_object['api_list']

        for (let index in save_array) {
          const variable = save_array[index]
          for (let loop_api_index in api_list) {
            const updated_api_object = await assignValueToKeyword(key_word, variable, api_list[loop_api_index])
            tc["APIs"].push(updated_api_object)
          }
        }
      }
    }
  }
  else {

    NANumberOfTestcases++;
    testCaseResult = "NA"

    if (!NAedDict.hasOwnProperty(apimodule)) {
      NAedDict[apimodule] = []
    }
    NAedDict[apimodule].push(testCaseName)

  }


  reportCSVobject.push([apimodule, testCaseName, testCaseResult])

  const testData = {
    name: testCaseName,
    data: {
      "Test Case ID": testCaseId,
      "Test Case Name": testCaseName,
      "Test Objective": testObjective,
      "Test Type": testType,
      "TestCase Prerequisites:": testCasePrerequisites,
      "Test steps": stepData,
      "Test Case Result": (testCaseResult) ? 'SUCCESS' : 'FAILURE'
    }
  }
  if (!collapsibleData[apimodule]) { collapsibleData[apimodule] = [] }
  collapsibleData[apimodule].push(testData)

  // console.log("Collapsibledata: " + collapsibleData)

  //report section
  const report = document.getElementById(`report-${apimodule}`)
  const container = document.createElement("div");


  const id_name = document.createElement("button");
  id_name.className = "reportCollapsible";
  id_name.textContent = testCaseId + "-" + testCaseName;
  id_name.style.color = testCaseResult ? "green" : "red";
  id_name.style.color = notAvailable ? "gray" : id_name.style.color;

  const testcaseDetails = document.createElement("div");
  testcaseDetails.innerHTML = generateHTMLFromDict(testData.data);
  testcaseDetails.className = "reportContent";
  testcaseDetails.style.backgroundColor = testCaseResult ? "#c0ffbf" : "#ffbfbf";
  testcaseDetails.style.backgroundColor = notAvailable ? "#bdbfbe" : testcaseDetails.style.backgroundColor;
  testcaseDetails.style.display = "none"

  id_name.addEventListener("click", function () {
    originalConsoleLog("toggle...")
    id_name.classList.toggle("active");
    if (testcaseDetails.style.display === "block") {
      testcaseDetails.style.display = "none";
    } else {
      testcaseDetails.style.display = "block";
    }
  });

  container.appendChild(id_name);
  container.appendChild(testcaseDetails);

  report.appendChild(container);
}


function toggleVisibility(target) {
  const report = document.getElementById(target);

  if (report.style.display == 'none') {
    report.style.display = 'block'
  }
  else {
    report.style.display = 'none'
  }
}

//runapicall
async function runAPICall(fullString, input) {

  const method = fullString.slice(0, fullString.indexOf("1") + 1) || fullString.slice(0, fullString.lastIndexOf("."));
  const api = fullString.slice(fullString.lastIndexOf(".") + 1);

  console.log("Method- ", method)
  console.log("api- ", api)
  console.log("Input- ", input)


  try {
    var response
    var result = false
    if (method.startsWith("client")) {
      console.log("Catching notification...")
      waitForObjectInDictionary(api, 10000)
        .then(output => {
          console.log(output); // Will log either "Found" or "Not found"
          result = true
        })
        .catch(error => {
          console.log(error);  // Will log "Not found" if object wasn't found in time
        });
    }
    if (result) return { 'client': output }

    if (input == "" || input == "None" || input == NaN || input == {}) {
      // originalConsoleLog("No input!!!")
      response = await thunderJS.call(method, api);
    }
    else {
      response = await thunderJS.call(method, api, input);
    }
    console.log("Response: ", response)
  }
  catch (error) {
    // Handle the API error
    log('API error:', error);
    console.error('API error:', error);
  }
  return response
}

async function loopAPI(step_api, array) { //parameters - the whole step api and saved array

  const keyword = step_api['KEY_WORD']
  const compare = step_api['COMPARE_DATA']
  const api_list = step_api['api_list']
  var data = []
  var result = true
  console.log("Running LoopAPI!")

  for (let item in array) {

    const value = array[item]
    console.log("Value: ", value)
    //assigne the value to respetive fields
    const filledList = assignValueToKeyword(keyword[0], value, api_list)

    for (let step_index in filledList) {

      const step = filledList[step_index]
      const response = await runAPICall(step['api'], step['Input Parameters'])
      if (response.hasOwnProperty('client')) {
        data.push({
          'Notification': response['client']
        })
      }
      const output = deepCompareObjects(step['Expected Output'], response)
      const step_output = (output == 'Objects are equal')
      console.log('output- ', step_output)
      data.push(
        {
          'api': step['api'],
          'Expected': step['Expected Output'],
          'API Response': response,
          'Result': step_output
        }
      )
      result = result && step_output
      if (!result) break
    }
    if (!result) break
  }
  console.log("DATA:", data)
  return { 'data': data, 'result': result }
}
// to fill the data in respective keyword
function assignValueToKeyword(keyword, value, inputObject) {
  // Base case: if the input is not an object, return it as is
  if (typeof inputObject !== 'object' || inputObject === null) {
    return inputObject;
  }

  // Create a new object to hold the modified properties
  const updatedObject = Array.isArray(inputObject) ? [] : {};

  // Iterate through the object's properties
  for (const prop in inputObject) {
    if (inputObject.hasOwnProperty(prop)) {
      // If the property matches the keyword, assign the value
      if (prop === keyword) {
        updatedObject[prop] = value;
      } else {
        // Recursively search nested objects and assign to the new object
        updatedObject[prop] = assignValueToKeyword(keyword, value, inputObject[prop]);
      }
    }
  }

  return updatedObject;
}

function passedTestCase(testcase) {
  passedArray.push(testcase)

  var el = document.getElementById('Livelog')
  var entry = '<p class="font-bold" style="color: green">Passed.</p>'

  el.innerHTML += entry
}
function failedTestCase(step, testcase) {
  failedArray.push(testcase)

  var el = document.getElementById('Livelog')
  var entry = `<p class="font-bold" style="color: red">Failed at Step->${step} </p>`

  el.innerHTML += entry
}

//modifying the summary section

function createCollapsibleButton(category, items) {
  var container = document.getElementById("collapsible-container");

  var button = document.createElement("button");
  button.classList.add("collapsible");
  button.textContent = category;

  var content = document.createElement("div");
  content.classList.add("content");

  var list = document.createElement("ul");
  for (var i = 0; i < items.length; i++) {
    var listItem = document.createElement("li");
    var subItemButton = document.createElement("button");
    subItemButton.textContent = items[i].name;
    subItemButton.style.color = (items[i].data["Test Case Result"] == 'SUCCESS') ? "green" : "red";
    subItemButton.style.color = (items[i].data["Test Case Result"] == 'NA') ? "grey" : subItemButton.style.color;

    // Attach event listener to sub-item button
    subItemButton.addEventListener("click", function (data) {
      return function () {
        var logDiv = document.getElementById("log");

        //log detail part
        logDiv.innerHTML = generateHTMLFromDict(data)

        console.log(data)
      };
    }(items[i].data));

    listItem.appendChild(subItemButton);
    list.appendChild(listItem);
  }

  content.appendChild(list);

  button.addEventListener("click", function () {
    this.classList.toggle("active");
    content.style.maxHeight = (content.style.maxHeight) ? null : content.scrollHeight + "px";
  });

  container.appendChild(button);
  container.appendChild(content);
}

function createPieChart(passed, failed, skipped) {
  var total = passed + failed + skipped;

  var canvas = document.getElementById('myPieChart');
  var ctx = canvas.getContext('2d');

  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = Math.min(centerX, centerY);

  var startAngle = 0;
  var endAngle = 0;

  // Passed
  endAngle = (passed / total) * 2 * Math.PI;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.fillStyle = 'rgba(75, 192, 100, 0.8)';
  ctx.fill();
  ctx.closePath();
  startAngle = endAngle;

  // Failed
  endAngle = (failed / total) * 2 * Math.PI;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, startAngle + endAngle);
  ctx.fillStyle = 'rgba(255, 99, 132, 0.8)';
  ctx.fill();
  ctx.closePath();
  startAngle += endAngle;

  // Skipped
  endAngle = (skipped / total) * 2 * Math.PI;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, startAngle + endAngle);
  ctx.fillStyle = 'rgba(209, 207, 207, 0.8)';
  ctx.fill();
  ctx.closePath();

  // Display statistics
  document.getElementById('passed').textContent = passed;
  document.getElementById('failed').textContent = failed;
  document.getElementById('skipped').textContent = skipped;

  document.getElementById('passedPercentage').textContent = ((passed / total) * 100).toFixed(2) + '%';
  document.getElementById('failedPercentage').textContent = ((failed / total) * 100).toFixed(2) + '%';
  document.getElementById('skippedPercentage').textContent = ((skipped / total) * 100).toFixed(2) + '%';

  // Display percentage text within the pie chart
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

//progress bar update
function updateProgress() {

  var passed = 0; for (const key in passedDict) passed += passedDict[key].length;
  var failed = 0; for (const key in failedDict) failed += failedDict[key].length;
  var NA = 0; for (const key in NAedDict) NA += NAedDict[key].length;
  const total = passed + failed + NA;
  createPieChart(passed, failed, NA)

  originalConsoleLog("stats- ", [passed, failed, NA, total])
}

//attach the list of passed,failed and NA testcases

function attachSummaryList() {
  const report = document.getElementById("hiddenReportDiv")

  const statistics = document.getElementById('statistics')

  const stat_div = document.createElement('div')
  stat_div.innerHTML = statistics
  // report.appendChild(stat_div)

  const noneText = document.createElement('p')
  noneText.textContent = "None"

  const passtext = document.createElement('h4')
  passtext.textContent = "Passed testcases:"
  const passedtestcasesList = document.createElement('div')
  passedtestcasesList.innerHTML = generateHTMLFromDict(passedDict)
  report.appendChild(passtext)
  if (Object.keys(passedDict).length != 0) report.appendChild(passedtestcasesList)
  else report.appendChild(noneText)

  const failtext = document.createElement('h4')
  failtext.textContent = "Failed testcases:"
  const failedtestcasesList = document.createElement('div')
  failedtestcasesList.innerHTML = generateHTMLFromDict(failedDict)
  report.appendChild(failtext)
  if (Object.keys(failedDict).length != 0) report.appendChild(failedtestcasesList)
  else report.appendChild(noneText)

  const NAtext = document.createElement('h4')
  NAtext.textContent = "NA testcases:"
  const NAtestcasesList = document.createElement('div')
  NAtestcasesList.innerHTML = generateHTMLFromDict(NAedDict)
  report.appendChild(NAtext)
  if (Object.keys(NAedDict).length != 0) report.appendChild(NAtestcasesList)
  else report.appendChild(noneText)

}
//download the live logs

function downloadLogs() {
  const formatOptions = ['pdf', 'html', 'xls']; // Available format options
  const supportedFormats = ['pdf', 'html', 'xls'];

  // Open a new browser window or tab
  const popupWindow = window.open('', '_blank', 'width=400,height=300');

  // Create the content for the popup window
  const popupContent = document.createElement('div');
  popupContent.innerHTML = `
    <h2>Select a format:</h2>
    <select id="formatSelect">
      ${formatOptions.map(format => `<option value="${format}">${format.toUpperCase()}</option>`).join('')}
    </select>
    <button onclick="downloadSelectedFormat()">Download</button>
  `;

  // Append the content to the popup window
  popupWindow.document.body.appendChild(popupContent);

  // Function to handle the download based on the selected format
  popupWindow.downloadSelectedFormat = function () {
    const formatSelect = popupWindow.document.getElementById('formatSelect');
    const selectedFormat = formatSelect.value.toLowerCase();

    // Check if the selected format is supported
    if (!supportedFormats.includes(selectedFormat)) {
      alert('Invalid format selection. Please choose from: PDF, HTML, or XLS');
      return;
    }

    const liveLog = document.getElementById('hiddenReportDiv'); // Get the live logs container element
    const divContent = liveLog.innerHTML;
    if (selectedFormat === 'pdf') {
      // Download as PDF
      // Register the fonts (if you're using custom fonts)
      pdfMake.vfs = pdfMake.vfs || pdfMakeFonts.pdfMake.vfs;

      // Define the PDF document definition
      const pdfDocDefinition = {
        content: [
          {
            text: 'PDF generated from HTML content:',
            fontSize: 16,
            bold: true,
            margin: [0, 0, 0, 10], // Optional margin for the title
          },
          {
            // Use pdfHtml to render the HTML content
            image: pdfMake.createPdfKitDocument(pdfMake.createPdf(divContent))._buffer,
            width: 500, // Adjust the width as needed
          },
        ],
        pageMargins: [40, 40, 40, 40],
      };

      // Generate and download the PDF
      pdfMake.createPdf(pdfDocDefinition).download('console_logs.pdf');
    } else if (selectedFormat === 'html') {
      // Download as HTML
      const summaryHTML = liveLog.innerHTML;
      const downloadLink = popupWindow.document.createElement('a');
      downloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(summaryHTML);
      downloadLink.download = 'console_logs.html';
      downloadLink.click();
    } else if (selectedFormat === 'xls') {
      // Download as XLSX
      const logMessages = Array.from(liveLog.children).map(log => log.textContent.trim());
      const worksheet = XLSX.utils.aoa_to_sheet(logMessages.map(log => [log]));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Console Logs');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const downloadLink = popupWindow.document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'console_logs.xlsx';
      downloadLink.click();
      URL.revokeObjectURL(url);
    }

    // Close the popup window after the download
    popupWindow.close();
  };
}

//delete all the selected testcases

function deleteAllSelectedTestCases() {
  checkedIndicesDict = {}
  printAddedTestcases(checkedIndicesDict);
}

//time and date function
function getDateAndTime() {

  const currentDate = new Date();
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formattedDate = currentDate.toLocaleString(undefined, dateOptions);
  const formattedTime = currentDate.toLocaleString(undefined, timeOptions);
  return `${formattedDate}-${formattedTime}`;

}
//get timestamp
function getTime() {

  const currentDate = new Date();
  // const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  // const formattedDate = currentDate.toLocaleString(undefined, dateOptions);
  const formattedTime = currentDate.toLocaleString(undefined, timeOptions);
  return `${formattedTime}`;

}

//report generation in TDK format
async function getDeviceInfo() {
  await activatePlugin("DeviceInfo")
  // console.log("Getting Device Info.")

  const dateAndtime = getDateAndTime()
  const report = document.getElementById("summary-report-stats")

  // Create the heading element (h1 in this case)
  var headingElement = document.createElement('h1');
  headingElement.textContent = dateAndtime;

  // Create the paragraph element
  var paragraphElement = document.createElement('h3');
  paragraphElement.textContent = "Device Info.";

  const systemInfo = await customAPIcall("DeviceInfo.1.systeminfo", "")
  const imageversionInfo = await customAPIcall("DeviceInfo.1.firmwareversion", "")
  // originalConsoleLog("systemInfo",systemInfo)
  const selectedDeviceInfo = {
    "Device Name": systemInfo["devicename"],
    "IP Address": IP_ADDRESS,
    "Image Name": imageversionInfo["imagename"],
    "Yocto Version": imageversionInfo["yocto"],
    "Uptime": systemInfo["uptime"] + " sec",
  }

  const tabledeviceinfo = document.createElement("div")
  tabledeviceinfo.innerHTML = generateHTMLFromDict(selectedDeviceInfo)
  // Add the heading and paragraph elements to the div
  report.appendChild(headingElement);
  report.appendChild(paragraphElement);
  report.appendChild(tabledeviceinfo)
}
getDeviceInfo()


function downloadReportSummary() {

  const reportSummaryDiv = document.getElementById('reportTable')


  downloadDivContent('reportTable')
}
// function downloadDivContentAsPDF(divName) {
//   const element = document.getElementById(divName)

//   var opt = {
//     margin: 1,
//     filename: 'myfile.pdf',
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//   };

//   // New Promise-based usage:
//   html2pdf().set(opt).from(element).save();
// }
function downloadReport() {

  const reportDiv = document.getElementById('hiddenReportDiv');
  const scriptContent = `
  <script>
    document.addEventListener("DOMContentLoaded", function () {
      const report = document.getElementById("hiddenReportDiv");

      function toggleContent(button, content) {
        button.classList.toggle("active");
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      }

      const buttons = document.getElementsByClassName("reportCollapsible");
      for (const button of buttons) {
        button.addEventListener("click", function () {
          const container = this.parentElement;
          const content = container.querySelector(".reportContent");
          toggleContent(this, content);
        });
      }

      const module_buttons = document.getElementsByClassName("moduleButton");
      for (const button of module_buttons) {
        button.addEventListener("click", function () {
          const container = this.parentElement;
          const content = container.querySelector(".moduleContent");
          toggleContent(this, content);
        });
      }
    });
  </script>`
  reportDiv.innerHTML += scriptContent
  downloadDivContent('hiddenReportDiv');
  // const outerLoop = document.getElementById('')
}

function downloadDivContent(divName) {
  const myDiv = document.getElementById(divName);
  var content = myDiv.innerHTML;

  // Create a Blob from the content
  const blob = new Blob([content], { type: 'text/html' });

  // Create a URL for the Blob
  const blobURL = URL.createObjectURL(blob);

  // Get current date and time
  const dt = getDateAndTime();
  // Create a link
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = `Report-${dt}.html`; // The name of the downloaded file

  // Simulate a click on the link to initiate the download
  a.click();

  // Clean up the URL object after the download
  URL.revokeObjectURL(blobURL);

  // Create a script element and add it to the head
  const scriptElement = document.createElement('script');
  scriptElement.src = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>'
  // Set the source of your script
  scriptElement.type = 'text/javascript'; // Set the type if necessary
  document.head.appendChild(scriptElement);
}


//////custom api calls

// Function that will handle the form submission
function processForm(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the values from the form fields
  const apicallValue = document.getElementById("apicall").value;
  const inputValue = document.getElementById("input").value;

  // Call your function and pass the values as arguments
  customAPIcall(apicallValue, inputValue);
}

function parseStringToObject(inputString) {
  if (typeof inputString === 'object') return inputString
  try {
    let parsedObject = JSON.parse(inputString);
    return parsedObject;
  } catch (error) {
    console.error('Error parsing the input string:', error.message);
    return null;
  }
}

function extractNumberInDots(inputString) {
  const regex = /\.(\d+)\./; // Matches a period, captures one or more digits, and matches another period
  const match = regex.exec(inputString);
  if (match && match[1]) {
    return match[1]; // Return the captured number
  }
  return "1"; // Return null if no match is found
}


function breakAPI(apicall) {

  const number = extractNumberInDots(apicall)[0]

  var module = apicall.slice(0, apicall.indexOf(number) + 1) || apicall.slice(0, apicall.lastIndexOf("."));
  var apiName = apicall.slice(apicall.lastIndexOf(".") + 1);

  if (apicall.includes("@") && apicall.includes(number)) {
    module = apicall.slice(0, apicall.lastIndexOf(number) + 1)
    apiName = apicall.slice(apicall.lastIndexOf(number) + 2)
  }
  return [module, apiName]
}

// Function that you want to call with the input values
async function customAPIcall(apicall, input_string) {
  originalConsoleLog("CUSTOM API CALL!")
  const brokenAPI = breakAPI(apicall)

  var module = brokenAPI[0]
  var apiName = brokenAPI[1]

  const input = (input_string) ? parseStringToObject(input_string) : ""

  var response

  try {

    if (input == "" || input == "None" || input == NaN) {
      // originalConsoleLog("No input!!!")
      response = await thunderJS.call(module, apiName);
    }
    else {
      // originalConsoleLog("Input:", input)
      response = await thunderJS.call(module, apiName, input);
    }

    // originalConsoleLog("Output:\t", response);

    // originalConsoleLog([apicall,input])

  } catch (error) {
    // Handle the API error
    log('API error:', error);
    console.error('API error:', error);
  }
  // originalConsoleLog([apicall,input,response])
  originalConsoleLog([module, apiName, input, response])
  return response
}

// Add event listener to the form to call the processForm function on submit
const form = document.getElementById("myForm");
form.addEventListener("submit", processForm);


function waitForObjectInDictionary(keyToFind, timeoutMs) {
  return new Promise((resolve, reject) => {
    // Set up a timeout
    const timeout = setTimeout(() => {
      clearTimeout(timeout); // Clear the timeout
      reject("Not found");   // Reject the promise if time is up
    }, timeoutMs);

    // Check if the object is added to the dictionary
    const checkDictionary = () => {
      if (eventDict.hasOwnProperty(keyToFind)) {
        clearTimeout(timeout); // Clear the timeout
        resolve("Found");      // Resolve the promise if object is found
      } else {
        setTimeout(checkDictionary, 100); // Check again after a short delay
      }
    };

    // Start checking the dictionary
    checkDictionary();
  });
}

// // Example usage
// const myDictionary = {};
// waitForObjectInDictionary(myDictionary, "myKey", 10000)
//   .then(result => {
//     console.log(result); // Will log either "Found" or "Not found"
//   })
//   .catch(error => {
//     console.log(error);  // Will log "Not found" if object wasn't found in time
//   });

// // Simulate adding the object to the dictionary after 5 seconds
// setTimeout(() => {
//   myDictionary["myKey"] = { value: "someValue" };
// }, 5000);




////////////////////////////////////////////////////////////////////////////////////////////

function reboot() {
  log('Calling: Controller.harakiri')
  thunderJS.Controller.harakiri()
    .then(function (result) {
      log('Success', result)
    })
    .catch(function (error) {
      log('Error', error)
    })
}


function getSystemInfo() {
  // logEvent()
  var systeminformation
  log('Calling: DeviceInfo.systeminfo')
  thunderJS.DeviceInfo.systeminfo()
    .then(function (result) {
      log('Success', result)
      systeminformation = result
    })
    .catch(function (error) {
      log('Error', error)
    })
  // return systeminformation
}


function log(msg, content, status) {
  // console.log(msg,content)
  var el = document.getElementById('Livelog')
  var entry = '<h2 class="font-bold">' + msg + '</h2>'

  if (content) {
    entry += '<pre class="border mt-4 mb-8 text-sm">' + JSON.stringify(content, null, 2) + '</pre>'
  }


  entry += '<hr class="border-b" />'

  el.innerHTML += entry
}


function generateHTMLFromDict(dict) {
  let html = '<table style="border-collapse: collapse; border: 1px solid #ddd; text-align: left;">';

  for (const key in dict) {
    const value = dict[key];

    if (Array.isArray(value)) {
      html += '<tr>';
      html += `<td style="vertical-align: top; padding: 8px; border: 1px solid #ddd;">${key}</td>`;
      html += `<td style="vertical-align: top; padding: 8px; border: 1px solid #ddd;"><ul>${generateHTMLFromArray(value)}</ul></td>`;
      html += '</tr>';
    } else if (typeof value === 'object') {
      html += '<tr>';
      html += `<td style="vertical-align: top; padding: 8px; border: 1px solid #ddd;">${key}</td>`;
      html += `<td style="vertical-align: top; padding: 8px; border: 1px solid #ddd;">${generateHTMLFromDict(value)}</td>`;
      html += '</tr>';
    } else {
      html += '<tr>';
      html += `<td style="vertical-align: top; padding: 8px; border: 1px solid #ddd;">${key}</td>`;
      html += `<td style="vertical-align: top; padding: 8px; border: 1px solid #ddd;">${value}</td>`;
      html += '</tr>';
    }
  }

  html += '</table>';

  return html;
}

function generateHTMLFromArray(arr) {
  let html = '';

  arr.forEach((item) => {
    if (Array.isArray(item)) {
      html += '<ul>';
      html += generateHTMLFromArray(item);
      html += '</ul>';
    } else if (typeof item === 'object') {
      html += '<ul>';
      html += generateHTMLFromDict(item);
      html += '</ul>';
    } else {
      html += `<li>${item}</li>`;
    }
  });

  return html;
}





// using ssh command execution

// import { executeRemoteCommand } from './NodeJS/sshModule.mjs'

// const connectionInfo = {
//   host: '192.168.2.103',     // Replace with the remote machine's IP
//   port: 22,              // SSH port (usually 22)
//   // username: 'youruser',  // SSH username
//   // password: 'yourpass'   // SSH password (or use private key authentication)
// };

// const command = 'ls -la'; // Command you want to run

// executeRemoteCommand(connectionInfo, command)
//   .then(output => {
//     console.log('Command output:', output);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

var reportTableObject;
function summaryTable() {
  var reportTable = {
    "Module": [],
    "Passed": [],
    "Failed": [],
    "NA": [],
    "Total": []
  }
  var passed_count = 0
  var failed_count = 0
  var na_count = 0
  var total_count = 0

  for (const module in checkedIndicesDict) {

    const p = (passedDict.hasOwnProperty(module)) ? passedDict[module].length : 0
    const f = (failedDict.hasOwnProperty(module)) ? failedDict[module].length : 0
    const na = (NAedDict.hasOwnProperty(module)) ? NAedDict[module].length : 0
    const total = p + f + na
    reportTable["Module"].push(module)

    reportTable["Passed"].push(p)

    reportTable["Failed"].push(f)

    reportTable["NA"].push(na)

    reportTable["Total"].push(total)

    passed_count += p
    failed_count += f
    na_count += na
    total_count += total
  }
  reportTable["Module"].push("TOTAL")
  reportTable["Passed"].push(passed_count)
  reportTable["Failed"].push(failed_count)
  reportTable["NA"].push(na_count)
  reportTable["Total"].push(total_count)

  reportTableObject = reportTable

  updateReportTable(reportTable);

  // const summary_stat_title = document.createElement('h3')
  // summary_stat_title.textContent = "Execution Stat:"
  // const stat = {
  //   'Passed:': passed_count,
  //   'Failed:': failed_count,
  //   'NA:': na_count,
  //   'Total:': total_count
  // }
  // const stat_table = generateHTMLFromDict(stat)
  // report.appendChild(summary_stat_title)
  // report.innerHTML += stat_table
}

function updateReportTable(reportTable) {
  const summary_table = document.getElementById("reportTable");
  const tableHtml = createTableFromObject(reportTable);

  // Clone the table before appending it to summary_table
  const tableHtmlClone = tableHtml.cloneNode(true);
  summary_table.innerHTML = '';
  summary_table.appendChild(tableHtmlClone);

  const report = document.getElementById("summary-report-stats");
  const summary_table_title = document.createElement('h3');
  summary_table_title.textContent = "Summary Table:";
  report.appendChild(summary_table_title);
  report.appendChild(tableHtml);

}

const summarytableCSVbutton = document.getElementById("summarytableCSVbutton")
summarytableCSVbutton.addEventListener("click", function () {
  downloadCSV(reportTableObject);
})

const reportCSVbutton = document.getElementById("reportCSVbutton")
reportCSVbutton.addEventListener("click", function () {
  downloadCSV(reportCSVobject);
})

function downloadCSV(data) {
  let columnNames, columnData;

  // Check if data is an array
  if (Array.isArray(data)) {
    if (data.length === 0 || !Array.isArray(data[0])) {
      console.error('Invalid array data');
      return;
    }

    // Transpose the input array to get column-wise data
    columnData = data[0].map((_, colIndex) => data.map(row => row[colIndex]));

    // Generate column names as numeric indices
    columnNames = Array.from(Array(columnData.length).keys()).map(String);
  } else if (typeof data === 'object') {
    // Assuming the data is an object with keys as column names and arrays as values
    columnNames = Object.keys(data);
    columnData = Object.values(data);
  } else {
    console.error('Invalid data type');
    return;
  }

  // Create a header row from the column names
  const headerRow = columnNames.join(',');

  // Create an array to hold the CSV rows
  const csvRows = [headerRow];

  // Iterate through the data and create CSV rows
  for (let i = 0; i < columnData[0].length; i++) {
    const row = columnData.map(column => column[i]);
    csvRows.push(row.join(','));
  }

  // Convert the csvRows array into a CSV-formatted string
  const csvContent = csvRows.join('\n');

  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Report-Table.csv';

  // Trigger the click event on the link to start the download
  link.click();

  // Clean up by revoking the URL object
  URL.revokeObjectURL(url);
}






function createTableFromObject(data) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Apply table styles
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  table.style.border = '1px solid #ccc';

  // Apply cell styles
  const cellStyles = {
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ccc'
  };

  // Create table header with column names
  const headerRow = document.createElement('tr');
  Object.keys(data).forEach(column => {
    const th = document.createElement('th');
    th.textContent = column;
    Object.assign(th.style, cellStyles);
    th.style.backgroundColor = '#f2f2f2';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Create table rows with data
  const rowCount = data["Module"].length;
  for (let i = 0; i < rowCount; i++) {
    const row = document.createElement('tr');
    Object.keys(data).forEach(column => {
      const cell = document.createElement('td');
      cell.textContent = data[column][i];
      Object.assign(cell.style, cellStyles);
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  // originalConsoleLog(table)

  return table;
}

const heartBeatDiv = document.getElementById("HeartBeat")
async function heart() {
  if (heartbeat) {
    heartBeatDiv.style.backgroundColor = 'green'
    // await thunderJS.call("Controller.1", "activate", { "callsign": "PlayerInfo" });
  }
  else {
    heartBeatDiv.style.backgroundColor = 'red'
  }

  try {
    await thunderJS.call("Controller.1", "activate", { "callsign": "PlayerInfo" });
  } catch (error) {
    // Handle the API error
    // log('API error:', error);
    console.error('API error:', error);
  }
  await sleep(1000)
  heart()
}
heart()




