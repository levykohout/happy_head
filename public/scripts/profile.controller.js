angular.module('happyHeadApp')
    .controller('ProfileController', ProfileController);

function ProfileController($http, $location, $scope, $route) {

    console.log('ProfileController loaded');
    var profile = this;


    profile.hitsData = [];

    //get hits data
    profile.getHitsData = function() {

        $http.get('/hits').then(function(response) {
            profile.hitsData = response.data;
            profile.processData(profile.hitsData);
        });
    };
    profile.getHitsData();
    //sort data
    profile.processData = function(data) {

            profile.showChartData(profile.hitsData);
        }
        //present data in chart based on selected day

    profile.highHitData = [];
    profile.mediumHitData = [];
    profile.lowHitData = [];


  profile.data;
    //alternative
    profile.showChartData = function(chartData) {


        profile.data = [{
                key:'Intensity Level',
                values: [],
          }];


        var timeInSeconds;
        var i=0, x;
        var tickCount = chartData.length;
        chartData.forEach(function(hit) {

            timeInSeconds = new Date(hit.timeStamp);
            // timeInSeconds = parseInt((timeInSeconds.getTime()));
            // console.log(timeInSeconds);
            x = timeInSeconds;
            if (hit.impactLevel == 'high') {
                profile.highHitData.push(hit);
                profile.data[0].values.push({
                    x: x,
                    y: hit.intensity,
                    color:'#d62728',
                    impactLevel:hit.impactLevel,

                });
            } else if (hit.impactLevel == 'medium') {
                profile.mediumHitData.push(hit);
                profile.data[0].values.push({
                    x: x,
                    y: hit.intensity,
                    color: '#FFA500',
                    impactLevel:hit.impactLevel
                });
            } else if (hit.impactLevel == 'low') {
                profile.lowHitData.push(hit);
                profile.data[0].values.push({
                    x: x,
                    y: hit.intensity,
                    color: '#6688cc',
                    impactLevel:hit.impactLevel
                });
            }
              //  $scope.data= profile.data;
            profile.highHitDataCount = profile.highHitData.length;
            profile.mediumHitDataCount = profile.mediumHitData.length;
            profile.lowHitDataCount = profile.lowHitData.length;
        });

        var chart;

        nv.addGraph(function() {


            var chart = nv.models.multiBarChart(),

            svgElem = d3.select('#chart svg'),
        availableWidth,

        //get date range divided by number of days or hour or minutes to make number of ticks
        numTicks = 50,
        xScale = d3.time.scale();




        function updateAvailableWidth() {
        availableWidth = (chart.width() || parseInt(svgElem.style('width')) || 960) - chart.margin().left - chart.margin().right;
    }
    updateAvailableWidth();
    nv.utils.windowResize(updateAvailableWidth);

    xScale.rangeBands = xScale.range;
    xScale.rangeBand = function() { return (1 - chart.groupSpacing()) * availableWidth / numTicks; };

    chart.multibar.xScale(xScale);

    var firstDate=profile.data[0].values[20].x; //set start date
    var dataLength=profile.data[0].values.length;
    var lastDate=profile.data[0].values[dataLength-1].x; //set end Date

// firstDate=firstDate.getMonth();
//     lastDate=lastDate.getMonth();
//     console.log(firstDate);
//     console.log(lastDate);
    chart.xDomain([firstDate, lastDate]);


    chart.reduceXTicks(false);
    chart.showControls(false);

            chart.noData("There is no data to display.")
            .duration(0)
            .staggerLabels(false)
            .showLegend(false)
            .rotateLabels(-45)
            .tooltip.enabled();


       var tsFormat = d3.time.format('%b %-d, %Y %I:%M%p');

            chart.xAxis
                .showMaxMin(false)
                .tickPadding(10)
                .tickFormat(function(d) {
                return tsFormat(new Date(d));
                });





            chart.yAxis
                .showMaxMin(false)
                .tickFormat(d3.format(',.1f'));

                         svgElem

                .datum(profile.data)
                .transition()
                .duration(500)
                .call(chart);


                // make our own x-axis tick marks because NVD3 doesn't provide any
// var tickY2 = chart.yAxis.scale().range()[1];
// var lineElems = svgElem
//     .select('.nv-x.nv-axis.nvd3-svg')
//     .select('.nvd3.nv-wrap.nv-axis')
//     .select('g')
//     .selectAll('.tick')
//     .data(chart.multibar.xScale().ticks())
//     .append('line')
//     .attr('class', 'x-axis-tick-mark')
//     .attr('x2', 0)
//     .attr('y1', tickY2 + 4)
//     .attr('y2', tickY2)
//     .attr('stroke-width', 1);

    // set up the tooltip to display full dates

           var contentGenerator = chart.tooltip.contentGenerator();
           var tooltip = chart.tooltip;
           tooltip.contentGenerator(function(d) {
               return contentGenerator(d);
           });
           tooltip.headerFormatter(function(d) {
               return tsFormat(new Date(d));
           });

            nv.utils.windowResize(chart.update);

            return chart;
        });
    };





    //
    profile.start = function() {
        var deviceID = "2a0022000947353138383138",
            tempSpan = document.getElementById("uptime"),
            tsSpan = document.getElementById("tstamp"),
            accessToken = "bf4c7b2288275febcc216c53b2e555a6f481d82b",
            eventSource = new EventSource("https://api.particle.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken),
            lowCount = 0,
            mediumCount = 0,
            highCount = 0,
            impactLevel = "low",
            mediumData = {},
            highData = {};


        // tempSpan.innerHTML = "Waiting for data...";
        eventSource.addEventListener('rangeLevel', function(e) {
            var parsedData = JSON.parse(e.data);


            //convert parsedData.data to number first
            var intensity = Math.abs(parseInt(parsedData.data));


            if (intensity >= 500 && intensity < 700) {
                impactLevel = "low";
                lowCount++;
                var data = {
                    impactLevel: impactLevel,
                    timeStamp: parsedData.published_at,
                    intensity: intensity
                }
                saveData(data);
            } else if (intensity >= 700 && intensity < 900) {
                impactLevel = "medium";
                mediumCount++;
                mediumData.count = mediumCount;
                mediumData.impactLevel = impactLevel;


                var data = {
                    impactLevel: impactLevel,
                    timeStamp: parsedData.published_at,
                    intensity: intensity
                }
                saveData(data);
            } else if (intensity >= 900) {
                impactLevel = "high";
                highCount++;
                highData.count = highCount;
                highData.impactLevel = impactLevel;
                // smsTwilio(highData);
                var data = {
                    impactLevel: impactLevel,
                    timeStamp: parsedData.published_at,
                    intensity: intensity
                }
                saveData(data);
            }

            function smsTwilio(data) {
                $http.post('/twilio', data).then(function(response) {

                });
            }


            function saveData(data) {
                $http.post('/hits', data).then(function(response) {
                    console.log(response);
                    $route.reload();
                });
            }
            // tempSpan.innerHTML += " impact: " + impactLevel;
            // tempSpan.style.fontSize = "28px";
            // tempSpan.style.fontSize = "28px";
            //
            // tsSpan.innerHTML = "At timestamp " + parsedData.published_at;
            // tsSpan.style.fontSize = "9px";

        }, false);
    }


    profile.start();


} //End of controller
