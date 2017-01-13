function parseJson(object) {
    // console.log(object);
    console.log('object.dataset.column_names: ', object.dataset.column_names);
    var colmnNamesArrays = object.dataset.column_names;
    // getColumns(colmnNamesArray);
    // console.log('object.dataset.data :', object.dataset.data);
    var dataArray = object.dataset.data;
    // getData(dataArray);
}



module.exports = {
    parseJson: parseJson,
    // getColumns: getColumns,
    // getData: getData
};
