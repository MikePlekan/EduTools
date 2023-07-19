// Description: This file contains the HDXMap object and its functions
// for controlling the leaflet map
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
function HDXMap(divId, id, tile, zoom = 14, lat = 42.71945, lon = -73.752063){
  //set up variables
  this.id = Number(id);
  this.zoom = zoom;
  this.lat = lat;
  this.lon = lon;
  this.tile = tile;
  this.DispThreads = [id];
  this.speed = Speed.SUPERFAST;
  this.timeouts = [];

  //create map container
  this.mapContainer = document.createElement("div");
  this.mapContainer.id = "map" + id;
  this.mapContainer.classList.add("map");
  document.getElementById(divId).appendChild(this.mapContainer);

  //create map
  this.map = L.map(this.mapContainer.id);
  this.map.setView([this.lat, this.lon], this.zoom);
  //add Waypoint layer
  this.waypointGroup = L.layerGroup();
  this.waypointGroup.addTo(this.map);
  //add Edge layer
  this.edgeGroup = L.layerGroup();
  this.edgeGroup.addTo(this.map);

  //create tile layer
  this.tileLayer = L.tileLayer(this.tile);
  this.tileLayer.addTo(this.map);
  
  //resize map on window resize
  window.addEventListener("resize", function () {
    this.map.invalidateSize();
  }.bind(this));
}

//add functions to prototype
//update tile layer
HDXMap.prototype.updateView = function () {
  this.map.setView([this.lat, this.lon], this.zoom);
}
//fit bounds of map to waypoints
HDXMap.prototype.fitBounds = function () {
  //get bounds of waypoints
  let minLat = 90;
  let maxLat = -90;
  let minLon = 180;
  let maxLon = -180;
  for (let i = 0; i < g_waypoints.length; i++) {
    minLat = minLat > g_waypoints[i].lat ? g_waypoints[i].lat : minLat;
    maxLat = maxLat < g_waypoints[i].lat ? g_waypoints[i].lat : maxLat;
    minLon = minLon > g_waypoints[i].lon ? g_waypoints[i].lon : minLon;
    maxLon = maxLon < g_waypoints[i].lon ? g_waypoints[i].lon : maxLon;
  }
  //fit bounds to waypoints
  let bounds=L.latLngBounds(L.latLng(minLat, minLon), L.latLng(maxLat, maxLon));
  this.map.fitBounds(bounds);

}

//update markers on map
HDXMap.prototype.updateMarkers = function () {
  let map = this;
 // Draw new markers
 g_waypoints.forEach(function (waypoint) {
  map.DispThreads.forEach(function (threadId) {
    waypoint.updateThread(map.id, threadId);
  });
});
}
//update edges on map
HDXMap.prototype.updateEdges = function () {
  let map = this;
  // Draw new edges
  edges.forEach(function (edge) {
    map.DispThreads.forEach(function (threadId) {
      edge.updateThread(map.id, threadId);
    });
  });
}
//start updates on map by setting timeout to update markers and edges
HDXMap.prototype.startUpdates = function () {
  let map = this;
  //remove pause class from map if it exists
  this.mapContainer.classList.remove("paused");
  // Set timeout to generate and draw waypoints repeatedly
  this.timeouts.push(
    setTimeout(function generate() {
      map.updateMarkers();
      map.updateEdges();
      map.timeouts.push(setTimeout(generate, map.speed));
    }
    .bind(this), map.speed)
  );
}
//clear timeouts to stop updates
//also add css pause class to map
HDXMap.prototype.stopUpdates = function () {
  this.mapContainer.classList.add("paused");
  this.timeouts.forEach(function (timeout) {
    clearTimeout(timeout);
  });
  this.timeouts = [];
}
HDXMap.prototype.updateTile = function () {
  this.tileLayer.setUrl(this.tile);
}

//NOTE: These Functions are not a part of the HDXMap object
function buildMaps(num) {
  //stop updates on all existing maps
  g_maps.forEach((map) => map.stopUpdates());
  if (g_maps.length > num) {
    for (let x = g_maps.length; x > num; x--) {
      //remove all layers from layer groups
      g_maps[x - 1].waypointGroup.clearLayers();
      g_maps[x - 1].edgeGroup.clearLayers();
      //remove map from map container
      let mapContainer = g_maps[x - 1].mapContainer;
      g_maps.pop();
      mapContainer.remove();
    }
  } else {
    for (let x = g_maps.length; x < num; x++) {
      g_maps.push(
        new HDXMap(
          "main-content",
          x,
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          0
        )
      );
      g_maps[x].updateView();
      g_maps[x].updateTile();
    }
  }
  //start updates on all maps
  g_maps.forEach((map) => map.startUpdates());
}

function mapSelector() {
  let val = numThreads;
  let main = document.getElementById("main-content");
  buildMaps(val);
  val % 2 == 0
    ? main.classList.replace("odd", "even")
    : main.classList.replace("even", "odd");
  //resize maps
  g_maps.forEach((map) => map.map.invalidateSize());
}