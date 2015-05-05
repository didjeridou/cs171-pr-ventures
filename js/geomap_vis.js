/*
 * Geomap object
 * The geomap in chapter 3 is built using Crunchbase curated data
 * and using Google's visualization tools.
 */

google.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {

    // Load the data
    var jsondata = d3.json('data/states.json', function(data) {

      var gdata = google.visualization.arrayToDataTable(data);

      var options = {
          region: 'US',
          resolution: 'provinces',
          displayMode: 'region',
          keepAspectRatio: true,
          colorAxis: {
              colors: ['#ffe478', '#e74c3c']
          }
      };

      var chart = new google.visualization.GeoChart(document.getElementById('na-map'));

      chart.draw(gdata, options);
    })

}
