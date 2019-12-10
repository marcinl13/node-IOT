const fetch = require("node-fetch");
const convert = require("xml-js");

let parseRemoteXML = async _url => {
  const response = await fetch(_url);
  const text = await response.text();
  const data = convert.xml2js(text, { compact: true });
  return data;
};

module.exports = parseRemoteXML;
