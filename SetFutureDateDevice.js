// create a global variabled called led, 
// and assign pin9 to it
led <- hardware.pin9;
 
// configure led to be a digital output
led.configure(DIGITAL_OUT);
 
// function to turn LED on or off
function setLed(ledState) {
  led.write(0);
  local currentTime = time();
  local waitTime = ledState.tointeger()-currentTime
  if (waitTime >= -59){
      imp.wakeup(waitTime, turnOn);
      server.log("Please wait for "+waitTime+" to turn on the led")
  }
  else {
      server.log("The scheduled time has passed.")
  }
  
}

function turnOn() {
    led.write(1);
}
 
// register a handler for "led" messages from the agent
agent.on("led", setLed);