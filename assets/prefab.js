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

  console.log("lat, long", lat, long);

  var choosenStationsID = choosenStations(lat, long).stationList || [];
  console.log("choosenStationsID", choosenStationsID);

  var armagEntity = convertedArmag.document.station;
  let hourElem = 48 + parseInt(curTime);

  console.log("hourElem", hourElem);

  choosenStationsID.forEach((e, i) => {
    var curStation = armagEntity[e].substance;

    if (curStation) {
      curStation.forEach((ce, ci) => {
        console.log(ce);

        var splited = [];
        var chooseHourFromSplitted = 0;

        if (ce._attributes.type == "WILG") {
          splited = ce._text.split("|");
          chooseHourFromSplitted = parseFloat(splited[hourElem]);

          humidity.push(chooseHourFromSplitted);
        }
        if (ce._attributes.type == "TEMP") {
          splited = ce._text.split("|");
          chooseHourFromSplitted = parseFloat(splited[hourElem]);

          temperature.push(chooseHourFromSplitted);
        }
      });
    }
  });

  console.log("hum & temp", humidity, temperature);

  obj.humidity = humidity.length > 0 ? averageArr(humidity) : 0;
  obj.temperature = temperature.length > 0 ? averageArr(temperature) : 0;
  obj.type = choosenStationsID.length > 0 ? modelTypes.model : modelTypes.closest;

  return obj;
};
