//
// HDX pseudocode support functions
//
// METAL Project
//
// Primary Author: Jim Teresco
//

// update a chunk of pseudocode with an id based on given visualsettings
// now also managing execution counts
function highlightPseudocode(id, vs) {

    let codeChunk = document.getElementById(id);
    if (codeChunk != null) {
        codeChunk.style.backgroundColor = vs.color;
        codeChunk.style.color = vs.textColor;
        hdxAV.previousHighlight = id;

        // execution counting
        if (id in hdxAV.execCounts) {
            hdxAV.execCounts[id]++;
        }
        else {
            hdxAV.execCounts[id] = 1;
        }

        // if we have a new largest count, we'll recolor
        if (hdxAV.execCounts[id] > hdxAV.maxExecCount) {
            hdxAV.maxExecCount = hdxAV.execCounts[id];
            hdxAV.execCountRecolor = true;
        }
        //codeChunk.title = "Exec count: " + hdxAV.execCounts[id];
        //codeChunk.setAttribute("custom-title",codeChunk.title);
        codeChunk.setAttribute("custom-title", ("Exec count: " + hdxAV.execCounts[id]));
    }
}

// unhighlight previously-highlighted pseudocode
function unhighlightPseudocode() {

    if (hdxAV.previousHighlight != null) {
        let codeChunk = document.getElementById(hdxAV.previousHighlight);
        if (codeChunk != null) {
            codeChunk.style.backgroundColor =
                hdxAV.execCountColor(hdxAV.execCounts[hdxAV.previousHighlight]);
            // above was: visualSettings.pseudocodeDefault.color;
            codeChunk.style.color = visualSettings.pseudocodeDefault.textColor;
            hdxAV.previousHighlight = null;
        }
    }
    // did we trigger a recolor?  if so, recolor all
    if (hdxAV.execCountRecolor) {
        hdxAV.execCountRecolor = false;
        for (let key in hdxAV.execCounts) {
            let codeChunk = document.getElementById(key);
            codeChunk.style.backgroundColor =
                hdxAV.execCountColor(hdxAV.execCounts[key]);
        }
    }
        
}

// function to help build the table of pseudocode for highlighting
// indent: number of indentation levels
// code: line or array of code lines to place in block
// id: DOM id to give the enclosing td element
function pcEntry(indent, code, id) {

    let entry;
    if (entry != "") {
        entry = '<tr class="codeRow"><td id="' + id + '">';
    }
    else {
        entry = '<tr class="codeRow"><td>';
    }
    if (Array.isArray(code)) {
        for (var i = 0; i < code.length; i++) {
            for (var j = 0; j < indent; j++) {
                entry += "&nbsp;&nbsp;";
            }
            entry += code[i] + "<br />";
        }
    }
    else {
        for (var i = 0; i < indent; i++) {
            entry += "&nbsp;&nbsp;";
        }
        entry += code;
    }
    entry += '</td></tr>';
    return entry;
}

//Adds a click event to all rows with the codeRow class. This is used obtain the ID of the
//correct row to assign it to the global variable
var breakpoint = ""; //currently selected breakpoint
var previousBreakpoint = ""; //previous breakpoint, used to change border back/unselect
function addStop()
{
    let elements = document.getElementsByClassName("codeRow");
    for(let element=1; element<=elements.length; element++) {
        elements[element-1].addEventListener("click", function (event) {

                var target = event.target;
                previousBreakpoint = breakpoint;
                breakpoint = target.getAttribute("id");

                //if the previous and current breakpoints are the same, unselect it, and change the colors back
                //Else, deselect the previous, and highlight current
                if(previousBreakpoint == breakpoint)
                {
                    codeRowHighlight();
                    previousBreakpoint = "";
                    breakpoint = "";
                    breakpointCheckerDisplay();
                }
                else {
                    codeRowHighlight();
                    breakpointHighlight();
                    breakpointCheckerDisplay();
                }
        }, false);
    }
}

//Highlight the current breakpoint
function breakpointHighlight(){
    let element = document.getElementById(breakpoint);
    if(element != null) {
        element.style.borderStyle = "dashed";
        element.style.borderColor = "Red";
        element.style.borderWidth = "2px";
    }
}

