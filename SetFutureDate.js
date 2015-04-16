// Log the URLs we need
server.log("Open " + http.agenturl());

fname <- "Electric"
lname <- "Imp"
message <- "lalalal"
unixTimestamp <- 0

page <- @"
  <!DOCTYPE html>
  <html>
    <head>
      <title>My Form</title>
    </head>
    <body>

      <p>
        Create a web form which will take a date/time as an argument.<br>
      </p>

      <input type='date' id='myDate' value='2014-02-09'>
      <input type='time' id='myTime' value='22:15:00'>
      
      <p id='demo'></p>
      <p>
        <button onclick='myFunction()'>Set Date and Time</button>
      </p>
      
      <p>
          <form method='POST'>
             
             <input type='submit' value='Submit'>
          </form>
      </p>
      
      <script>
      function myFunction() {
          var x = document.getElementById('myDate').value;
          var y = document.getElementById('myTime').value;
          document.getElementById('demo').innerHTML = x+' '+y;
          var inputDate = new Date(x+' '+y)
          unixTimestamp  = Math.round(new Date(inputDate).getTime()/1000)
          
          httpGet(unixTimestamp)
      }
      
      function httpGet(unixTimestamp) {
          var xmlHttp = null;
          var url = 'https://agent.electricimp.com/ZoCftFpbR37S?led='+unixTimestamp.toString()
          xmlHttp = new XMLHttpRequest();
          xmlHttp.open( 'POST', url, false );
          xmlHttp.send(null);
      }
      </script>

    </body>
  </html>
"

function requestHandler(request, response) {
  try {
    if ("led" in request.query) {
      if (request.query.led == "1" || request.query.led == "0") {
        local ledState = request.query.led.tointeger();
        device.send("led", ledState); 
      }
    }
    response.send(200, "OK");
  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}
 
// register the HTTP handler
http.onrequest(function(request, response) {
  try {
    local method = request.method.toupper()
    if (method == "POST") {
        if ("led" in request.query) {
            local data = http.urldecode(request.body);
            server.log("Unix Timestamp "+request.query.led)
            device.send("led", request.query.led); 
        }
        response.send(200, page)
    }
    else {
      response.send(200, page)
    }
  }
  catch(error) {
    response.send(500, error)
  }
})


