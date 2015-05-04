/*
 * Geomap object
 */

google.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {

    var jsondata = d3.json('data/states.json', function(data) {

      var gdata = google.visualization.arrayToDataTable(data);

      var options = {
          region: 'US',
          resolution: 'provinces',
          displayMode: 'region',
          keepAspectRatio: true,
          colorAxis: {
              colors: ['yellow', 'red']
          }
      };

      var chart = new google.visualization.GeoChart(document.getElementById('na-map'));

      chart.draw(gdata, options);
    })

}
