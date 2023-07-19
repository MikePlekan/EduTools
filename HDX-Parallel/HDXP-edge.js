// Description: This file contains the Edge object and its methods
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
function Edge(label, v1, v2, line, threads = new Array(numThreads)) {
    this.label = label;
    this.threads = threads;
    this.v1 = v1;
    this.v2 = v2;
    this.line = line;
    this.length= distance(line);
}
// Make the functions in edge prototype functions so they can be called by the object itself without passing the object
Edge.prototype.editThread = function (id, vs, addTo = false) {
    if (this.threads[id] == null) {
        this.threads[id] = {
            vs: vs,
            changed: true,
        };
    }
    else if (addTo) {
        //adds the new vs to the old vs
        this.threads[id].vs = { ...this.threads[id].vs, ...vs };
        this.threads[id].changed = true;
    }
    else {
        this.threads[id].vs = vs;
        this.threads[id].changed = true;
    }
}
Edge.prototype.addPopupListener = function (threadId) {
    let edge = this;
    edge.threads[threadId].polyline.on("click", function (e) {
        var popup = L.popup()
            .setLatLng([edge.v1.lat, edge.v1.lon])
            .setContent(
                "<table><tr><th>Edge</th><td>" + edge.label + "</td></tr><tr>"+
                "<th>Length</th><td>" + edge.length + "</td></tr><tr>"+
                "<th>Thread</th><td>" + threadId + "</td></tr></table>"
            );
        popup.on("close", function () {
            edge.threads[threadId].polyline.closePopup();
            edge.threads[threadId].polyline.unbindPopup();
        });
        edge.threads[threadId].polyline.bindPopup(popup);
        edge.threads[threadId].polyline.openPopup();
    }
    );
}
Edge.prototype.clearThreads = function () {
    for (let i = 0; i < this.threads.length; i++) {
        if (this.threads[i] != null && this.threads[i].polyline != null) {
            this.threads[i].polyline.removeFrom(g_maps[this.threads[i].onMap].edgeGroup);
        }
    }
    this.threads = new Array(numThreads);
}
//function that resizes the threads array
Edge.prototype.resizeThreads = function () {
    //check to see if the threads.length is equal to the number of threads
    //if not, then correct it
    if (this.threads.length != numThreads) {
        //if the threads.length is less than the number of threads, add threads
        if (this.threads.length < numThreads) {
            this.threads.concat(new Array(numThreads - this.threads.length));
        }
        //if the threads.length is greater than the number of threads, remove threads from the end
        else {
            this.threads.splice(numThreads, this.threads.length - numThreads);
        }
    }
}

Edge.prototype.updateThread = function (mapId, threadId) {
    if (this.threads[threadId] != null && this.threads[threadId].changed) {
        if (this.threads[threadId].polyline != null) {
            this.threads[threadId].polyline.setStyle(this.threads[threadId].vs);
        }
        else {
            this.threads[threadId].polyline = L.polyline(
            this.line,
            this.threads[threadId].vs
        ).addTo(g_maps[mapId].edgeGroup);
            this.threads[threadId].onMap = mapId;
            this.addPopupListener(threadId);
        }
        this.threads[threadId].changed = false;
        return true;
    }
    return false;
}
/*

*/
Edge.prototype.removeThread = function (threadId) {
    if (this.threads[threadId] != null && this.threads[threadId].polyline != null) {
        this.threads[threadId].polyline.removeFrom(g_maps[this.threads[threadId].onMap].edgeGroup);
        this.threads[threadId]=null;
    }
}