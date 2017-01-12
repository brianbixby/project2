function parseJson(object) {
    // console.log(object);
    console.log('object.dataset.column_names: ', object.dataset.column_names);
    var colmnNamesArray = object.dataset.column_names;
    getColumns(colmnNamesArray);
    // console.log('object.dataset.data :', object.dataset.data);
    var dataArray = object.dataset.data;
    getData(dataArray);
}

function getColumns(col) {
    for (i = 0; i < col.length; i++) {
        // console.log('Column Names Array: ', col[i]);
        // document.getElementById('r1').append("<td>" + col[i] + "</td>");
    }
}

function getData(dataPoint) {
    for (i = 0; i < dataPoint.length; i++) {
        // console.log('Data Array: ', dataPoint[i]);
        // console.log('Data Array date: ', dataPoint[i][0]);
        // console.log('Data Array value: ', dataPoint[i][1]);
        // document.getElementById('wholeTable').append("<tr>" + "<td>" + dataPoint[i][0] + "</td>" + "<td>" + dataPoint[i][1] + "</td>" + "</tr>");
    }
}

module.exports = {
    parseJson: parseJson,
    getColumns: getColumns,
    getData: getData
};
