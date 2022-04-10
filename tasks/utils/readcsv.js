const CsvReader = require('promised-csv');


function readCSV(inputFile) {
    return new Promise((resolve, reject) => {

        var reader = new CsvReader();
        var output = [];

        reader.on('row', data => {
            // data is an array of data. You should
            // concatenate it to the data set to compile it.
            output = output.concat(data);
        });

        reader.on('done', () => {
            // output will be the compiled data set.
            resolve(output);
        });

        reader.on('error', err => reject(err));

        reader.read(inputFile);

    });
}

module.exports = {
    readCSV: readCSV
  }