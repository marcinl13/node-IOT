const choosenStations = require("./chooseStations");

const INVALID_DATA = -999;
const DEFAULT_DATA = 0;

let obj = {
  temperature: DEFAULT_DATA,
  humidity: DEFAULT_DATA,
  pm2_5: [],
  pm10: [],
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

/**
 * _armaagData [hum&temp, pm]
 */
module.exports = (lat, long, _armagData) => {
  let convertedArmag = _armagData[0];

  let curDate = new Date();
  let curHours = curDate.getHours();
  let curTime = curHours == 24 ? 0 : curHours;
  let hourElem = 48 + parseInt(curTime);

  let pm10 = [];
  let pm2_5 = [];

  let humidity = [];
  let temperature = [];

  let choosenStationsID = choosenStations(lat, long);

  let armagEntity = convertedArmag.document.station;

  choosenStationsID.forEach((e, i) => {
    let curStation = armagEntity[e].substance;

    if (curStation) {
      curStation.forEach((ce, ci) => {
        var splited = [];
        var chooseHourFromSplitted = 0;

        if (ce._attributes.type == "WILG") {
          splited = ce._text.split("|");

          console.log(parseFloat(splited[hourElem]) <= INVALID_DATA);
          console.log(parseFloat(splited[hourElem - 2]));
          console.log(parseFloat(splited[hourElem - 1]));
          console.log(parseFloat(splited[hourElem]));

          chooseHourFromSplitted =
            parseFloat(splited[hourElem]) <= INVALID_DATA
              ? parseFloat(splited[hourElem - 1])
              : parseFloat(splited[hourElem]);

          if (chooseHourFromSplitted != INVALID_DATA) humidity.push(chooseHourFromSplitted);
        }
        if (ce._attributes.type == "TEMP") {
          splited = ce._text.split("|");
          chooseHourFromSplitted =
            parseFloat(splited[hourElem]) <= INVALID_DATA
              ? parseFloat(splited[hourElem - 1])
              : parseFloat(splited[hourElem]);

          if (chooseHourFromSplitted != INVALID_DATA) temperature.push(chooseHourFromSplitted);
        }
      });
    }
  });

  obj.humidity = humidity; //.length > 0 ? averageArr(humidity) : 0;
  obj.temperature = temperature; //.length > 0 ? averageArr(temperature) : 0;

  obj.pm10 = pm10; //.length > 0 ? averageArr(pm10) : 0;
  obj.pm2_5 = pm2_5; //.length > 0 ? averageArr(pm2_5) : 0;

  obj.type = humidity.length > 0 ? modelTypes.model : modelTypes.closest;
  obj.stations = choosenStationsID;

  if (obj.temperature < INVALID_DATA) return new Error("Brak danych");

  return obj;
};
