// Description: This file contains the Global variables for the Site and some Global functions
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
"use strict";
let L = window.L;
var g_maps = [];
// Global variable to store the list of waypoints
var g_waypoints = [];
// Global variable to store the list of edges
var edges = [];
// Global variable to store the list of threads
var Threads = [];
// Global variable to store the number of threads
var numThreads = 1;
// Global variable to store the partition mode
var Partitions = null;

// Global variable to hold the current AV
var AV = null;

// Global variable to store the current mode of scheduling
var scheduler = null;

// Global variable to act as a buffer for AVs switching phases(up to AV to decide how to use it)
var Buffer = null;
// Global variable to store any mutexes that are in use
var mutexes = [];
//enum for different speed options
var Speed = {
  VERYSLOW: 5000,
  SLOW: 3000,
  MEDIUM: 1000,
  FAST: 750,
  VERYFAST: 500,
  SUPERFAST: 250,
};
//holds the list of AVs
var AvList = [];
//setter function for numThreads variable so wayponts and edges can be resized at the same time
function setNumThreads(num) {
  if (numThreads != num) {
    numThreads = Number(num);
    g_waypoints.forEach((waypoint) => waypoint.resizeThreads());
    edges.forEach((edge) => edge.resizeThreads());
  }
}


//varadic function the calculates the distance between two points
//if 4 parameters are given, the points are given as latitudes and longitudes
//if 2 parameters are given, the points are given as Waypoint objects
//if 1 parameter is given, the points are along the line of an Edge object

function distance() {
  //function that converts degrees to radians
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  //make a hidden function that calculates the distance between two points given as latitudes and longitudes
  function distanceLL(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  }
  //if 4 parameters are given, the points are given as latitudes and longitudes
  if (arguments.length == 4) {
    return distanceLL(arguments[0], arguments[1], arguments[2], arguments[3]);
  }
  //if 2 parameters are given, the points are given as Waypoint objects
  else if (arguments.length == 2) {
    return distanceLL(arguments[0].lat, arguments[0].lon, arguments[1].lat, arguments[1].lon);
  }
  //if 1 parameter is given, the points are along the line of an Edge object
  else if (arguments.length == 1) {
    let distance = 0;
    for (let i = 0; i < arguments[0].length - 1; i++) {
      distance += distanceLL(
        arguments[0][i][0],
        arguments[0][i][1],
        arguments[0][i + 1][0],
        arguments[0][i + 1][1]);
    }
    return distance;
  }
  //if any other number of parameters are given, send an error
  else {
    console.error("Invalid number of arguments for distance function");
  }
}

//function that clears all threads of all waypoints and edges
function clearAll() {
  for (let i = 0; i < g_waypoints.length; i++) {
    g_waypoints[i].clearThreads();
  }
  for (let i = 0; i < edges.length; i++) {
    edges[i].clearThreads();
  }
}