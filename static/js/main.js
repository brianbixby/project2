console.log("JS good to go, sir!");

$(document).ready(function() {
    var url = '/api/results';
    $.ajax({
        method: 'GET',
        url: url
    }).done(function(data) {
        // get data returned from the PUT route
        console.log(data);
        parseJson(data);
        // refresh the page we're on using GET to display the item details.
        var chartArrayData = [];
        console.log("looking for this pne: ", data.parsedMain.dataset.data[0]);
        // parseJson(parsedMain.dataset.column_names)
        for (var i = 0; i < data.parsedMain.dataset.data.length; i++) {
            chartArrayData.unshift(
                data.parsedMain.dataset.data[i]
            );
        }
        chartArrayData.unshift(
            data.parsedMain.dataset.column_names
        );
        console.log("chartArrayData: ", chartArrayData);
        drawChart(chartArrayData);
    });
});

function parseJson(object) {
    // console.log(object);
    console.log('object.dataset.column_names: ', object.parsedMain.dataset.column_names);
    var colmnNamesArray = object.parsedMain.dataset.column_names;
    getColumns(colmnNamesArray);

    console.log('object.dataset.data :', object.parsedMain.dataset.data);
    var dataArray = object.parsedMain.dataset.data;
    getData(dataArray);
}

function getColumns(obj) {
    for (i = 0; i < obj.length; i++) {
        // console.log('Column Names Array: ', obj[i]);
        // $('#r1').append("<td>" + obj[i] + "</td>");
        $('#r1').append("<td>" + obj[i] + "</td>");
    }
}

function getData(obj) {
    for (i = 0; i < obj.length; i++) {
        // console.log('Data Array: ', obj[i]);
        // console.log('Data Array date: ', obj[i][0]);
        // console.log('Data Array value: ', obj[i][1]);
        $('#wholeTable').append("<tr>" + "<td>" + obj[i][0] + "</td>" + "<td>" + obj[i][1] + "</td>" + "</tr>");
    }
}

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
        // get data returned from the PUT route
        console.log(data);

        // refresh the page we're on using GET to display the item details.
        window.location = url;
    });
});

$('.delete-link').on('click', function(e) {
    e.preventDefault();
    var element = $(this);
    var url = element.attr('href');
    $.ajax({
        method: 'DELETE',
        url: url
    }).done(function(data) {
        // get data returned from the DELETE route
        console.log(data);

        // go back to the homepage after deleting anything.
        window.location = '/';
    });
});
