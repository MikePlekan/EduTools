// Description: This file contains the main script for the Site
// Author: Michael Plekan
// Consulted with: Dr. James Teresco

//Function that does the initial setup for an AV to run
function setupAV(PhaseChange = false) {
  pageBuilder.addAvControls();
  if (PhaseChange) {
    AV = AV.NextPhase();
  }
  //check if the AV is single or multi threaded
  if (AV.RunMode == "SINGLE") {
    //set the number of threads to 1
    setNumThreads(1);
  }
  //clear ctrl panels of each thread if they exist
  for (let i = 0; i < Threads.length; i++) {
    Threads[i].ctrlPanel.deletePanel();
  }
  //clear the threads list
  Threads = [];
  //create the new threads
  for (let i = 0; i < numThreads; i++) {
    Threads.push(new Thread(i, AV.Actions.start));
  }
  //clear all the threads
  clearAll();
  //update the maps to match the new number of threads
  mapSelector();
  //set the partition mode
  if (AV.RunMode == "SINGLE") {
    Partitions = PartitionModes.SINGLE();
  }
  
  if (AV.prep != null) {
    AV.prep();
  }

  //for each map, fit the bounds of the map to the waypoints
  for (let i = 0; i < g_maps.length; i++) {
    g_maps[i].fitBounds();
  }
  
  //add pseudo code to divs
  for (let i = 0; i < Threads.length; i++) {
    Threads[i].ctrlPanel.addpseudoCode();
  }
  //update the header bar
  pageBuilder.updateHeaderListeners();
}


pageBuilder.MapSelection(document.body);
//build the header bar
pageBuilder.buildHeaderBar();