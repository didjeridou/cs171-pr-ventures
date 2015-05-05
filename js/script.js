
/*
 * script.js
 */



 $(function(){

      // Tools for next version with more data interaction
     // Load the json files asynchronously
     function asyncCounter(wait_for_n, callback){
         this.callback = callback;
         this.wait_for_n = wait_for_n;
         this.n = 0;
     };

     asyncCounter.prototype.increment = function(){
         if(this.n++ === this.wait_for_n){
             this.callback();
         }
     };


     // call this function after both files are loaded -- error should be "null" if no error
     var dataLoaded = function (error, _allData) {
         if (!error) {

            initVis();
         }
     }

     var startHere = function(){

        // Initialization for the Stacked Area chart
        d3.json('data/months.json', function(data) {

            nv.addGraph(function() {
                var chart = nv.models.stackedAreaChart()
                    .margin({right: 100})
                    .x(function(d) { return d[0] })   
                    .y(function(d) { return d[1] })   
                    .useInteractiveGuideline(true)    
                    .rightAlignYAxis(true)  
                    .showControls(true)     
                    .clipEdge(true);

                //Format x-axis labels with custom function.
                chart.xAxis
                    .tickFormat(function(d) { 
                        return d3.time.format('%x')(new Date(d)) 
                });

                chart.yAxis
                    .tickFormat(d3.format(',.f'));

                // chart.style('stream');

                d3.select('#deals')
                    .datum(data)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });
        })

        d3.json('data/dealsize.json', function(data) {
          nv.addGraph(function() {
            var chart = nv.models.multiBarHorizontalChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .margin({top: 30, right: 20, bottom: 50, left: 60})
                .showValues(true)           //Show bar value next to each bar.
                .tooltips(false)             //Show tooltips on hover.
                .showControls(false);        //Allow user to switch between "Grouped" and "Stacked" mode.


            d3.select('#deal_size')
                .datum(data)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
          });
        });

         var jsonLoadCounter = new asyncCounter(0, function () {
             console.log("Data loaded")
             dataLoaded(null, allData);
         });

        // d3.csv("data/rounds_month.csv", function(error, csv_data) {
        //    allData = csv_data;
        //    metaData = ["A","B","C","angel","seed","venture"];
        //    jsonLoadCounter.increment();
        // });

     }

     startHere();
 })

 var getInnerWidth = function(element) {
     var style = window.getComputedStyle(element.node(), null);

     return parseInt(style.getPropertyValue('width'));
 }

 var getInnerHeight = function(element) {
     var style = window.getComputedStyle(element.node(), null);

     return parseInt(style.getPropertyValue('height'));
 }

