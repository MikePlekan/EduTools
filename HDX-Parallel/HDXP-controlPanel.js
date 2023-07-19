// Description: This file contains the code for the control panel and the thread panels
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
function controlPanel(id) {
    let Threadid = id;
    //make a html div and set its id to the thread id and add it to the control panel
    let div = document.createElement("div");
    //add class to the div
    div.classList.add("threadPanel");
    div.id = "Panel" + Threadid;
    //add header to the div
    let header = document.createElement("h4");
    header.innerHTML = "Thread " + Threadid;
    div.appendChild(header);
    document.getElementById("controlPanel").appendChild(div);
    //function that makes a table out of the actionlist using the order property of each action to determine the order of the actions
    //also adds the css class to the table
    function addpseudoCode() {
        //make a table
        let table = document.createElement("table");
        table.classList.add("pseudoCode");

        //add the rest of the rows by the order property
        Object.values(AV.Actions).sort((a, b) => a.order - b.order).forEach(function (action) {
            if (action.pseudoCode != null) {
                let row = document.createElement("tr");
                row.classList.add("pseudoRow");
                row.addEventListener("click", Breakpoint.bind(null, action));
                let cell = document.createElement("td");
                cell.innerHTML = action.pseudoCode;
                row.appendChild(cell);

                table.appendChild(row);
            }
        });
        div.appendChild(table);
    }
    function highlightPseudoCode(action) {
        //remove the highlight from the previous action
        let prevAction = document.getElementById("Panel" + Threadid).getElementsByClassName("highlight")[0];
        if (prevAction != null) {
            prevAction.classList.remove("highlight");
        }
        //highlight the current action
        let currentAction = document.getElementById("Panel" + Threadid).getElementsByTagName("table")[0].getElementsByTagName("tr")[action.order];
        currentAction.classList.add("highlight");
    }
    //function that adds a breakpoint from a click on a table row in the pseudo code
    function Breakpoint(action, event) {
        //get the row that was clicked, if a cell was clicked get the parent row
        let row = event.target.tagName == "TD" ? event.target.parentElement : event.target;
        //check if the action is already in the breakpoints list
        if (Threads[Threadid].breakpoints.includes(action)) {
            //remove the breakpoint
            Threads[Threadid].breakpoints.splice(Threads[Threadid].breakpoints.indexOf(action), 1);
            //remove the breakpoint class from the row
            row.classList.remove("breakpoint");
        }
        else {
            //add the breakpoint
            Threads[Threadid].breakpoints.push(action);
            //add the breakpoint class to the row
            row.classList.add("breakpoint");
        }
    }

    //adds info panel to the control panel under the thread
    function addInfoPanel(infoHTML, infoPanelId, options) {
        //make new div for the info panel
        let infoDiv = document.createElement("div");
        infoDiv.setAttribute("id", infoPanelId + Threadid);
        infoDiv.classList.add("infoPanel");
        //add the css options to the info panel
        if (options != null) {
            Object.keys(options).forEach(function (key) {
                infoDiv.style[key] = options[key];
            });
        }
        //add the info to the info panel
        infoDiv.innerHTML = infoHTML;
        //add div to the control panel
        div.appendChild(infoDiv);
    }
    //function that edits the info panel
    function editInfoPanel(infoHTML, infoPanelId) {
        //get the info panel
        let infoDiv = document.getElementById(infoPanelId + Threadid);
        //edit the info panel
        infoDiv.innerHTML = infoHTML;
    }
    //function that removes the info panel
    function removeInfoPanel(infoPanelId) {
        //get the info panel
        let infoDiv = document.getElementById(infoPanelId + Threadid);
        //remove the info panel
        infoDiv.remove();
    }
    function clearPanel() {
        //remove everything from the control panel
        div.innerHTML = "";
    }
    function deletePanel() {
        //remove the control panel
        div.remove();
    }

    return {
        id: Threadid,
        htmldiv: div,
        addpseudoCode: addpseudoCode,
        highlightPseudoCode: highlightPseudoCode,
        addInfoPanel: addInfoPanel,
        editInfoPanel: editInfoPanel,
        removeInfoPanel: removeInfoPanel,
        clearPanel: clearPanel,
        deletePanel: deletePanel,
    };
}