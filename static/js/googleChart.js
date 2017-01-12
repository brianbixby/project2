// var apiColumns = parseJson(parsedMain.dataset.column_names);
var chartArrayData = [];
var apiData = ['2004', 1000];
chartArrayData.push(
    ['a', 'Sales'], apiData, ['2005', 1170], ['2006', 660], ['2007', 1030]
);

google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
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

function parseJson(object) {
    // console.log(object);
    console.log('object.dataset.column_names: ', object.dataset.column_names);
    var colmnNamesArray = object.dataset.column_names;
    getColumns(colmnNamesArray);
    // console.log('object.dataset.data :', object.dataset.data);
    var dataArray = object.dataset.data;
    getData(dataArray);
}
