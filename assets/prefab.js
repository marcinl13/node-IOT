const convert = require("xml-js");
const choosenStations = require("./chooseStations");

const INVALID_DATA = -999;

let obj = {
  temperature: INVALID_DATA,
  humidity: INVALID_DATA,
  stations: [],
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

  let curDate = new Date();
  let curHours = curDate.getHours();
  let curTime = curHours;

  let temperature = [];
  let humidity = [];

  if (curTime == 24) {
    curTime = 0;
  }

  var choosenStationsID = choosenStations(lat, long);
    
  var armagEntity = convertedArmag.document.station;
  let hourElem = 48 + parseInt(curTime);

  choosenStationsID.forEach((e, i) => {
    var curStation = armagEntity[e].substance;

    if (curStation) {
      curStation.forEach((ce, ci) => {
        var splited = [];
        var chooseHourFromSplitted = 0;

        if (ce._attributes.type == "WILG") {
          splited = ce._text.split("|");
          chooseHourFromSplitted = parseFloat(splited[hourElem])<=INVALID_DATA ? parseFloat(splited[hourElem-1]) : parseFloat(splited[hourElem]);
          
          humidity.push(chooseHourFromSplitted);
        }
        if (ce._attributes.type == "TEMP") {
          splited = ce._text.split("|");
          chooseHourFromSplitted = parseFloat(splited[hourElem])<=INVALID_DATA ? parseFloat(splited[hourElem-1]) : parseFloat(splited[hourElem]);
          
          temperature.push(chooseHourFromSplitted);
        }
      });
    }
  });

  obj.humidity = humidity.length > 0 ? averageArr(humidity) : 0;
  obj.temperature = temperature.length > 0 ? averageArr(temperature) : 0;
  obj.type = choosenStationsID.length > 0 ? modelTypes.model : modelTypes.closest;
  obj.stations = choosenStationsID;
  
  if (obj.temperature < INVALID_DATA) return new Error("Brak danych");

  return obj;
};
