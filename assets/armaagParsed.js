const convert = require("xml-js");
const getData = require("./xml");

module.exports = function() {
  return JSON.parse(convert.xml2json(getData(), { compact: true, spaces: 2 }));
};
