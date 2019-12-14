"use strict";
const { parseRemoteXML } = require("./common");

const calculateData = require("../methods/prepareData1");
const calculateData2 = require("../methods/prepareData2");
const calculateData3 = require("../methods/prepareData3");

const prepareData = async (latitude, longitude) => {
    const armaagData = await Promise.all([
        parseRemoteXML("https://armaag.gda.pl/data/xml/weather.xml"), // temperature & humidity
        parseRemoteXML("https://armaag.gda.pl/data/xml/stacje_porownawcze.xml") // pm10
    ]);

    var posibility1 = calculateData(latitude, longitude, armaagData);
    var posibility2 = calculateData2(latitude, longitude, armaagData);
    var posibility3 = calculateData3(latitude, longitude, armaagData);

    return {
        posibility1, posibility2, posibility3
    };
}

module.exports = prepareData;