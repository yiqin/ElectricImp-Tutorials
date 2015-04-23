server.log("Hello from the device!")

// create a global variabled called led, 
// and assign pin9 to it
led <- hardware.pin9;

photocell <- hardware.pin2;

// configure led to be a digital output
led.configure(DIGITAL_OUT);

photocell.configure(ANALOG_IN);
 

const LIGHT_VALUE = 40000.0


// function to turn LED on or off
function setLed(ledState) {
  led.write(ledState);
}

function poll() {
	local temp = photocell.read()
	server.log(temp)
	if (temp < LIGHT_VALUE){
	    setLed(0);
	}
	else {
	    setLed(1);
	}
	imp.wakeup(0.50, poll)
}
 
// Call the function to make an inital poll
poll()
