// Description: This file contains the code for the scheduler object and 
//the functions for each mode of scheduling
//Author: Michael Plekan
//Consulted with: Dr. James Teresco
function Scheduler(mode, speed) {
    this.speed = speed;
    this.intervalID = null;
    this.threadIndex = 0;
    this.mode = null;
    this.setMode(mode);
}
//function to start the scheduler
Scheduler.prototype.start = function () {
    //set html to stop
    document.getElementById("startStop").innerHTML = "Stop";
    //start the scheduler
    let scheduler = this;
    this.intervalID = setInterval(function () {
        scheduler.mode();
    }, scheduler.speed);
}
//function to stop the scheduler
Scheduler.prototype.stop = function () {
    //set html to start
    document.getElementById("startStop").innerHTML = "Start";
    //stop the scheduler
    clearInterval(this.intervalID);
    this.intervalID = null;
}
//function to change the speed of the scheduler
Scheduler.prototype.changeSpeed = function (Speed) {
    //check if the input is a input event
    if (Speed.target != null) {
        //get the value of the input
        scheduler.speed = Number(Speed.target.value);
    }
    else {
        //use the string to set the speed of the scheduler
        scheduler.speed = Number(Speed);
    }
    //if the scheduler is running restart it with the new speed
    if (scheduler.intervalID != null) {
        scheduler.stop();
        scheduler.start();
    }

}
//function to change the mode of the scheduler
Scheduler.prototype.setMode = function (ModeString) {
    //use the string to set the mode of scheduling
    switch (ModeString) {
        case "RR":
            this.mode = this.RR;
            break;
        case "RANDOM":
            this.mode = this.RANDOM;
            break;
        case "SJF":
            this.mode = this.SJF;
            break;
        case "LJF":
            this.mode = this.LJF;
            break;
        default:
            this.mode = this.RR;
            break;
    }
}
//calls the next event for the current thread
Scheduler.prototype.callEvent = function (thread) {
    console.log(thread);
    //highlight next event
    thread.ctrlPanel.highlightPseudoCode(thread.nextEvent);
    //check if this action is in the breakpoints list
    //FUTURE: add a conditional check
    if (thread.breakpoints.includes(thread.nextEvent)) {
        //stop the scheduler
        stop();
    }

    //sets the next event for the thread and runs the current event
    thread.nextEvent = thread.nextEvent.action(thread);
}
//function that will check if all threads are done
Scheduler.prototype.allDone = function () {
    for (let i = 0; i < Threads.length; i++) {
        if (!Threads[i].done) {
            return false;
        }
    }
    return true;
}
//function that will return a list of active threads 
//which means all threads that are not done and are not waiting for a mutex
Scheduler.prototype.getActiveThreads = function () {
    let activeThreads = [];
    for (let i = 0; i < Threads.length; i++) {
        !Threads[i].done && !Threads[i].waiting ? activeThreads.push(i) : null;
    }
    //check if there are no active threads
    if (activeThreads.length == 0) {
        //send error and stop the scheduler
        alert("Error: No active threads");
        console.error("Error: No active threads");
        this.stop();
        return null;
    }
    console.log(activeThreads);
    return activeThreads;//return the list of active thread ids
}
//function that will start the next phase of the AV if it has one
Scheduler.prototype.startNextPhase = function () {
    //stop the scheduler
    this.stop();
    //check if AV has a next phase
    if (AV.NextPhase != null) {
        //call the setup function for the next phase
        setupAV(true);
    }
}
//functions for each mode of scheduling
// Round Robin
Scheduler.prototype.RR = function () {
    //check if all threads are done
    if (this.allDone()) {
        //stop the scheduler
        this.startNextPhase();
    }
    else {
        //get a list of active threads
        let activeThreads = this.getActiveThreads();
        //select the next thread in the list of active threads
        this.threadIndex = activeThreads[(activeThreads.indexOf(this.threadIndex) + 1) % activeThreads.length];
        
        this.callEvent(Threads[this.threadIndex]);
    }
}

//Random
Scheduler.prototype.RANDOM = function () {
    if (this.allDone()) {
        //stop the scheduler
        this.startNextPhase();
    }
    else {
        //get a list of active threads
        let activeThreads = this.getActiveThreads();
        //select a random thread from the list of active threads
        this.threadIndex = activeThreads[Math.floor(Math.random() * activeThreads.length)];
        this.callEvent(Threads[this.threadIndex]);
    }
}
    // Shortest Job First
    Scheduler.prototype.SJF = function () {
        //check if all threads are done
        if (this.allDone()) {
            //stop the scheduler
            this.startNextPhase();
        }
        //look at the cost of each thread's next event and select the thread with the lowest cost and skip over threads that are done
        let minCost = Number.MAX_SAFE_INTEGER;
        let activeThreads = this.getActiveThreads();
        this.threadIndex = activeThreads[0];
        for (let i = 0; i < activeThreads.length; i++) {
            let cost = Threads[activeThreads[i]].nextEvent.cost;
            if (cost < minCost) {
                minCost = cost;
                this.threadIndex = activeThreads[i];
            }
        }
        //sets the next event for the thread and runs the current event
        this.callEvent(Threads[this.threadIndex]);
    }
    // Longest Job First
    Scheduler.prototype.LJF = function () {
        //check if all threads are done
        if (this.allDone()) {
            this.startNextPhase();
        }
        else {
            //look at the cost of each thread's next event and select the thread with the Highest cost and skip over threads that are done
            let maxCost = Number.MIN_SAFE_INTEGER;
            let activeThreads = this.getActiveThreads();
            this.threadIndex = activeThreads[0];
            for (let i = 0; i < activeThreads.length; i++) {
                let cost = Threads[activeThreads[i]].nextEvent.cost;
                if (cost > maxCost) {
                    maxCost = cost;
                    this.threadIndex = activeThreads[i];
                }
            }
            //sets the next event for the thread and runs the current event
            this.callEvent(Threads[this.threadIndex]);
        }
    }
    //NOTE: This function in not a part of the scheduler object
    //function to toggle whether the scheduler is running or not
    function toggleScheduler() {
        //check if the scheduler is running
        if (scheduler.intervalID == null) {
            //start the scheduler
            scheduler.start();
        }
        else {
            //stop the scheduler
            scheduler.stop();
        }
    }