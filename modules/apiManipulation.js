function parseJson(object) {
    var colmnNamesArrays = object.dataset.column_names;
    // getColumns(colmnNamesArray);
    var dataArray = object.dataset.data;
    // getData(dataArray);
}

module.exports = {
    parseJson: parseJson,
    // getColumns: getColumns,
    // getData: getData
};
