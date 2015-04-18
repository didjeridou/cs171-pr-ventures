/*
 * BubbleVis object
 */


BubbleVis = function(_parentElement, _data, _metaData, _eventHandler, sector){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.displayData = [];
    this.sector = sector;

    // define constants
    this.margin = {top: 10, right: 10, bottom: 10, left: 10};
    this.width = getInnerWidth(this.parentElement)
                 - this.margin.left - this.margin.right,
    this.height = 100 - this.margin.top - this.margin.bottom;

    this.initVis();

}

BubbleVis.prototype.initVis = function(){

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

    // filter, aggregate, modify data
    this.wrangleData(
        this.filterDateRange()
    );

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
BubbleVis.prototype.wrangleData= function(_filterFunction){

    this.displayData = this.filterAndAggregate(_filterFunction);
}

BubbleVis.prototype.updateVis = function(){

    var that = this;
  
    var maxDomain = 
        Math.sqrt(
            Math.max.apply(Math, that.displayData)
        ) / Math.PI;

    var minDomain = 
        Math.sqrt(
            Math.min.apply(Math, that.displayData)
        ) / Math.PI;

    var b_size_scale = d3.scale.linear()
          .domain([minDomain, maxDomain])
          .range([10,that.height/2]);
       
    var color = d3.scale.linear()
                  .domain([0, 1, 2, 3])
                  .range(["#1B325F", "#3A89C9", "#9CC4E4", "#E9F2F9"]);

  
    var jsonBubble = [{
        "x_axis": this.width/2, 
        "y_axis": this.height/2, 
        "radius": b_size_scale(Math.sqrt(that.displayData[that.sector])/Math.PI), 
        "color" : color(that.sector)
    }];
  
    var bubble = this.svg.selectAll("circle")
                         .data(jsonBubble)
                         .enter()
                         .append("circle")
                         .attr("cx", function (d) { return d.x_axis; })
                         .attr("cy", function (d) { return d.y_axis; })
                         .attr("r", function (d) { return d.radius; })
                         .style("fill", function(d) { return d.color; }); 
  
}

BubbleVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    this.wrangleData(this.filterDateRange(selectionStart, selectionEnd));
    this.updateVis();
}


//=========
// HELPERS  
//=========


var dateFormatter = d3.time.format("%Y-%m-%d");

BubbleVis.prototype.filterAndAggregate = function(_filter){


   // var filter = function(){return true;}
   // if (_filter != null){
   //     filter = _filter;
   // } else { filter = this.data }

   var that = this;


   //  var res = d3.range(100).map(function () {
   //      return 0;
   //  });

   //  filter.map(function(d) { 
   //      for (var i = 99; i >= 0; i--) {
   //          res[i] += d.ages[i]
   //      };
   //  });

  var res = [];
  res = that.data.map(function (s) {
    var sum = s.reduce(function(a, b) { return a + b; }, 0);
    return sum;
  })

  return res;

}

BubbleVis.prototype.filterDateRange = function(from, to){

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


