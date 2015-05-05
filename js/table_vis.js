/*
 * Geomap object
 */

      google.setOnLoadCallback(drawTable);

      function drawTable() {
        var gdata = new google.visualization.DataTable();
        gdata.addColumn('string', 'Raised by');
        gdata.addColumn('string', 'Round');
        gdata.addColumn('number', 'Amount');
        gdata.addColumn('string', 'Sector');
        gdata.addColumn('string', 'Region');

        d3.json('data/most_funded.json', function(data) {
          gdata.addRows(data);

          var table = new google.visualization.Table(document.getElementById('table_div'));

          table.draw(gdata, {showRowNumber: true});

        })

      }

