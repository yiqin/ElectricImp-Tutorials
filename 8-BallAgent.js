// AGENT CODE
 // Log the URLs we need
server.log("Open " + http.agenturl());

answerType <- 0

page <- @"
  <!DOCTYPE html>
  <html>
    <head>
      <title>My Form</title>
    </head>
    <body>

      <p>
        8 Ball - Answer the question: <br>
      </p>
      
      <p>
        Which university is the best? (Enter University of Chicago to get the right answer.) <br>
      </p>

      <input name='textInput' id='textInput' type='text' value=''>

      <p>
        <button onclick='myFunction()'>Submit</button>
      </p>
      
      
      
      <script>
      function myFunction() {
          
          var textInput = document.getElementById('textInput').value;
          if (textInput == 'University of Chicago') {
              alert(textInput)
              httpPost('0.255.0')
              alert('change to the green color')
          }
          else {
              alert(textInput)
              var i = Math.floor((Math.random() * 3) + 1);
              
              switch(i)
              {
                  case 1:
                      httpPost('255.0.0')
                      alert('change to the red color')
                      break
                  case 2:
                      
                      httpPost('0.0.255')
                      alert('change to the blue color')
                      break
                  case 3:
                      httpPost('255.255.255')
                      alert('change to the white color')
                      break
              }
          }
      }
      
      function httpPost(colorString) {
          
          var xmlHttp = null;
          var url = 'https://agent.electricimp.com/ZoCftFpbR37S?setcolor='+colorString
          xmlHttp = new XMLHttpRequest();
          xmlHttp.open( 'POST', url, false );
          xmlHttp.send(null);
      }
      </script>

    </body>
  </html>
"


function requestHandler(request, response)
{
    try
    {
        if ("setcolor" in request.query)
        {
            device.send("setcolor", request.query.setcolor)
            response.send(200, "Color Set")
            return
        }
        
        if ("glow" in request.query)
        {
            device.send("glow", true)
            response.send(200, "Glow effect on")
            return
        }
        
        if ("random" in request.query)
        {
            device.send("random", true)
            response.send(200, "Random effect on")
            return
        }
        
        if ("looper" in request.query)
        {
            device.send("looper", true)
            response.send(200, "Looper effect on")
            return
        }
        
        if ("larson" in request.query)
        {
            device.send("larson", true)
            response.send(200, "Larson effect on")
            return
        }
        
        response.send(200, page)
    }
    catch (error)
    {
        server.log("Error: " + error)
    }
}
 
// Reqister the handler to deal with incoming requests
 
http.onrequest(requestHandler)