// Log the URLs we need
server.log("Open " + http.agenturl() + " to see the light state.");

global_ledState <- 0

// register the HTTP handler
http.onrequest(function(request, response) {
  try {
      if(global_ledState == 0){
          response.send(200, "The light is off.")
      }
      else if(global_ledState == 1){
          response.send(200, "The light is on.")
      }
      else {
          response.send(200, "Don't find the light.")
      }
    
  }
  catch(error) {
    response.send(500, error)
  }
})

function getLedState(ledState) {
    // server.log("Led state: "+ledState);
    global_ledState = ledState;
}
 
// When we get a 'ledState' message from the device, call start_time()
device.on("ledState", getLedState); 