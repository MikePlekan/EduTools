// Description: This file contains the code for the mutex object and its functions
//Author: Michael Plekan
//Consulted with: Dr. James Teresco
function Mutex(id,owner=null){
    this.id = id;//the id of the mutex
    this.owner = owner;//holds the id of the thread that owns the mutex
    //if owner is null, then the mutex is unlocked
    this.locked = owner != null;//whether the mutex is locked or not
    this.waitingThreads = [];//holds id of threads waiting for the mutex
}
//function to lock the mutex
Mutex.prototype.lock = function(owner){
    //if the mutex is locked, return false
    if(this.locked){
        //set the thread to waiting
        Threads[owner].waiting = true;
        return false;
    }
    //otherwise, lock the mutex and return true
    else{
        this.locked = true;
        this.owner = owner;
        return true;
    }
}
//function to unlock the mutex
Mutex.prototype.unlock = function(owner){
    //if the mutex is locked, check to see if the owner is the same as the owner passed in
    if(this.locked){
        if(this.owner == owner){
            this.locked = false;
            this.owner = null;
            return true;
        }
        else{
            return false;
        }
    }
    //if the mutex is not locked, return false
    else{
        return false;
    }
}