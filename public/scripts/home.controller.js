angular.module('happyHeadApp')
    .controller('HomeController', HomeController);

    function HomeController($http,loginService){

      var home = this;
      home.loginService=loginService;
      home.loginService.loggedInEmail();
      home.start = function() {
              var deviceID = "2a0022000947353138383138",
                  tempSpan = document.getElementById("uptime"),
                  tsSpan   = document.getElementById("tstamp"),
                  accessToken = "bf4c7b2288275febcc216c53b2e555a6f481d82b",
                  eventSource = new EventSource("https://api.particle.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken),
                  lowCount = 0,
                  mediumCount = 0,
                  highCount= 0,
                  impactLevel = "low",
                  mediumData = {},
                  highData={};


              tempSpan.innerHTML = "Waiting for data...";
              eventSource.addEventListener('rangeLevel', function(e) {
                  var parsedData = JSON.parse(e.data);
                  console.log(parsedData);

                  //convert parsedData.data to number first
                    var intensity = Math.abs(parseInt(parsedData.data));
                    console.log(intensity);

                  if(intensity >= 300 && intensity<500){
                    impactLevel = "low";
                    lowCount++;
                    var data = {
                      impactLevel:impactLevel,
                      timeStamp: parsedData.published_at,
                      intensity:intensity
                    }
                    saveData(data);
                  } else if (intensity >= 500 && intensity<700){
                    impactLevel = "medium";
                    mediumCount++;
                    mediumData.count=mediumCount;
                    mediumData.impactLevel=impactLevel;
                    console.log(mediumCount);

                    var data = {
                      impactLevel:impactLevel,
                      timeStamp: parsedData.published_at,
                      intensity:intensity
                    }
                    saveData(data);
                  } else if(intensity > 700){
                    impactLevel = "high";
                    highCount++;
                    highData.count=highCount;
                    highData.impactLevel=impactLevel;
                    // smsTwilio(highData);
                    var data = {
                      impactLevel:impactLevel,
                      timeStamp: parsedData.published_at,
                      intensity:intensity
                    }
                    saveData(data);
                  }
                 function smsTwilio(data){
                    $http.post('/twilio', data).then(function(response){
                      console.log(response);
                    });
                 }


                 function saveData(data){
                   $http.post('/hits',data).then(function(response){
                     console.log(response);
                   });
                 }
                  tempSpan.innerHTML += " impact: " + impactLevel;
                  tempSpan.style.fontSize = "28px";
                  tempSpan.style.fontSize = "28px";

                  tsSpan.innerHTML = "At timestamp " + parsedData.published_at;
                  tsSpan.style.fontSize = "9px";

              }, false);
          }


    home.start();



    }
