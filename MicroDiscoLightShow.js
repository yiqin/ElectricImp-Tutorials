// create a global variabled called led and assign pin9 to it
led <- hardware.pin9;
photocell <- hardware.pin2;
 
// configure led to be a digital output
led.configure(DIGITAL_OUT);
photocell.configure(ANALOG_IN);

// create a global variable to store current state of the LED
state <- 0;
 
function blink() {
  // invert the value of state:
  // when state = 1, 1-1 = 0
  // when state = 0, 1-0 = 1
  state = 1-state;  
 
  // write current state to led pin
  led.write(state);
 
  // schedule imp to wakeup in .5 seconds and do it again. 
  imp.wakeup(0.5, blink);
}
 
// start the loop
blink();
// led.write(1);

function poll() {
	local temp = photocell.read()
	server.log(temp)
	imp.wakeup(0.10, poll)
}
 
// Call the function to make an inital poll
poll()