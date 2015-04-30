// DEVICE CODE
 
class NeoPixels {
    
    // This class uses SPI to emulate the newpixels' one-wire protocol. 
    // This requires one byte per bit to send data at 7.5 MHz via SPI. 
    // These consts define the "waveform" to represent a zero or one
    
    ZERO            = 0xC0
    ONE             = 0xF8
    BYTESPERPIXEL   = 24
    
    // when instantiated, the neopixel class will fill this array with blobs to 
    // represent the waveforms to send the numbers 0 to 255. This allows the blobs to be
    // copied in directly, instead of being built for each pixel - which makes the class faster.
    
    bits            = null
    
    // Like bits, this blob holds the waveform to send the color [0,0,0], to clear pixels faster
    
    clearblob       = blob(12)
    
    // private variables passed into the constructor
    
    spi             = null // imp SPI interface (pre-configured)
    frameSize       = null // number of pixels per frame
    frame           = null // a blob to hold the current frame
 
    // _spi - A configured spi (MSB_FIRST, 7.5MHz)
    // _frameSize - Number of Pixels per frame
    
    constructor(_spi, _frameSize) 
    {
        this.spi = _spi
        this.frameSize = _frameSize
        this.frame = blob(frameSize*BYTESPERPIXEL + 1)
        this.frame[frameSize*BYTESPERPIXEL] = 0
        
        // prepare the bits array and the clearblob blob
        
        initialize()
        clearFrame()
        writeFrame()
    }
    
    // fill the array of representative 1-wire waveforms. 
    // done by the constructor at instantiation.
    
    function initialize() 
    {
        // fill the bits array first
        
        bits = array(256);
        
        for (local i = 0; i < 256; i++) 
        {
            local valblob = blob(BYTESPERPIXEL / 3);
            valblob.writen((i & 0x80) ? ONE:ZERO,'b')
            valblob.writen((i & 0x40) ? ONE:ZERO,'b')
            valblob.writen((i & 0x20) ? ONE:ZERO,'b')
            valblob.writen((i & 0x10) ? ONE:ZERO,'b')
            valblob.writen((i & 0x08) ? ONE:ZERO,'b')
            valblob.writen((i & 0x04) ? ONE:ZERO,'b')
            valblob.writen((i & 0x02) ? ONE:ZERO,'b')
            valblob.writen((i & 0x01) ? ONE:ZERO,'b')
            bits[i] = valblob
        }
        
        // now fill the clearblob
        
        for(local j = 0 ; j < BYTESPERPIXEL ; j++) 
        {
            clearblob.writen(ZERO, 'b')
        }
        
    }
 
    // sets a pixel in the frame buffer
    // but does not write it to the pixel strip
    // color is an array of the form [r, g, b]
    
    function writePixel(p, color) 
    {
        frame.seek(p*BYTESPERPIXEL, 'b')
        
        // red and green are swapped for some reason, so swizzle them back
        
        frame.writeblob(bits[color[1]])
        frame.writeblob(bits[color[0]])
        frame.writeblob(bits[color[2]]) 
    }
    
    // Clears the frame buffer
    // but does not write it to the pixel strip
    
    function clearFrame() 
    {
        frame.seek(0)
        for (local p = 0; p < frameSize; p++) frame.writeblob(clearblob)
    }
    
    // writes the frame buffer to the pixel strip
    // ie - this function changes the pixel strip
    
    function writeFrame() 
    {
        spi.write(frame)
    }
}
 
// CONSTANTS
 
const NUMPIXELS = 12
const DELAY = 0.02
const SPICLK = 7500 // kHz
const COLORDELTA = 8
 
// GLOBALS
 
spi <- hardware.spi257
spi.configure(MSB_FIRST, SPICLK)
pixelStrip <- NeoPixels(spi, NUMPIXELS)
    
redVal <- 0
greenVal <- 0
blueVal <- 0
 
redDel <- 1
greenDel <- 1
blueDel <- 1
 
redOn <- true
greenOn <- false
blueOn <- false
 
timer <- null
pixel <- 0
pDelta <- 1
 
function glowinit(dummy)
{
    // All the pixels run through the range colors
    
    if (timer != null) imp.cancelwakeup(timer)
    
    redVal = 0
    greenVal = 0
    blueVal = 0
 
    redDel = COLORDELTA
    greenDel = COLORDELTA
    blueDel = COLORDELTA
 
    redOn = true
    greenOn = false
    blueOn = false
    
    glow()
}
 
function glow()
{
    for (local i = 0 ; i < NUMPIXELS ; i++) pixelStrip.writePixel(i, [redVal, greenVal, blueVal])
    pixelStrip.writeFrame()
    
    adjustColors()
    
    timer = imp.wakeup(DELAY, glow)
}
 
function randominit(dummy)
{
    // A random pixel glows a random color
    
    if (timer != null) imp.cancelwakeup(timer)
    random()
}
 
function random()
{
    pixelStrip.clearFrame()
    pixelStrip.writeFrame()
    
    redVal = ran(255)
    greenVal = ran(255)
    blueVal = ran(255)
    pixel = ran(NUMPIXELS)
    
    pixelStrip.writePixel(pixel, [redVal, greenVal, blueVal])
    pixelStrip.writeFrame()
    
    timer = imp.wakeup(DELAY * 2, random)
}
 
