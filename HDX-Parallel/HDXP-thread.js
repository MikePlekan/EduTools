// Description: This file contains the code for the thread object and its functions
// Author: Michael Plekan
// Consulted with: Dr. James Teresco
function Thread(id,nextEvent){
  this.id=id;//the id of the thread
  this.nextEvent=nextEvent;//the next event that the thread will execute
  this.done=false;//whether the thread is done or not
  this.ctrlPanel=controlPanel(id);//the control panel for the thread
  this.breakpoints=[];//list of action references that are breakpoints
  this.waiting=false;//whether the thread is waiting for a mutex or not
}