var chartArrayData;
var favoriteId;
var favoriteIds = [];
var chart;

// stores indicatorCodes from ajax requests in an array
function favId(obj) {
  favoriteId = obj;
  favoriteIds.push(favoriteId);
}

google.charts.load('current', {
    'packages': ['corechart'],
});

// waits for scripts to load; often is called early
// creates error in console saying google.visualization.linechart is not a constructor
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawChart2);

// draws chart for homepage
function drawChart(chartArrayData) {
    var data = google.visualization.arrayToDataTable(chartArrayData);
    var options = {
        title: '',
        curveType: 'function',
        legend: {
            position: 'bottom'
        }
    };
    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}

// draws chart for favorites, was unable to draw all favorites on one page
// so I put the if statement in
function drawChart2(chartArrayData) {
  for(i=0; i < favoriteIds.length; i++) {
    if(window.location.pathname !== "/favorites/all") {
    var data2 = google.visualization.arrayToDataTable(chartArrayData);
    var options2 = {
        title: '',
        curveType: 'function',
        legend: {
            position: 'bottom'
        }
      };
    chartArrayData.forEach(chart.draw(data2, options2));
  }
  }
}
