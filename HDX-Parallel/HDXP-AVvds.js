// Description: This file contains the AV for the Vertex Degree Search algorithm
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
AvList.push({
    name: "Vertex Degree Search", func: function () {
        let start = {
            action: function (currentThread) {
                //draw all the edges which has at least one endpoint in the current thread
                for (let i = 0; i < edges.length; i++) {
                    if (edges[i].v1.owner == currentThread.id || edges[i].v2.owner == currentThread.id) {
                        edges[i].editThread(currentThread.id, { color: "black", weight: 3 });
                        //draw waypoints connected to the edge if they are not already drawn
                        //if waypoints are owned by the current thread, color them black and radius 5, else color them grey and radius 3
                        if (edges[i].v1.threads[currentThread.id] == null) {
                            edges[i].v1.editThread(currentThread.id, edges[i].v1.owner == currentThread.id ? { color: "black", radius: 5 } : { color: "grey", radius: 3 });
                        }
                        if (edges[i].v2.threads[currentThread.id] == null) {
                            edges[i].v2.editThread(currentThread.id, edges[i].v2.owner == currentThread.id ? { color: "black", radius: 5 } : { color: "grey", radius: 3 });
                        }
                    }
                }
                //draw the rest of the waypoints which are not connected to any edge that are owned by the current thread
                for (let i = 0; i < g_waypoints.length; i++) {
                    if (g_waypoints[i].owner == currentThread.id && g_waypoints[i].threads[currentThread.id] == null) {
                        g_waypoints[i].editThread(currentThread.id, { color: "black", radius: 5 });
                    }
                }
                currentThread.currentPoint = Partitions.getNextPoint(currentThread.id);
                //set max and min to the first point
                currentThread.maxDegree = currentThread.currentPoint;
                currentThread.minDegree = currentThread.currentPoint;
                currentThread.ctrlPanel.addInfoPanel("<span>Max Degree: " + currentThread.maxDegree.label +
                    "</span>", "max", { color: "black", backgroundColor: "red" });
                currentThread.ctrlPanel.addInfoPanel("<span>Min Degree: " + currentThread.minDegree.label +
                    "</span>", "min", { color: "black", backgroundColor: "yellow" });
                //return the next event
                return CalcLoop;
            },
            cost: 0,
            pseudoCode: "start",
            order: 0
        };
        let CalcLoop = {
            action: function (currentThread) {
                return Partitions.hasNextPoint(currentThread.id) ? CalcDegree : done;
            },
            cost: 2,
            pseudoCode: "for each waypoint in the thread{",
            order: 1,
        };
        let CalcDegree = {
            action: function (currentThread) {
                //get the next point
                currentThread.currentPoint = Partitions.getNextPoint(currentThread.id);
                //change the opacity and fill opacity of the current point to 1
                currentThread.currentPoint.editThread(currentThread.id, { opacity: 1, fillOpacity: 1 }, true);
                //highlight all edges connected to the current point
                for (let i = 0; i < currentThread.currentPoint.edgeList.length; i++) {
                    currentThread.currentPoint.edgeList[i].editThread(currentThread.id, { color: "cyan", weight: 5 });
                }
                //change color of min and max to black
                currentThread.maxDegree.editThread(currentThread.id, { color: "black" }, true);
                currentThread.minDegree.editThread(currentThread.id, { color: "black" }, true);
                //check the degree of the current point
                if (currentThread.currentPoint.edgeList.length > currentThread.maxDegree.edgeList.length) {
                    currentThread.maxDegree = currentThread.currentPoint;
                }
                if (currentThread.currentPoint.edgeList.length < currentThread.minDegree.edgeList.length) {
                    currentThread.minDegree = currentThread.currentPoint;
                }
                //change the color of the min and max to red
                currentThread.maxDegree.editThread(currentThread.id, { color: "red" }, true);
                currentThread.minDegree.editThread(currentThread.id, { color: "yellow" }, true);

                currentThread.ctrlPanel.editInfoPanel("<span>Max Degree: " + currentThread.maxDegree.label +
                    "</span>", "max");
                currentThread.ctrlPanel.editInfoPanel("<span>Min Degree: " + currentThread.minDegree.label +
                    "</span>", "min");
                //return the next event
                return IncrementLoopIndex;
            },
            cost: 0,
            pseudoCode: "CalcDegree",
            order: 2
        };
        let IncrementLoopIndex = {
            action: function (currentThread) {
                //return the current point to original opacity
                currentThread.currentPoint.editThread(currentThread.id, { opacity: 1, fillOpacity: 0.2 }, true);
                //unhighlight all edges connected to the current point
                for (let i = 0; i < currentThread.currentPoint.edgeList.length; i++) {
                    currentThread.currentPoint.edgeList[i].editThread(currentThread.id, { color: "black", weight: 3 });
                }
                //return the next event
                return CalcLoop;
            },
            cost: 0,
            pseudoCode: "}",
            order: 3
        };
        let done = {
            action: function (currentThread) {
                //add results to the buffer
                if (Buffer == null) {
                    Buffer = [];
                }
                Buffer[currentThread.id] = {
                    maxDegree: currentThread.maxDegree,
                    minDegree: currentThread.minDegree
                };
                //set thread to done
                currentThread.done = true;
            },
            cost: 0,
            pseudoCode: "done",
            order: 4
        };
        return {
            RunMode: "MULTIPLE",
            Actions: {
                start: start,
                CalcLoop: CalcLoop,
                CalcDegree: CalcDegree,
                IncrementLoopIndex: IncrementLoopIndex,
                done: done
            },
            //Next phase of the algorithm which combine the results of the threads
            NextPhase: () => {
                let start = {
                    action: function (currentThread) {
                        //draw all edges and waypoints
                        for (let i = 0; i < edges.length; i++) {
                            edges[i].editThread(currentThread.id, { color: "black", weight: 3 });
                        }
                        for (let i = 0; i < g_waypoints.length; i++) {
                            g_waypoints[i].editThread(currentThread.id, { color: "black", radius: 5 });
                        }
                        //return the next event
                        return FindmaxDegree;
                    },
                    cost: 0,
                    pseudoCode: "start",
                    order: 0
                };
                let FindmaxDegree = {
                    action: function (currentThread) {
                        //highlight the all of the max degree waypoints
                        for (let i = 0; i < Buffer.length; i++) {
                            Buffer[i].maxDegree.editThread(currentThread.id, { color: "red" }, true);
                        }
                        //find the max degree waypoint out of the max degree waypoints
                        currentThread.maxDegree = Buffer[0].maxDegree;
                        for (let i = 1; i < Buffer.length; i++) {
                            if (Buffer[i].maxDegree.edgeList.length > currentThread.maxDegree.edgeList.length) {
                                currentThread.maxDegree = Buffer[i].maxDegree;
                            }
                        }currentThread.ctrlPanel.addInfoPanel("<span>Max Degree: " + currentThread.maxDegree.label +
                        "</span>", "max", { color: "black", backgroundColor: "red" });
                    
                        //return the next event
                        return FindminDegree;
                    },
                    cost: 0,
                    pseudoCode: "FindmaxDegree",
                    order: 1
                };
                let FindminDegree = {
                    action: function (currentThread) {
                        //unhighlight the max degree waypoints
                        for (let i = 0; i < Buffer.length; i++) {
                            Buffer[i].maxDegree.editThread(currentThread.id, { color: "black" }, true);
                        }
                        //highlight the all of the min degree waypoints
                        for (let i = 0; i < Buffer.length; i++) {
                            Buffer[i].minDegree.editThread(currentThread.id, { color: "yellow" }, true);
                        }
                        //find the min degree waypoint out of the min degree waypoints
                        currentThread.minDegree = Buffer[0].minDegree;
                        for (let i = 1; i < Buffer.length; i++) {
                            if (Buffer[i].minDegree.edgeList.length < currentThread.minDegree.edgeList.length) {
                                currentThread.minDegree = Buffer[i].minDegree;
                            }
                        }
                        currentThread.ctrlPanel.addInfoPanel("<span>Min Degree: " + currentThread.minDegree.label +
                        "</span>", "min", { color: "black", backgroundColor: "yellow" });
                        //return the next event
                        return done;
                    },
                    cost: 0,
                    pseudoCode: "FindminDegree",
                    order: 2
                };
                let done = {
                    action: function (currentThread) {
                        //unhighlight the min degree waypoints
                        for (let i = 0; i < Buffer.length; i++) {
                            Buffer[i].minDegree.editThread(currentThread.id, { color: "black" }, true);
                        }
                        //highlight the max and min degree waypoints
                        currentThread.maxDegree.editThread(currentThread.id, { color: "red" }, true);
                        currentThread.minDegree.editThread(currentThread.id, { color: "yellow" }, true);
                        //set thread to done
                        currentThread.done = true;
                    },
                    cost: 0,
                    pseudoCode: "done",
                    order: 3
                };
                return {
                    RunMode: "SINGLE",
                    Actions: {
                        start: start,
                        FindmaxDegree: FindmaxDegree,
                        FindminDegree: FindminDegree,
                        done: done
                    },
                    NextPhase: null
                };

            }
        };
    }
});