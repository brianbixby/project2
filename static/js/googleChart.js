var chartArrayData;

google.charts.load('current', {
    'packages': ['corechart']
});

function drawChart(chartArrayData) {
    var data = google.visualization.arrayToDataTable(chartArrayData);

    var options = {
        title: 'Company Performance',
        curveType: 'function',
        legend: {
            position: 'bottom'
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
