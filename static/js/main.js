// pre-populates chart on homepage
$(document).ready(function() {
  if(window.location.pathname == "/") {
    grabChartData('FR');
  }
});

var currentIC;
// ajax request
function grabChartData(indicatorCode) {
    var url = '/api/results';
    $.ajax({
        method: 'POST',
        data: {
            indicatorCode: indicatorCode
        },
        url: url
    }).done(function(data) {
        parseJson(data);
        var chartArrayData = [];
        for (var i = 0; i < data.parsedMain.dataset.data.length; i++) {
            chartArrayData.unshift(
                data.parsedMain.dataset.data[i]
            );
        }
        chartArrayData.unshift(
            data.parsedMain.dataset.column_names
        );
        // metadata variables from json
        var chartName1 = data.parsedMain.dataset.name.split(':')[1];
        var chartName = chartName1.split('-')[0];
        var oldestDate = data.parsedMain.dataset.oldest_available_date;
        var newestDate = data.parsedMain.dataset.newest_available_date;
        var chartDescription = data.parsedMain.dataset.description;
        var frequency = data.parsedMain.dataset.frequency;
        $('#chartName').append("<h1>" + "Washington State Home Value Index: " + chartName + "</h1>");
        $('#chartDescription').append("<h3>" + "The Washington State Home Value Index is Zillow's estimate of the median market value of " + chartName + " within the state of Washington. This is a " + frequency + " account from " + oldestDate + " to " + newestDate + ". This data is calculated by Zillow Real Estate Research, using their database of 110 million homes." + "</h3>");
        // minor differences depending what page you're on
        // drawchart() and drawchart2() are functions in static/js/googleChart
        if(window.location.pathname == "/favorites/:id") {
          favId(indicatorCode);
          drawChart2(chartArrayData);
        }
        else if(window.location.pathname == "/favorites/all") {
          document.getElementById(indicatorCode).append(chartName + " " + oldestDate + " through "  + newestDate);
          favId(indicatorCode);
          drawChart2(chartArrayData);
        }
        else if(window.location.pathname !== "/auth/login"){
          drawChart(chartArrayData);
        }
    });
}
// retrieves column names form json
function parseJson(object) {
    var colmnNamesArray = object.parsedMain.dataset.column_names;
    getColumns(colmnNamesArray);
    var dataArray = object.parsedMain.dataset.data;
    getData(dataArray);
}
// appends column names to table
function getColumns(obj) {
    for (i = 0; i < obj.length; i++) {
        $('#r1').append("<td>" + obj[i] + "</td>");
    }
}
// appens data to table
function getData(obj) {
    $('#wholeTable').innerHTML = "";
    for (i = 0; i < obj.length; i++) {
        $('#wholeTable').append("<tr>" + "<td>" + obj[i][0] + "</td>" + "<td>" + obj[i][1] + "</td>" + "</tr>");
    }
}
// updates ajax request
$('.put-form').on('submit', function(e) {
    e.preventDefault();
    var element = $(this);
    var url = element.attr('action');
    var formData = element.serialize();
    $.ajax({
        method: 'PUT',
        url: url,
        data: formData
    }).done(function(data) {
        window.location = url;
    });
});
// delete chart from favorites
$('.delete-link').on('click', function(e) {
  e.preventDefault();
  var Element = $(this);
  var Url = Element.attr('href');
  $.ajax({
    method: 'DELETE',
    url: Url
  }).done(function(data) {
    console.log(data);
    Element.remove();
    window.location = 'https://radiant-tor-71519.herokuapp.com/favorites/all';
    window.location = 'localhost:3000/favorites/all';
  });
});
// if the drop down menu changes the page automatically responds
$("#indicatorCode").change(function() {
  $("#chartName").empty();
  $("#chartDescription").empty();
    $("#wholeTable").empty();
    currentIC = $('#indicatorCode').val();
    grabChartData(currentIC);
});
// called from favorites/one; ensures no duplicated data and calls ajax request function
function singleFavorite(obj) {
  $("#chartName").empty();
  $("#chartDescription").empty();
  $("#wholeTable").empty();
  currentIC = obj;
  grabChartData(currentIC);
}
// saves to favorites
$("#favButton").click(function() {
    $.ajax({
        method: 'POST',
        url: '/favorites/' + currentIC
    }).done(function(data) {
        window.location = './';
    });
});
