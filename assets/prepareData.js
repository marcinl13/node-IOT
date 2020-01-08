"use strict";
const { parseRemoteXML } = require("./common");

const merged = require("../methods/merged");

const prepareData = async (latitude, longitude, isDebug = false) => {
  const armaagData = await Promise.all([
    parseRemoteXML("https://armaag.gda.pl/data/xml/weather.xml"), // temperature & humidity
    parseRemoteXML("https://armaag.gda.pl/data/xml/stacje_porownawcze.xml") // pm10
  ]);

  var posibility4 = merged(latitude, longitude, armaagData, isDebug);

  let closest = posibility4[1];
  let model = posibility4[0];
  let average = posibility4[2];
  let improved = posibility4[3];

  return {
    closest: closest.closest,
    model: model.model,
    average: average.average,
    improved: improved.improved
  };
};

module.exports = prepareData;
