// Log the URLs we need
server.log("Open " + http.agenturl());

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

      <p id='currentTime'></p>

      <script>
         document.getElementById('currentTime').innerHTML = Date();
      </script>

      <input type='date' id='myDate' value='2015-04-16' min='2015-04-16'>
      <input type='time' id='myTime' value='00:00:00'>
      
      <p id='demo'></p>
      <p>
        <button onclick='myFunction()'>Set Date and Time</button>
      </p>
      
      
      <script>
      function myFunction() {
          var x = document.getElementById('myDate').value;
          var y = document.getElementById('myTime').value;
          document.getElementById('demo').innerHTML = x+' '+y;
          var inputDate = new Date(x+' '+y)
          unixTimestamp  = Math.round(new Date(inputDate).getTime()/1000)
          
          httpPost(unixTimestamp)
      }
      
      function httpPost(unixTimestamp) {
          alert('send http get request')
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
