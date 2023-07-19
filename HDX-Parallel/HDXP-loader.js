// Description: This file contains the Functions for loading the graphs
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
const Loader = {
    //File Format
    //TMG 3.0 (or whatever version) (optional Type)
    //Number of Waypoints Number of Edges (optional Number of Threads)
    //Waypoint Label Latitude Longitude (optional Thread)
    //...
    //Edge Waypoint1 id Waypoint2 id label list of waypoints in between
    //...
    ParseTMG: function (file) {
        //open file and read contents
        let lines = file.split('\n');
        //parse file
        let version = lines[0].split(" ")[1];
        let type = lines[0].split(" ")[2];
        //get number of waypoints and edges, convert to numbers
        let numWaypoints = Number(lines[1].split(" ")[0]);
        let numEdges = Number(lines[1].split(" ")[1]);
        //set to 1 if not specified
        setNumThreads(lines[1].split(" ")[2] != null ? lines[1].split(" ")[2] : 1);
        //create waypoints
        for (let i = 2; i < numWaypoints + 2; i++) {
            let line = lines[i].split(" ");
            //check if thread is specified
            let waypoint = line.length == 4 ? new Waypoint(line[0], line[1], line[2], line[3]) : new Waypoint(line[0], line[1], line[2], 0);
            g_waypoints.push(waypoint);
        }

        //create edges
        for (let i = numWaypoints + 2; i < numWaypoints + numEdges + 2; i++) {
            let fileLine = lines[i].split(" ");
            let waypoint1 = g_waypoints[fileLine[0]];
            let waypoint2 = g_waypoints[fileLine[1]];
            //get list of waypoints in between, adds the start and end waypoints
            let line = [[waypoint1.lat, waypoint1.lon]];
            for (let j = 3; j < fileLine.length; j += 2) {
                //first j is latitude, second is longitude
                line.push([fileLine[j], fileLine[j + 1]]);
            }
            line.push([waypoint2.lat, waypoint2.lon]);
            let edge = new Edge(fileLine[2], waypoint1, waypoint2, line);
            //insert edge into appropriate waypoint edge lists
            edge.v1.edgeList.push(edge);
            edge.v2.edgeList.push(edge);
            //add edge to list of edges
            edges.push(edge);
        }
        //set Partition Mode depending on the number of threads
        Partitions=numThreads==1?PartitionModes.SINGLE():PartitionModes.PREDEFINED();
        //draw graph
        Loader.drawGraph();
    },

    //get Graph List from server
    createGraphList: async function (parentElement) {

        // pass in the current graph archive set to use in the search
        //FUTURE: pass in params on the archive set to use
        const params = {
            graphSet: "current"//for now, just use the current graph set
        };
        const jsonParams = JSON.stringify(params);
        await fetch("./generateSimpleGraphList.php", {
            method: "POST",
            body: jsonParams
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            // we get back the graph names and descriptions
            const opts = data;
            const filenames = opts['filenames'];
            const descriptions = opts['descriptions'];
            //make an html datalist for the graph search box
            const datalist = document.createElement("datalist");
            datalist.id = "graphList";
            //add options to graph list using the filenames and descriptions
            for (let i = 0; i < filenames.length; i++) {
                let option = document.createElement("option");
                option.value = filenames[i];
                option.innerHTML = descriptions[i];
                datalist.appendChild(option);
            }
            //add the datalist to the parent element
            parentElement.appendChild(datalist);
        }).catch(function (error) {
            console.error(error);
        });
    },
    //get a graph from the server but use the Fetch API
    getGraph: async function (graphName) {
        // set up and make the AJAX request
        const urlPath = "https://courses.teresco.org/metal/graphdata/";
        const response = await fetch(urlPath + graphName);
        //wait for the response and get the text
        const file = await response.text();
        //call the ParseTMG function
        Loader.ParseTMG(file);
    },
    //draw the graph, sets vs on thread 0 using different colors for different owners
    drawGraph: function () {
        //create a list of colors for the waypoints based on the numThreads
        let colors = [];
        for (let i = 0; i < numThreads; i++) {
            colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
        }
        g_waypoints.forEach(function (waypoint) {
            waypoint.editThread(0, { color: colors[waypoint.owner] , radius: 10, opacity: 1, fillOpacity: 0.8});
        });
        edges.forEach(function (edge) {
            edge.editThread(0, {color: "black",weight: 3 },true);
        }
        );
        //set the view to the bounds of the graph on all maps
        g_maps.forEach(function (map) {
            map.fitBounds();
        }
        );
    },

};
