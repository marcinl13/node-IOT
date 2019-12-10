const https = require("https");
const convert = require("xml-js");

let getDataJSON = _url => {
  return new Promise((resolve, reject) => {
    var data = "";

    https.get(_url, response => {
      if (response.statusCode >= 200 && response.statusCode < 400) {
        response.on("data", data_ => {
          data += data_.toString();
        });
        response.on("end", () => {
          let convertedArmag = JSON.parse(convert.xml2json(data, { compact: true, spaces: 2 }));
          
          resolve(convertedArmag);
        });
      }
    });
  });
};

module.exports = getDataJSON;
