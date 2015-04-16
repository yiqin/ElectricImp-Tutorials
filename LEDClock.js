server.log("Hello from the device!")

// create a global variabled called led, 
// and assign pin9 to it
led <- hardware.pin9;
 
// configure led to be a digital output
led.configure(DIGITAL_OUT);
 
// function to turn LED on or off
function setLed(ledState) {
  server.log("Set LED: " + ledState);
  led.write(ledState);
}

function clockTick() {
    // Update the time using imp's RTC
    local now = date()
    local nowHour = now.hour
    local nowMinute = now.min
    local nowSecond = now.sec

    if (nowSecond < nowHour) {
        blinkOn1()
        imp.wakeup(nowHour-nowSecond, clockTick)
    }
    else if (nowSecond >=nowHour && nowSecond < nowHour+2.0) {
        led.write(0) 
        imp.wakeup(nowHour+2.0-nowSecond, clockTick)
    }
    else if (nowSecond >= nowHour+2.0 && nowSecond < nowHour+2.0+nowMinute*0.4) {
        blinkOn2()
        imp.wakeup((nowHour+2.0+nowMinute*0.4)-nowSecond, clockTick)
    }
    else if(nowSecond >= nowHour+2.0+nowMinute*0.4 && nowSecond < 50.0){
        blinkOn3()
        imp.wakeup(50.0-nowSecond, clockTick)
    }
    else if(nowSecond >= 50.0) {
        led.write(0)
        imp.wakeup(60.0-nowSecond, clockTick)
    }
}
 
// 0.5
function blinkOn1() {
    local now = date()
    local nowHour = now.hour
    local nowMinute = now.min
    local nowSecond = now.sec

    if (nowSecond <= nowHour) {
        led.write(1)
        imp.wakeup(0.5, blinkOff1) 
    }
}

function blinkOff1(){
    led.write(0)
    imp.wakeup(0.5, blinkOn1) 
}

// 0.2
function blinkOn2() {
    local now = date()
    local nowHour = now.hour
    local nowMinute = now.min
    local nowSecond = now.sec

    if (nowSecond <= nowHour+2+nowMinute*0.4) {
        led.write(1)
        imp.wakeup(0.2, blinkOff2) 
    }
}

function blinkOff2(){
    led.write(0)
    imp.wakeup(0.2, blinkOn2) 
}


// 1.0
function blinkOn3() {
    local now = date()
    local nowHour = now.hour
    local nowMinute = now.min
    local nowSecond = now.sec

    if (nowSecond < 50.0) {
        led.write(1)         
        imp.wakeup(1, blinkOff3) 
    }
}

function blinkOff3(){
    led.write(0)
    imp.wakeup(1, blinkOn3) 
}


// Initial call to the blink function to begin looping
clockTick();
