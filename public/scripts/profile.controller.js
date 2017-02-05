angular.module('happyHeadApp')
    .controller('ProfileController', ProfileController);

function ProfileController($http, $location, $scope) {
    console.log('ProfileController loaded');
    var profile = this;
    profile.hitsData = [];

    //get hits data
    profile.getHitsData = function() {

        $http.get('/hits').then(function(response) {
            console.log(response.data);
            profile.hitsData = response.data;
            profile.processData(profile.hitsData);
        });
    };
    profile.getHitsData();
    //sort data
    profile.processData = function(data) {

            //implement filtering
            profile.filterData(profile.hitsData);

            profile.showChartData(profile.hitsData);
        }
        //present data in chart based on selected day

    profile.highHitData = [];
    profile.mediumHitData = [];
    profile.lowHitData = [];

    profile.filterData = function(data) {
        //filter by date/time range

        //filter by impact Level
        data.forEach(function(hit) {
            if (hit.impactLevel == 'high') {
                profile.highHitData.push(hit);
            } else if (hit.impactLevel == 'medium') {
                profile.mediumHitData.push(hit);
            } else {
                profile.lowHitData.push(hit);
            }
        });

        profile.highHitDataCount = profile.highHitData.length;
        profile.mediumHitDataCount = profile.mediumHitData.length;
        profile.lowHitDataCount = profile.lowHitData.length;
    }

    //alternative
    profile.showChartData = function(chartData) {
        var data;
        data = [{
            values: [],
        }, ];

        var timeInSeconds;
        var i, x;
        var tickCount = chartData.length;
        for (i = 0; i < tickCount; i++) {
            timeInSeconds = new Date(chartData[i].timeStamp);
            console.log(timeInSeconds);
            timeInSeconds = parseInt((timeInSeconds.getTime()) / 1000);;

            // x = timeInSeconds + 3 * 10 * 60;
            x = timeInSeconds;

            data[0].values.push({
                x: x * 1000,
                y: chartData[i].intensity
            });

        }

        var chart;

        nv.addGraph(function() {
            chart = nv.models.historicalBarChart();
            chart
            // .x(function(d) { return d[0]; })
            // .y(function(d) { return d[1]; })
                .xScale(d3.time.scale()) // use a time scale instead of plain numbers in order to get nice round default values in the axis
                .color(['#68c'])
                .useInteractiveGuideline(true) // check out the css that turns the guideline into this nice thing
                // .tooltips(true)
                // .tooltipContent(function (key, x, y, graph) {
                //     var content = '<h3 style="background-color: ' + y.color + '">' + d3.time.format('%b %-d, %Y %I:%M%p')(new Date(graph.point.x)) + '</h3>';
                //     content += '<p>' +  y + '</p>';
                //     return content;
                // })
                .margin({
                    "left": 80,
                    "right": 50,
                    "top": 20,
                    "bottom": 50,
                })
                .noData("There is no data to display.")
                .duration(0);

            var tickMultiFormat = d3.time.format.multi([
                ["%-I:%M%p", function(d) {
                    return d.getMinutes();
                }], // not the beginning of the hour
                ["%-I%p", function(d) {
                    return d.getHours();
                }], // not midnight
                ["%b %-d", function(d) {
                    return d.getDate() != 1;
                }], // not the first of the month
                ["%b %-d", function(d) {
                    return d.getMonth();
                }], // not Jan 1st
                ["%Y", function() {
                    return true;
                }]
            ]);
            chart.xAxis
                .showMaxMin(false)
                // .axisLabel('Time')
                // .rotateLabels(-45) // Want longer labels? Try rotating them to fit easier.
                .tickPadding(10)
                .tickFormat(function(d) {
                    return tickMultiFormat(new Date(d));
                });

            chart.yAxis
                .showMaxMin(false)
                // .highlightZero(true)
                // .axisLabel('Intensity of Hit')
                .axisLabelDistance(10)
                .tickFormat(d3.format(",.0f"));

            var svgElem = d3.select('#chart svg');
            svgElem
                .datum(data)
                .transition()
                .call(chart);

            // make our own x-axis tick marks because NVD3 doesn't provide any
            var tickY2 = chart.yAxis.scale().range()[1];
            var lineElems = svgElem
                .select('.nv-x.nv-axis.nvd3-svg')
                .select('.nvd3.nv-wrap.nv-axis')
                .select('g')
                .selectAll('.tick')
                .data(chart.xScale().ticks())
                .append('line')
                .attr('class', 'x-axis-tick-mark')
                .attr('x2', 0)
                .attr('y1', tickY2 + 4)
                .attr('y2', tickY2)
                .attr('stroke-width', 1);

            // set up the tooltip to display full dates
            var tsFormat = d3.time.format('%b %-d, %Y %I:%M%p');
            var contentGenerator = chart.interactiveLayer.tooltip.contentGenerator();
            var tooltip = chart.interactiveLayer.tooltip;
            tooltip.contentGenerator(function(d) {
                d.value = d.series[0].data.x;
                return contentGenerator(d);
            });
            tooltip.headerFormatter(function(d) {
                return tsFormat(new Date(d));
            });

            return chart;
        });

    };









}
