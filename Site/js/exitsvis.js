
/*
 * ExitsVis object
 */


ExitsVis = function(_parentElement, _data, _metaData, _eventHandler, sector){
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

ExitsVis.prototype.initVis = function(){

    var that = this;


    // filter, aggregate, modify data
    this.wrangleData(
        this.filterDateRange()
    );

    // call the update method
    this.updateVis();
}

ExitsVis.prototype.wrangleData= function(_filterFunction){

    this.displayData = this.filterAndAggregate(_filterFunction);
}

ExitsVis.prototype.updateVis = function(){

    var cat = ["Health", "Hardware", "Business", "Software"];
    var tempData = [10, 9, 4, 7];

    var that = this;

    var svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

    var data = [4, 8, 15, 16, 16, 42];

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    d3.select(".chart")
      .selectAll("div")
        .data(data)
      .enter().append("div")
        .style("width", function(d) { return x(d) + "px"; })
        .text(function(d) { return d; });
}

ExitsVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    this.wrangleData(this.filterDateRange(selectionStart, selectionEnd));
    this.updateVis();
}


//=========
// HELPERS  
//=========


ExitsVis.prototype.filterAndAggregate = function(_filter){

    var that = this;

    var res = [];

    var res = that.data[that.sector].map(function(d, i) { return [i, d]; });

    console.log(res);

    return res;
}

ExitsVis.prototype.filterDateRange = function(from, to){

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