
/*
 * script.js
 */




 var margin = {top: 1, right: 1, bottom: 6, left: 20},
     width = 700 - margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;

 var formatNumber = d3.format(",.0f"),
     format = function(d) { return formatNumber(d) + " Startups"; },
     color = d3.scale.category20();

 var svg = d3.select("#sankeyvis").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var sankey = d3.sankey()
     .nodeWidth(15)
     .nodePadding(10)
     .size([width, height]);

 var path = sankey.link();

 d3.json("data/sankey.json", function(energy) {

   sankey
       .nodes(energy.nodes)
       .links(energy.links)
       .layout(32);

   var link = svg.append("g").selectAll(".link")
       .data(energy.links)
     .enter().append("path")
       .attr("class", "link")
       .attr("d", path)
       .style("stroke-width", function(d) { return Math.max(1, d.dy); })
       .sort(function(a, b) { return b.dy - a.dy; });

   link.append("title")
       .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

   var node = svg.append("g").selectAll(".node")
       .data(energy.nodes)
     .enter().append("g")
       .attr("class", "node")
       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
     .call(d3.behavior.drag()
       .origin(function(d) { return d; })
       .on("dragstart", function() { this.parentNode.appendChild(this); })
       .on("drag", dragmove));

   node.append("rect")
       .attr("height", function(d) { return d.dy; })
       .attr("width", sankey.nodeWidth())
       .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
       .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
     .append("title")
       .text(function(d) { return d.name + "\n" + format(d.value); });

   node.append("text")
       .attr("x", -6)
       .attr("y", function(d) { return d.dy / 2; })
       .attr("dy", ".35em")
       .attr("text-anchor", "end")
       .attr("transform", null)
       .text(function(d) { return d.name; })
     .filter(function(d) { return d.x < width / 2; })
       .attr("x", 6 + sankey.nodeWidth())
       .attr("text-anchor", "start");

   function dragmove(d) {
     d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
     sankey.relayout();
     link.attr("d", path);
   }
 });









 $(function(){

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

     // Global var for data
     var allData = [];
     var rounds = {};
     var metaData = {};

     var dateFormatter = d3.time.format("%Y-%m-%d");

     // Call after data load
     var initVis = function(){
         var MyEventHandler = new Object();
         // var deals = new StackedArea(
         //                         d3.select("#deals"), 
         //                         allData,
         //                         metaData,
         //                         MyEventHandler,
         //                         0);


         $(MyEventHandler).bind("selectionChanged", function (event, from, to){
             if (String(from) == String(to)) {
                 from = null;
                 to = null
             }
             age_vis.onSelectionChange(from, to);
         });
     }

     // call this function after both files are loaded -- error should be "null" if no error
     var dataLoaded = function (error, _allData) {
         if (!error) {

            initVis();
         }
     }

     var startHere = function(){

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

                chart.style('stream');

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

            chart.yAxis
                .tickFormat(d3.format(',.2f'));

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

