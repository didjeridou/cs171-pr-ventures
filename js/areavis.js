/*
 * AreaVis object
 */


AreaVis = function(_parentElement, _data, _metaData, _eventHandler, sector){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.displayData = [];
    this.sector = sector;

    // define constants
    this.margin = {top: 30, right: 20, bottom: 65, left: 50};
    this.width = getInnerWidth(this.parentElement)
                 - this.margin.left - this.margin.right,
    this.height = getInnerHeight(this.parentElement) 
                 - this.margin.top - this.margin.bottom;

    this.initVis();

}

AreaVis.prototype.initVis = function(){

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

    this.x = d3.scale.linear()
        .range([0, this.width]);

    this.y = d3.scale.linear()
        .range([this.height-100, 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return that.x(d[0]); })
        .y0(that.height)
        .y1(function(d) { return that.y(d[1]); });

    this.svg.append("path")
            .datum(that.displayData)
            .attr("class", "area")
            .attr("d", that.area);

    this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.height + ")")
            .call(that.xAxis);

    this.svg.append("g")
          .attr("class", "y axis")
          .call(that.yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Price ($)");

    // filter, aggregate, modify data
    this.wrangleData(
        this.filterDateRange()
    );

    // call the update method
    this.updateVis();
}

AreaVis.prototype.wrangleData= function(_filterFunction){

    this.displayData = this.filterAndAggregate(_filterFunction);
}

AreaVis.prototype.updateVis = function(){

    console.log();
    var that = this;

    var maxDomain = Math.max.apply(Math, that.data[that.sector]);
    var minDomain = Math.min.apply(Math, that.data[that.sector]);

    this.x.domain(d3.extent(this.displayData, function(d) { return d[0]; }));
    this.y.domain(d3.extent(this.displayData, function(d) { return d[1];}));

    this.svg.select(".x.axis")
        .call(this.xAxis);

    this.svg.select(".y.axis")
        .call(this.yAxis)

    // updates graph
    var path = this.svg.selectAll(".area")
      .data([this.displayData])

    path.enter()
      .append("path")
      .attr("class", "area");

    path
      .transition()
      .attr("d", this.area);

    path.exit()
      .remove();
  
}

AreaVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    this.wrangleData(this.filterDateRange(selectionStart, selectionEnd));
    this.updateVis();
}


//=========
// HELPERS  
//=========


AreaVis.prototype.filterAndAggregate = function(_filter){

    var that = this;

    var res = [];

    var res = that.data[that.sector].map(function(d, i) { return [i, d]; });

    console.log(res);

    return res;
}

AreaVis.prototype.filterDateRange = function(from, to){

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


