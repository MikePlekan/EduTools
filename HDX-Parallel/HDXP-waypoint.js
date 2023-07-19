// Description: This file contains the Waypoint object and its methods
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
function Waypoint(label, lat, lon, owner = 0, threads = new Array(numThreads)) {
    this.label = label;
    this.lat = lat;
    this.lon = lon;
    this.owner = owner;
    this.threads = threads;
    this.edgeList = new Array();
}
//function in waypoint prototype functions so they can be called by the object itself without passing the object
Waypoint.prototype.addPopupListener = function (thread) {
    let lat = this.lat;
    let lon = this.lon;
    let owner = this.owner;
    let threads = this.threads;
    threads[thread].marker.on("click", function (e) {
        var popup = L.popup()
            .setLatLng([lat, lon])
            .setContent(
                "<table><tr><th>Waypoint</th><td>" + lat + ", " + lon + "</td></tr><tr>" +
                "<th>Owner</th><td>" + owner + "</td></tr><tr>" +
                "<th>Thread</th><td>" + thread + "</td></tr></table>"
            );
        popup.on("close", function () {
            threads[thread].marker.closePopup();
            threads[thread].marker.unbindPopup();
        });
        threads[thread].marker.bindPopup(popup);
        threads[thread].marker.openPopup();
    }
    );

}

Waypoint.prototype.clearThreads = function () {
    for (let i = 0; i < this.threads.length; i++) {
        if (this.threads[i] != null && this.threads[i].marker != null) {
            this.threads[i].marker.removeFrom(g_maps[this.threads[i].onMap].waypointGroup);
        }
    }
    this.threads = new Array(numThreads);
}

Waypoint.prototype.editThread = function (id, vs, addTo = false) {
    if (this.threads[id] == null) {
        this.threads[id] = {
            vs: vs,
            changed: true,
        };
    }
    else {
        this.threads[id].vs = addTo ? { ...this.threads[id].vs, ...vs } : vs;
        this.threads[id].changed = true;
    }
    
}
//function to update the size of the threads array
Waypoint.prototype.resizeThreads = function () {
    //check to see if the threads.length is equal to the number of threads
    //if not, then correct it
    if (this.threads.length != numThreads) {
        //if the threads.length is less than the number of threads, add threads
        if (this.threads.length < numThreads) {
            this.threads.concat(new Array(numThreads - this.threads.length));
        }
        //if the threads.length is greater than the number of threads, remove threads
        else {
            this.threads.splice(numThreads, this.threads.length - numThreads);
        }
    }
}
Waypoint.prototype.updateThread = function (mapId, thread) {
    if (this.threads[thread] != null && this.threads[thread].changed) {
        
        if (this.threads[thread].marker != null) {
            this.threads[thread].marker.setStyle(this.threads[thread].vs);
        }
        else {
            this.threads[thread].marker = L.circleMarker(
                [this.lat, this.lon],
                this.threads[thread].vs
            ).addTo(g_maps[mapId].waypointGroup);
            this.threads[thread].onMap = mapId;
            this.addPopupListener(thread);
        }
        this.threads[thread].changed = false;
        return true;
    }
    return false;
}


Waypoint.prototype.removeThread = function (threadId) {
    if (this.threads[threadId] != null && this.threads[threadId].marker != null) {
        this.threads[threadId].marker.removeFrom(g_maps[this.threads[threadId].onMap].waypointGroup);
        this.threads[threadId] = null;
    }
}
