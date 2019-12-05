const convert = require("xml-js");
const choosenStations = require("./chooseStations");

let obj = {
  temperature: 0,
  humidity: 0,
  type: ""
};

let modelTypes = {
  model: "model",
  closest: "closest"
};

let averageArr = arr => {
  var sum = arr.reduce((a, b) => {
    return a + b;
  });

  return sum / arr.length;
};

module.exports = (lat, long, _armagData) => {
  let convertedArmag = JSON.parse(convert.xml2json(_armagData, { compact: true, spaces: 2 }));

  let curTime = new Date().getHours();
  let temperature = [];
  let humidity = [];

  if (curTime == 24) {
    curTime = 0;
  }

  var choosenStationsID = choosenStations(lat, long).stationList || [];
  var armagEntity = convertedArmag.document.station;
  let hourElem = 48 + parseInt(curTime);

  choosenStationsID.forEach((e, i) => {
    var curStation = armagEntity[e].substance;

    if (curStation) {
      curStation.forEach((e, i) => {
        if (e._attributes.type == "WILG") {
          var splitedHum = e._text.split("|");
          var chooseHourFromSplitted = parseFloat(splitedHum[hourElem]);

          humidity.push(chooseHourFromSplitted);
        }
        if (e._attributes.type == "TEMP") {
          var splitedTemp = e._text.split("|");
          var chooseHourFromSplitted = parseFloat(splitedTemp[hourElem]);

          temperature.push(chooseHourFromSplitted);
        }
      });
    }
  });

  obj.humidity = humidity.length > 0 ? averageArr(humidity) : 0;
  obj.temperature = temperature.length > 0 ? averageArr(temperature) : 0;
  obj.type = choosenStationsID.length > 0 ? modelTypes.model : modelTypes.closest;

  return obj;
};