function looperinit(dummy)
{
    // The pixels run through all the colors.
    // Only one pixel is illuminated at once
    
    if (timer != null) imp.cancelwakeup(timer)
    
    redVal = 0
    greenVal = 0
    blueVal = 0
 
    redDel = COLORDELTA
    greenDel = COLORDELTA
    blueDel = COLORDELTA
 
    redOn = true
    greenOn = false
    blueOn = false
    
    pixel = 0
    pDelta = 1
    
    looper()
}
 
function looper()
{
    pixelStrip.clearFrame()
    pixelStrip.writePixel(pixel, [redVal, greenVal, blueVal])
    pixelStrip.writeFrame()
    
    pixel++
    if (pixel > 15) pixel = 0
    
    adjustColors()
    
    timer = imp.wakeup(DELAY, looper)
}
 
function larsoninit(dummy)
{
    if (timer != null) imp.cancelwakeup(timer)
    
    redVal = 0
    greenVal = 0
    blueVal = 0
 
    redDel = COLORDELTA
    greenDel = COLORDELTA
    blueDel = COLORDELTA
 
    redOn = true
    greenOn = false
    blueOn = false
    
    pixel = 0
    pDelta = 1
    
    larson()
}
 
function larson()
{
    pixelStrip.clearFrame()
    pixelStrip.writeFrame()
    
    pixel = pixel + pDelta
    
    if (pixel > 7)
    {
        pDelta = -1
        pixel = 6
    }
    
    if (pixel < 0)
    {
        pDelta = 1
        pixel = 1
    }
    
    if (redOn)
    {
        redVal = redVal + redDel
        
        if (redVal > 127)
        {
            redDel = COLORDELTA * -1
            greenOn = true
        }
        
        if (redVal < 1)
        {
            redDel = COLORDELTA
            redOn = false
        }
    }
    
    if (greenOn)
    {
        greenVal = greenVal + greenDel
        
        if (greenVal > 127)
        {
            greenDel = COLORDELTA * -1
            blueOn = true
        }
        
        if (greenVal < 1)
        {
            greenDel = COLORDELTA
            greenOn = false
        }
    }
    
    if (blueOn)
    {
        blueVal = blueVal + blueDel
        
        if (blueVal > 127)
        {
            blueDel = COLORDELTA * -1
            redOn = true
        }
        
        if (blueVal < 1)
        {
            blueDel = COLORDELTA
            blueOn = false
        }
    }
 
    // server.log(format("%i %i %i", redVal, greenVal, blueVal))
 
    pixelStrip.writePixel(pixel, [redVal, greenVal, blueVal])
    pixelStrip.writePixel(15 - pixel, [redVal, greenVal, blueVal])
    pixelStrip.writeFrame()
    
    timer = imp.wakeup(DELAY, larson)
}
 
function ran(max)
{
    // Generate a pseudorandom number between 0 and (max - 1)
    
    local roll = 1.0 * math.rand() / RAND_MAX
    roll = roll * max
    return roll.tointeger()
}
 
function adjustColors()
{
        if (redOn)
    {
        redVal = redVal + redDel
        
        if (redVal > 254)
        {
            redVal = 256 - COLORDELTA
            redDel = COLORDELTA * -1
            greenOn = true
        }
        
        if (redVal < 1)
        {
            redDel = COLORDELTA
            redOn = false
            redVal = 0
        }
    }
    
    if (greenOn)
    {
        greenVal = greenVal + greenDel
        
        if (greenVal > 254)
        {
            greenDel = COLORDELTA * -1
            blueOn = true
            greenVal = 256 - COLORDELTA
        }
        
        if (greenVal < 1)
        {
            greenDel = COLORDELTA
            greenOn = false
            greenVal = 0
        }
    }
    
    if (blueOn)
    {
        blueVal = blueVal + blueDel
        
        if (blueVal > 254)
        {
            blueDel = COLORDELTA * -1
            redOn = true
            blueVal = 256 - COLORDELTA
        }
        
        if (blueVal < 1)
        {
            blueDel = COLORDELTA
            blueOn = false
            blueVal = 0
        }
    }
}
 
function setColor(color)
{
    if (timer!= null) imp.cancelwakeup(timer)
    pixelStrip.clearFrame()
    pixelStrip.writeFrame()
    
    local colors = split(color, ".")
    
    local red = colors[0].tointeger()
    if (red < 0) red = 0
    if (red > 255) red = 255
    
    local green = colors[1].tointeger()
    if (green < 0) green = 0
    if (green > 255) green = 255
    
    local blue = colors[2].tointeger()
    if (blue < 0) blue = 0
    if (blue > 255) blue = 255
    
    for (local i = 0 ; i < NUMPIXELS ; i++) pixelStrip.writePixel(i, [red, green, blue])
    pixelStrip.writeFrame()
}
 
// START OF PROGRAM
 
// Register handlers for messages from the agent
 
agent.on("glow", glowinit)
agent.on("looper", looperinit)
agent.on("larson", larsoninit)
agent.on("random", randominit)
agent.on("setcolor", setColor)
 
// Pick a random effect to begin with
 
switch (0)
{
    case 0:
        glowinit(true)
        break
    
    case 1:
        randominit(true)
        break
        
    case 2:
        looperinit(true)
        break
        
    case 3:
        larsoninit(true)
}