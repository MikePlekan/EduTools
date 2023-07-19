// Description: This file contains the Aglorithm Visualization for the Vertex Extreme Search
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
AvList.push({
    name: "Vertex Extreme Search",
    func: function () {
        let prep = function () {
            //set all waypoints to black in their respective threads if not on bag of tasks
            if (Partitions.waypoints != null) {
                for (let i = 0; i < Partitions.waypoints.length; i++) {
                    for (let j = 0; j < Partitions.waypoints[i].length; j++) {
                        g_waypoints[Partitions.waypoints[i][j]].editThread(i, { color: "grey", fillColor: "grey", radius: 5 });
                    }
                }
                edges.forEach(function (edge) {
                    //check v1 and v2 to see if they are in the same thread
                    if (edge.v1.owner == edge.v2.owner) {
                        edge.editThread(edge.v1.owner, { color: "grey", weight: 1, opacity: 0.5 });
                    }
                });
            }
        }
        let start = {
            //creates min and max variables
            action: function (currentThread) {
                //set min and max to the first waypoint in the thread

                currentThread.currentWaypoint = Partitions.getNextPoint(currentThread.id);
                currentThread.minLat = currentThread.currentWaypoint;
                currentThread.minLon = currentThread.currentWaypoint;
                currentThread.maxLat = currentThread.currentWaypoint;
                currentThread.maxLon = currentThread.currentWaypoint;
                //add current extrememes to the control panel
                currentThread.ctrlPanel.addInfoPanel("<span>Min Lat: " + currentThread.minLat.lat +
                    "</span><br><span>Max Lat: " + currentThread.maxLat.lat +
                    "</span><br><span>Min Lon: " + currentThread.minLon.lon +
                    "</span><br><span>Max Lon: " + currentThread.maxLon.lon +
                    "</span>", "extremes", { color: "black", backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16) });
                return CalcLoop;
            },
            cost: 5,
            pseudoCode: "minLat=minLon=maxLat=maxLon=firstWaypoint",
            order: 0,
        };
        let CalcLoop = {
            action: function (currentThread) {
                return Partitions.hasNextPoint(currentThread.id) ? CalcExteremes : done;
            },
            cost: 2,
            pseudoCode: "for each waypoint in the thread{",
            order: 1,
        };
        let CalcExteremes = {
            action: function (currentThread) {
                //get the next waypoint
                currentThread.currentWaypoint = Partitions.getNextPoint(currentThread.id);
                //make the current waypoint solid fill
                currentThread.currentWaypoint.editThread(currentThread.id, { color: "black", fillColor: "black", opacity: 1, fillOpacity: 1, radius: 7 });
                //check if the current waypoint is the new min or max
                if (currentThread.currentWaypoint.lat <= currentThread.minLat.lat) {
                    currentThread.minLat.editThread(currentThread.id, { color: "black", fillColor: "black", radius: 5 });
                    currentThread.minLat = currentThread.currentWaypoint;
                }
                if (currentThread.currentWaypoint.lat >= currentThread.maxLat.lat) {
                    currentThread.maxLat.editThread(currentThread.id, { color: "black", fillColor: "black", radius: 5 });
                    currentThread.maxLat = currentThread.currentWaypoint;
                }
                if (currentThread.currentWaypoint.lon <= currentThread.minLon.lon) {
                    currentThread.minLon.editThread(currentThread.id, { color: "black", fillColor: "black", radius: 5 });
                    currentThread.minLon = currentThread.currentWaypoint;
                }
                if (currentThread.currentWaypoint.lon >= currentThread.maxLon.lon) {
                    currentThread.maxLon.editThread(currentThread.id, { color: "black", fillColor: "black", radius: 5 });
                    currentThread.maxLon = currentThread.currentWaypoint;
                }
                //color the min and max waypoints
                currentThread.minLat.editThread(currentThread.id, { color: "red", fillColor: "red" }, true);
                currentThread.maxLat.editThread(currentThread.id, { color: "blue", fillColor: "blue" }, true);
                currentThread.minLon.editThread(currentThread.id, { color: "green", fillColor: "green" }, true);
                currentThread.maxLon.editThread(currentThread.id, { color: "yellow", fillColor: "yellow" }, true);
                //update the info panel
                currentThread.ctrlPanel.editInfoPanel("<span>Min Lat: " + currentThread.minLat.lat +
                    "</span><br><span>Max Lat: " + currentThread.maxLat.lat +
                    "</span><br><span>Min Lon: " + currentThread.minLon.lon +
                    "</span><br><span>Max Lon: " + currentThread.maxLon.lon +
                    "</span>", "extremes");
                return IncrementLoopIndex;
            },
            cost: 1,
            pseudoCode: "    if waypoint is new min or max, mark it and unmark the old min or max",
            order: 2,
        };
        let IncrementLoopIndex = {
            action: function (currentThread) {
                //reset the opacity of the current waypoint
                currentThread.currentWaypoint.editThread(currentThread.id, { opacity: 1, fillOpacity: 0.2, radius: 5 }, true);
                return CalcLoop;
            },
            cost: 3,
            pseudoCode: "}",
            order: 3,
        };
        let done = {
            action: function (currentThread) {
                //add results to the buffer
                if (Buffer == null) {
                    Buffer = [];
                }
                Buffer[currentThread.id] = {
                    minLat: currentThread.minLat,
                    maxLat: currentThread.maxLat,
                    minLon: currentThread.minLon,
                    maxLon: currentThread.maxLon,
                };
                //remove the info panel
                currentThread.ctrlPanel.removeInfoPanel("extremes");
                //set thread to done
                currentThread.done = true;
            },
            cost: 1,
            pseudoCode: "done",
            order: 4,
        };
        return {
            prep: prep,
            //action list for the AV which holds each step of the AV's actions and the cost of each step
            Actions: {
                start: start,
                CalcLoop: CalcLoop,
                CalcExteremes: CalcExteremes,
                IncrementLoopIndex: IncrementLoopIndex,
                done: done,
            },
            RunMode: "MULTIPLE",//whether the AV is single or multi threaded
            NextPhase: () => {
                let start = {
                    action: function (currentThread) {
                        //get all of the extrememes from the buffer
                        currentThread.minLats = Buffer.map((thread) => thread.minLat);
                        currentThread.maxLats = Buffer.map((thread) => thread.maxLat);
                        currentThread.minLons = Buffer.map((thread) => thread.minLon);
                        currentThread.maxLons = Buffer.map((thread) => thread.maxLon);
                        //set the min and max to the first extrememes
                        currentThread.minLat = currentThread.minLats[0];
                        currentThread.maxLat = currentThread.maxLats[0];
                        currentThread.minLon = currentThread.minLons[0];
                        currentThread.maxLon = currentThread.maxLons[0];
                        Buffer = null;
                        return CalcMinLats;
                    },
                    cost: 1,
                    pseudoCode: "Get all of the extrememes from the buffer",
                    order: 0,
                };
                let CalcMinLats = {
                    action: function (currentThread) {
                        //make the 4 min lats solid fill and find the min of the min lats

                        currentThread.minLats.forEach((minLat) => {
                            minLat.editThread(currentThread.id, { opacity: 1, fillOpacity: 1, radius: 7 }, true);
                            currentThread.minLat = currentThread.minLat.lat < minLat.lat ? currentThread.minLat : minLat;
                        });
                        //color the min lat
                        currentThread.minLat.editThread(currentThread.id, { color: "red", fillColor: "red" }, true);
                        //add an info panel for the extrememes
                        currentThread.ctrlPanel.addInfoPanel("<span>Min Lat: " + currentThread.minLat.lat +
                            "</span>", "extremes", { color: "black", backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16) });
                        return CalcMaxLats;
                    },
                    cost: 2,
                    pseudoCode: "for each min lat, mark it and find the min of all the min lats",
                    order: 1,
                };
                let CalcMaxLats = {
                    action: function (currentThread) {
                        //make the 4 min lats normal fill and make the 4 max lats solid fill and find the max of the max lats
                        currentThread.minLats.forEach((minLat) => {
                            minLat.editThread(currentThread.id, { opacity: 1, fillOpacity: 0.2, radius: 5 }, true);
                        }
                        );
                        currentThread.maxLats.forEach((maxLat) => {
                            maxLat.editThread(currentThread.id, { opacity: 1, fillOpacity: 1, radius: 7 }, true);
                            currentThread.maxLat = currentThread.maxLat.lat > maxLat.lat ? currentThread.maxLat : maxLat;
                        }
                        );
                        //color the max lat and recolor the min lat
                        currentThread.maxLat.editThread(currentThread.id, { color: "blue", fillColor: "blue" }, true);
                        currentThread.minLat.editThread(currentThread.id, { color: "red", fillColor: "red" }, true);
                        //update the info panel
                        currentThread.ctrlPanel.editInfoPanel("<span>Min Lat: " + currentThread.minLat.lat +
                            "</span><br><span>Max Lat: " + currentThread.maxLat.lat +
                            "</span>", "extremes");
                        return CalcMinLons;
                    },
                    cost: 2,
                    pseudoCode: "for each max lat, mark it and find the max of all the max lats",
                    order: 2,
                };
                let CalcMinLons = {
                    action: function (currentThread) {
                        //make the 4 max lats normal fill and make the 4 min lons solid fill and find the min of the min lons
                        currentThread.maxLats.forEach((maxLat) => {
                            maxLat.editThread(currentThread.id, { opacity: 1, fillOpacity: 0.2, radius: 5 }, true);
                        }
                        );
                        currentThread.minLons.forEach((minLon) => {
                            minLon.editThread(currentThread.id, { opacity: 1, fillOpacity: 1, radius: 7 }, true);
                            currentThread.minLon = currentThread.minLon.lon < minLon.lon ? currentThread.minLon : minLon;
                        }
                        );
                        //color the min lon and recolor the max lat, recolor the min lat
                        currentThread.minLon.editThread(currentThread.id, { color: "green", fillColor: "green" }, true);
                        currentThread.maxLat.editThread(currentThread.id, { color: "blue", fillColor: "blue" }, true);
                        currentThread.minLat.editThread(currentThread.id, { color: "red", fillColor: "red" }, true);
                        //update the info panel
                        currentThread.ctrlPanel.editInfoPanel("<span>Min Lat: " + currentThread.minLat.lat +
                            "</span><br><span>Max Lat: " + currentThread.maxLat.lat +
                            "</span><br><span>Min Lon: " + currentThread.minLon.lon +
                            "</span>", "extremes");
                        return CalcMaxLons;
                    },
                    cost: 2,
                    pseudoCode: "for each min lon, mark it and find the min of all the min lons",
                    order: 3,
                };
                let CalcMaxLons = {
                    action: function (currentThread) {
                        //make the 4 min lons normal fill and make the 4 max lons solid fill and find the max of the max lons
                        currentThread.minLons.forEach((minLon) => {
                            minLon.editThread(currentThread.id, { opacity: 1, fillOpacity: 0.2, radius: 5 }, true);
                        }
                        );
                        currentThread.maxLons.forEach((maxLon) => {
                            maxLon.editThread(currentThread.id, { opacity: 1, fillOpacity: 1, radius: 7 }, true);
                            currentThread.maxLon = currentThread.maxLon.lon > maxLon.lon ? currentThread.maxLon : maxLon;
                        }
                        );
                        //color the max lon and recolor the min lon, recolor the max lat, recolor the min lat
                        currentThread.maxLon.editThread(currentThread.id, { color: "yellow", fillColor: "yellow" }, true);
                        currentThread.minLon.editThread(currentThread.id, { color: "green", fillColor: "green" }, true);
                        currentThread.maxLat.editThread(currentThread.id, { color: "blue", fillColor: "blue" }, true);
                        currentThread.minLat.editThread(currentThread.id, { color: "red", fillColor: "red" }, true);
                        //update the info panel
                        currentThread.ctrlPanel.editInfoPanel("<span>Min Lat: " + currentThread.minLat.lat +
                            "</span><br><span>Max Lat: " + currentThread.maxLat.lat +
                            "</span><br><span>Min Lon: " + currentThread.minLon.lon +
                            "</span><br><span>Max Lon: " + currentThread.maxLon.lon +
                            "</span>", "extremes");
                        return done;
                    },
                    cost: 2,
                    pseudoCode: "for each max lon, mark it and find the max of all the max lons",
                    order: 4,
                };
                let done = {
                    action: function (currentThread) {
                        //set thread to done
                        currentThread.done = true;
                    },
                    cost: 1,
                    pseudoCode: "done",
                    order: 5,
                };
                return {
                    //action list for the AV which holds each step of the AV's actions and the cost of each step
                    Actions: {
                        start: start,
                        CalcMinLats: CalcMinLats,
                        CalcMaxLats: CalcMaxLats,
                        CalcMinLons: CalcMinLons,
                        CalcMaxLons: CalcMaxLons,
                        done: done,
                    },
                    RunMode: "SINGLE",//whether the AV is single or multi threaded
                };

            }
        };
    }
});
