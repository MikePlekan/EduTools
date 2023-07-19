// Description: This file contains the code for the different partition modes and their functions
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
const PartitionModes = {
    SINGLE: function () {
      //returns an object which holds a list of waypoints for each thread based on the single partition
      let ThreadPoints = [];
      ThreadPoints.push([]);
      //add the waypoints to the array
      for (let i = 0; i < g_waypoints.length; i++) {
        //set owner property of waypoint to the thread that will own it
        g_waypoints[i].owner = 0;
        ThreadPoints[0].push(i);
      }
      return {
        waypoints: ThreadPoints,
        getNextPoint: function (threadIndex) {
          //get the next waypoint for the thread
          return ThreadPoints[0].length > 0 ? g_waypoints[ThreadPoints[0].pop()] : null;
        },
        //function that returns whether there are more waypoints for the thread
        hasNextPoint: function (threadIndex) {
          return ThreadPoints[0].length > 0;
        },
      };
    },
    PREDEFINED: function () {
      //returns an object which holds a list of waypoints for each thread based on the predefined partitions
      let ThreadPoints = new Array(numThreads);
      //initialize the arrays
      for (let i = 0; i < numThreads; i++) {
        ThreadPoints[i] = [];
      }
      //add the waypoints to the arrays
      for (let i = 0; i < g_waypoints.length; i++) {
        ThreadPoints[g_waypoints[i].owner].push(i);
      }
      return {
        waypoints: ThreadPoints,
        getNextPoint: function (threadIndex) {
          //get the next waypoint for the thread
          return ThreadPoints[threadIndex].length > 0 ? g_waypoints[ThreadPoints[threadIndex].pop()] : null;
        },
        //function that returns whether there are more waypoints for the thread
        hasNextPoint: function (threadIndex) {
          return ThreadPoints[threadIndex].length > 0;
        },
      };
    },
    INTERLEAVED: function () {
      //returns an object which holds a list of waypoints for each thread based on the interleaved partitions
      let ThreadPoints = new Array(numThreads);
      //initialize the arrays
      for (let i = 0; i < numThreads; i++) {
        ThreadPoints[i] = [];
      }
      //add the waypoints to the arrays
      for (let i = 0; i < g_waypoints.length; i++) {
        //set owner property of waypoint to the thread that will own it
        g_waypoints[i].owner = i % numThreads;
        ThreadPoints[i % numThreads].push(i);
      }
      return {
        waypoints: ThreadPoints,
        getNextPoint: function (threadIndex) {
          //get the next waypoint for the thread
          return ThreadPoints[threadIndex].length > 0 ? g_waypoints[ThreadPoints[threadIndex].pop()] : null;
        },
        //function that returns whether there are more waypoints for the thread
        hasNextPoint: function (threadIndex) {
          return ThreadPoints[threadIndex].length > 0;
        },
      };
    },
    BLOCKED: function () {
      //returns an object which holds a list of waypoints for each thread based on the blocked partitions
      let ThreadPoints = new Array(numThreads);
      //initialize the arrays
      for (let i = 0; i < numThreads; i++) {
        ThreadPoints[i] = new Array(0);
      }
      //add the waypoints to the arrays in blocks of waypoints.length/numThreads waypoints and account for the remainder
      for (let i = 0; i < g_waypoints.length; i++) {
        //set owner property of waypoint to the thread that will own it
        g_waypoints[i].owner = Math.floor(i / (g_waypoints.length / numThreads));
        ThreadPoints[Math.floor(i / (g_waypoints.length / numThreads))].push(i);
      }
  
      return {
        waypoints: ThreadPoints,
        getNextPoint: function (threadIndex) {
          //get the next waypoint for the thread
          return ThreadPoints.length > 0 ? g_waypoints[ThreadPoints[threadIndex].pop()] : null;
        },
        //function that returns whether there are more waypoints for the thread
        hasNextPoint: function (threadIndex) {
          return ThreadPoints[threadIndex].length > 0;
        },
      };
    },
    BAG_OF_TASKS: function () {
      //returns an object which holds a list of waypoints and lets threads take waypoints from the bag of tasks until the bag is empty
      let ThreadPoints = [];
      //add the waypoints to the arrays
      for (let i = 0; i < g_waypoints.length; i++) {
        ThreadPoints.push(i);
      }
      return {
        getNextPoint: function (threadIndex) {
          //get the next waypoint for the thread
          return ThreadPoints.length > 0 ? g_waypoints[ThreadPoints.pop()] : null;
        },
        //function that returns whether there are more waypoints for the thread
        hasNextPoint: function (threadIndex) {
          return ThreadPoints.length > 0;
        },
      };
    },
  };