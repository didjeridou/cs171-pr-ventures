/*
 * StackedArea object
 */


StackedArea = function(_parentElement, _data, _metaData, _eventHandler, sector){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    // define constants
    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    this.width = getInnerWidth(this.parentElement)
                 - this.margin.left - this.margin.right,
    this.height = getInnerHeight(this.parentElement) 
                 - this.margin.top - this.margin.bottom;


    this.initVis();

}

StackedArea.prototype.initVis = function(){

    var that = this;

    this.svg = this.parentElement.append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top +this.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + this.margin.left + "," 
                + this.margin.top + ")");

    this.formatPercent = d3.format(".0%");

    // this.data.forEach(function(d) {
    //     d.date = that.dateFormatter.parse(d.date);
    // });

    this.x = d3.time.scale()
        .range([0, that.width]);

    this.y = d3.scale.linear()
        .range([that.height, 0]);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
        .scale(that.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(that.y)
        .orient("left")
        .tickFormat(that.formatPercent);

    this.area = d3.svg.area()
        .x(function(d) { return that.x(d.date); })
        .y0(function(d) { return that.y(d.y0); })
        .y1(function(d) { return that.y(d.y0 + d.y); });

    this.stack = d3.layout.stack()
        .values(function(d) { return d.values; });

    // filter, aggregate, modify data
    this.wrangleData(
        this.filterDateRange()
    );

    // call the update method
    this.updateVis();
}

StackedArea.prototype.wrangleData= function(_filterFunction){

    this.displayData = this.filterAndAggregate(_filterFunction);
}

StackedArea.prototype.updateVis = function(){

    var that = this;

    // nv.addGraph(function() {
    //   var chart = nv.models.stackedAreaChart()
    //                 .margin({right: 100})
    //                 .x(function(d) { return d[0] })   //We can modify the data accessor functions...
    //                 .y(function(d) { return d[1] })   //...in case your data is formatted differently.
    //                 .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
    //                 .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
    //                 .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
    //                 .clipEdge(true);
// 
    //   //Format x-axis labels with custom function.
    //   chart.xAxis
    //       .tickFormat(function(d) { 
    //         return d3.time.format('%x')(new Date(d)) 
    //   });
// 
    //   chart.yAxis
    //       .tickFormat(d3.format(',.2f'));
// 
    //   d3.select('#deals')
    //     .datum(that.displayData)
    //     .call(chart);
// 
    //   nv.utils.windowResize(chart.update);
// 
    //   return chart;
    // });
  
}

StackedArea.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    this.wrangleData(this.filterDateRange(selectionStart, selectionEnd));
    this.updateVis();
}


//=========
// HELPERS  
//=========

var dateFormatter = d3.time.format("%Y-%m-%d");

StackedArea.prototype.filterAndAggregate = function(_filter){

    var that = this;

    var ndata = d3.nest()
        .key(function(d) { return dateFormatter.parse(d.date)})
        .rollup(function(d) {
            return d;
        })
        .entries(that.data);

    var good = [];

    that.metaData.map(function (d,i) {
        good.push({"key": d, "values":[]})
    });
    
    ndata.map(function (d) {

        var sums = {};
        var total = 0;

        that.metaData.map(function (r) {
            sums[r] = 0;
        });

        d.values.map(function (v) {
            sums[v.round] ++;
            total++;
        })

        that.metaData.map(function (round) {

            for (var i = good.length - 1; i >= 0; i--) {
                if (good[i]["key"] == round) {
                    good[i]["values"].push([(new Date(d.key).getTime()), sums[round]])
                }
            };
        })
    })

    good.map(function (g) {
        console.log("Sorted 1");
        g["values"] = g["values"].sort()
    })

    var data = JSON.stringify(good);
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
    window.open(url, '_blank');
    window.focus();

    return good;
}

StackedArea.prototype.filterDateRange = function(from, to){

    var res = [];

    if (!from && !to) {
        res = this.data
    } else if (!from) {
        from = dateFormatter.parse("1911-02-18");
    } else if (!to) {
        to = dateFormatter.parse("2211-02-18");
    }

    $.grep( this.data, function( d, i ) {
        if (from <= d.time && to >= d.time) {
            res[i] = d
        }
    });

    return res

}


