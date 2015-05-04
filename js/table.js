/*
 * Geomap object
 */

      google.setOnLoadCallback(drawTable);

      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Raised by');
        data.addColumn('string', 'Round');
        data.addColumn('number', 'Amount');
        data.addColumn('string', 'Sector');
        data.addColumn('string', 'Region');
        data.addRows([
          ['Mike' , 'Series', {v: 10000, f: '$10,000'}, 'Consumer', 'CA', ],
          ['Jim'  , 'Series',   {v:8000,  f: '$8,000'}, 'Consumer', 'CA', ],
          ['Alice', 'Series', {v: 12500, f: '$12,500'}, 'Consumer', 'CA', ],
          ['Bob' ,  'Series',  {v: 7000,  f: '$7,000'}, 'Consumer', 'CA', ]
        ]);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, {showRowNumber: true});
      }