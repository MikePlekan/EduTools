// Description: This file contains the code for the page builder object and its functions
//for building the pages of the site
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
const pageBuilder = {
    MapSelection: function (parentDiv) {
        //builds the map selection page for the site
        //this is a div that will appear in the middle of the page and will be removed when the user hits the select button

        //create the div
        let mapSelectionDiv = document.createElement("div");
        mapSelectionDiv.id = "mapSelectionDiv";
        mapSelectionDiv.className = "modal";
        //create Graph List
        Loader.createGraphList(mapSelectionDiv);
        //add html for modal
        let mapPicker = document.createElement("input");
        mapPicker.id = "mapPicker";
        mapPicker.type = "text";
        mapPicker.placeholder = "Map";
        mapPicker.title = "Map";
        mapPicker.setAttribute("list", "graphList");
        mapSelectionDiv.appendChild(mapPicker);
        //create the select button
        let selectButton = document.createElement("button");
        selectButton.id = "selectButton";
        selectButton.innerHTML = "Select";
        selectButton.onclick = function () {
            Loader.getGraph(mapPicker.value);
            mapSelectionDiv.remove();
            mapSelector();
            Loader.drawGraph();
            //build the partition selection page if the partition mode is single
            //this skips the partition selection page if the paritions were already set
            if (numThreads == 1) {
                pageBuilder.PartitionSelection(document.getElementById("controlPanel"));
            }
            else {
                pageBuilder.AVSelection(document.getElementById("controlPanel"));
            }
        };
        mapSelectionDiv.appendChild(selectButton);
        //create the cancel button
        let cancelButton = document.createElement("button");
        cancelButton.id = "cancelButton";
        cancelButton.innerHTML = "Cancel";
        cancelButton.onclick = function () {
            mapSelectionDiv.remove();
        }
        mapSelectionDiv.appendChild(cancelButton);
        //add the div to the body
        parentDiv.appendChild(mapSelectionDiv);
    },
    PartitionSelection: function (parentDiv) {
        //builds the partition selection page for the site
        //this is a div that will appear in the middle of the page and will be removed when the user hits the select button
        //create the div
        let partitionSelectionDiv = document.createElement("div");
        partitionSelectionDiv.id = "partitionSelectionDiv";
        let threadPicker = document.createElement("input");
        threadPicker.id = "threadPicker";
        threadPicker.type = "number";
        threadPicker.min = 1;
        threadPicker.max = 6;
        threadPicker.value = 1;
        threadPicker.title = "Number of Threads";
        partitionSelectionDiv.appendChild(threadPicker);
        //add an onchange listener to the thread picker
        threadPicker.onchange = function () {
            //set the number of threads
            setNumThreads(threadPicker.value);
            //if the number of threads is 1, set the partition mode to single
            if (numThreads == 1) {
                Partitions = PartitionModes.SINGLE();
                //set the partition mode picker to single
                partitionMode.value = "SINGLE";
            }
            //calls the onchange function of the partition mode picker to update the partitioning
            partitionMode.onchange();
        }
        //create the partitioning options
        let partitionMode = document.createElement("select");
        partitionMode.id = "partitionMode";
        partitionMode.title = "Partition Mode";
        partitionMode.value = "SINGLE";
        //add options to partition mode
        for (let mode in PartitionModes) {
            let option = document.createElement("option");
            option.value = mode;
            //make the string look nicer with normal capitalization and spaces instead of underscores
            option.innerHTML = mode.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function (l) { return l.toUpperCase() });
            option.title = "Partition Mode";
            partitionMode.appendChild(option);
        }
        partitionSelectionDiv.appendChild(partitionMode);
        //add an onchange listener to the partition mode picker
        partitionMode.onchange = function () {
            //run the partition mode function
            Partitions = PartitionModes[partitionMode.value]();
            Loader.drawGraph();
        }
        //create the done button
        let doneButton = document.createElement("button");
        doneButton.id = "doneButton";
        doneButton.innerHTML = "Done";
        doneButton.onclick = function () {
            //set the number of threads
            setNumThreads(threadPicker.value);
            //remove the div
            partitionSelectionDiv.remove();
            //build the AV selection page
            pageBuilder.AVSelection(document.getElementById("controlPanel"));
        }
        partitionSelectionDiv.appendChild(doneButton);
        //add the div to the body
        parentDiv.appendChild(partitionSelectionDiv);
    },
    AVSelection: function (parentDiv) {
        //builds the AV selection page for the site
        //this is a div that will appear in the middle of the page and will be removed when the user hits the select button
        //create the div
        let avSelectionDiv = document.createElement("div");
        avSelectionDiv.id = "avSelectionDiv";

        let avPicker = document.createElement("select");
        avPicker.id = "avPicker";
        //add options to av picker
        for (let i = 0; i < AvList.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = AvList[i].name;
            option.title = AvList[i].name;
            avPicker.appendChild(option);
        }
        avSelectionDiv.appendChild(avPicker);

        //create scheduler mode picker
        let schedulerMode = document.createElement("select");
        schedulerMode.id = "schedulerMode";
        //add options to scheduler mode
        let modes = [
            { name: "Round Robin", value: "RR" },
            { name: "Random", value: "RANDOM" },
            { name: "Shortest Job First", value: "SJF" },
            { name: "Longest Job First", value: "LJF" }
        ]
        modes.forEach(function (option) {
            let modeOption = document.createElement("option");
            modeOption.value = option.value;
            modeOption.innerHTML = option.name;
            modeOption.title = "Scheduling Mode";
            schedulerMode.appendChild(modeOption);
        });
        avSelectionDiv.appendChild(schedulerMode);

        //create the select button
        let selectButton = document.createElement("button");
        selectButton.id = "selectButton";
        selectButton.innerHTML = "Select";
        selectButton.onclick = function () {
            //set the AV
            AV = AvList[avPicker.value].func();
            //set global scheduler variable
            scheduler = new Scheduler(schedulerMode.value, Speed.FAST);
            //remove the div
            avSelectionDiv.remove();
            setupAV();
        }
        avSelectionDiv.appendChild(selectButton);
        //create the cancel button
        let cancelButton = document.createElement("button");
        cancelButton.id = "cancelButton";
        cancelButton.innerHTML = "Cancel";
        cancelButton.onclick = function () {
            avSelectionDiv.remove();
        }
        avSelectionDiv.appendChild(cancelButton);
        //add the div to the body
        parentDiv.appendChild(avSelectionDiv);
    },
    //build header bar with a title on the left and a start/stop button and a speed changer on the right
    buildHeaderBar: function () {
        //get header bar
        let headerBar = document.getElementById("header");
        //create title
        let title = document.createElement("span");
        title.innerHTML = "Parallel Visualization";

        //arrange elements in header bar
        headerBar.appendChild(title);
    },
    addAvControls: function () {
        //create start/stop button
        let startStop = document.createElement("button");
        startStop.innerHTML = "Start";
        startStop.id = "startStop";
        //create speed changer
        let speedChanger = document.createElement("select");
        speedChanger.id = "speedChanger";
        //create options for speed changer
        let speedOptions = [
            { name: "Very Slow", value: Speed.VERYSLOW },
            { name: "Slow", value: Speed.SLOW },
            { name: "Medium", value: Speed.MEDIUM },
            { name: "Fast", value: Speed.FAST },
            { name: "Very Fast", value: Speed.VERYFAST },
            { name: "Super Fast", value: Speed.SUPERFAST },
        ];
        //add options to speed changer
        speedOptions.forEach(function (option) {
            let speedOption = document.createElement("option");
            speedOption.value = option.value;
            speedOption.innerHTML = option.name;
            speedOption.title = "Speed";
            speedChanger.appendChild(speedOption);
        });
        //get header bar
        let headerBar = document.getElementById("header");
        //add elements to header bar
        headerBar.appendChild(startStop);
        headerBar.appendChild(speedChanger);
    },
    //updates the header bar with the action listeners for start/stop, speed changer, and mode changer
    updateHeaderListeners: function () {

        //get start/stop button
        let startStop = document.getElementById("startStop");
        //get speed changer
        let speedChanger = document.getElementById("speedChanger");
        //get mode changer
        let modeChanger = document.getElementById("modeChanger");

        //remove start/stop button action listener if it exists
        if (startStop.onclick != null) {
            startStop.removeEventListener("click", toggleScheduler);
        }
        //remove speed changer action listener if it exists
        if (speedChanger.onchange != null) {
            speedChanger.removeEventListener("change", scheduler.changeSpeed);
        }

        //add action listener to start/stop button
        startStop.addEventListener("click", toggleScheduler);
        //add action listener to speed changer
        speedChanger.addEventListener("change", scheduler.changeSpeed);
    }

};