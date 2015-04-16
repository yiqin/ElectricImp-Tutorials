// Log the URLs we need
server.log("Turn LED On: " + http.agenturl() + "?led=1");
server.log("Turn LED Off: " + http.agenturl() + "?led=0");

fname <- "Electric"
lname <- "Imp"
message <- ""

page <- @"
  <!DOCTYPE html>
  <html>
    <head>
      <title>My Form</title>
    </head>
    <body>
      <h1>My Form</h1>
      <form method='POST'>
        <p>First name:<br>
        <input type='text' name='firstname' value='Electric'>
        <br>
        Last name:<br>
        <input type='text' name='lastname' value='Imp'>

        <br><br>
<input type='submit' name='submitbutton' value='Submit'>
<br>
<input type='submit' name='clearbutton' value='Clear'>

      </form>
    </body>
  </html>
"


function requestHandler(request, response) {
  try {
    // check if the user sent led as a query parameter
    if ("led" in request.query) {
      
      // if they did, and led=1.. set our variable to 1
      if (request.query.led == "1" || request.query.led == "0") {
        // convert the led query parameter to an integer
        local ledState = request.query.led.tointeger();
 
        // send "led" message to device, and send ledState as the data
        device.send("led", ledState); 
      }
    }
    // send a response back saying everything was OK.
    response.send(200, "OK");
  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}
 
// register the HTTP handler
http.onrequest(function(request, response)
{
  try 
  {
    local method = request.method.toupper()
        
    if (method == "POST") 
    {
      local data = http.urldecode(request.body);
      server.log(data.firstname)
                
      if ("submitbutton" in data)
      {
        server.log(data.firstname)
        fname = data.firstname
        lname = data.lastname
        message = "Settings updated"
      }
      else if ("clearbutton" in data)
      {
        fname = ""
        lname = ""
        message = ""
      }
    }
    else
    {
      response.send(200, page)
    }
  }
  catch(error)
  {
    response.send(500, error)
  }
})