//Change the border back to a normal codeRow
function codeRowHighlight()
{
    let element = document.getElementById(previousBreakpoint);
    if(element != null) {
        element.style.borderStyle = "solid";
        element.style.borderColor = "Black";
        element.style.borderWidth = "1px";
    }
}

//Reset the breakpoint variables to avoid issues on reset
function cleanupBreakpoints()
{
    breakpoint = "";
    previousBreakpoint = "";
}

var useVariable = false;
var breakpointVariableHidden  = true;//What position is the selector in?
//Enables the clickable function and window resize change for the selector
function showHideBreakpointVariableSelector()
{
    let element = document.getElementById("showBreakpointVariable");
    element.addEventListener("click", function(event) {
        let target = event.target;
        let avPanel = document.getElementById("avStatusPanel");
        let parentContainer = target.parentElement;
        let rect = parentContainer.getBoundingClientRect();
        let rect2 = avPanel.getBoundingClientRect();
        
        if(breakpointVariableHidden == true)
        {
            parentContainer.style.left = rect2.right + "px";
            breakpointVariableHidden = false;
        }
        else
        {
            setDefaultVariableSelectorLocation();
            breakpointVariableHidden = true;
        }
    }, false);
    window.addEventListener("resize", setDefaultVariableSelectorLocation, false);
}

//JS implementation to create the html for the selector. This allows for
//the html to be dynamically created after the avPanel is shown.
function createVariableSelector(){
    let divBreakpoint = document.createElement("div");
    let divBreakpoint1 = document.createElement("div");
    let divBreakpoint2 = document.createElement("div");
    let checkbox = document.createElement("input");
    
    checkbox.type = "checkbox";
    checkbox.id = "useBreakpointVariable";
    checkbox.onclick = function(){
        if(useVariable == false){
            useVariable = true;  
        }
        else{
            useVariable = false;
        }     
    }
    
    let breakpointID = document.createAttribute("id");
    let breakpoint1ID = document.createAttribute("id");
    let breakpoint2ID = document.createAttribute("id");
    
    breakpointID.value = "breakpointVariableSelector";
    breakpoint1ID.value = "breakpointText";
    breakpoint2ID.value = "showBreakpointVariable";
    
    divBreakpoint.setAttributeNode(breakpointID);
    divBreakpoint1.setAttributeNode(breakpoint1ID);
    divBreakpoint2.setAttributeNode(breakpoint2ID);
    
    var breakpointClass = document.createAttribute("class");
    breakpointClass.value = "border border-primary rounded";
    divBreakpoint.setAttributeNode(breakpointClass);
    
    divBreakpoint1.innerHTML = "This is where the variable selector goes";
    divBreakpoint2.innerHTML = "-->";
    divBreakpoint2.style.backgroundColor = "Red";
    
    //append the smaller divs to the bigger one
    divBreakpoint.appendChild(divBreakpoint1);
    divBreakpoint.appendChild(divBreakpoint2);
    divBreakpoint.appendChild(checkbox);
    
    //Set the main div under the document body
    document.body.appendChild(divBreakpoint);
    //Set the default position, add click on/window resize events and hide it
    setDefaultVariableSelectorLocation();
    showHideBreakpointVariableSelector();
    divBreakpoint.style.display = "none";
    
}

//Sets the popout back to where it should be. Used to avoid 
//issues when resizing and turning it off via breakpoint selector
function setDefaultVariableSelectorLocation(){
    let avPanel = document.getElementById("avStatusPanel");
    let rect2 = avPanel.getBoundingClientRect();
    //CP right side - left side
    let difference2 = rect2.right-rect2.left;
    let element = document.getElementById("breakpointVariableSelector");
    let rect = element.getBoundingClientRect();
    let difference = rect.right - rect.left;
    //Width of the CP - the width of the selector + 25 offset to get it to stick out
    let trueDifference = difference2 - difference + 25;
    element.style.left = trueDifference + "px";
    breakpointVariableHidden = true;
}

//Based on if a breakpoint is selected or not, display o hide the element.
//Also reset the posiiton.
function breakpointCheckerDisplay(){
    let element = document.getElementById("breakpointVariableSelector");
    if(breakpoint == ""){
        element.style.display = "none";
    }
    else
    {
        element.style.display = "block";
    }
    setDefaultVariableSelectorLocation();
}
