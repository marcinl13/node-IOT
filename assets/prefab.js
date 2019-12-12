const choosenStations = require("./chooseStations");
const calculate = require("./prepareData");

const INVALID_DATA = -999;
const DEFAULT_DATA = 0;

let obj = {
  temperature: DEFAULT_DATA,
  humidity: DEFAULT_DATA,
  pm10: [],
  stations: [],
  type: ""
};

let modelTypes = {
  model: "model",
  closest: "closest"
};

let averageArr = arr => {
  let sum = arr.reduce((a, b) => {
    return a + b;
  });

  return sum / arr.length;
};

/**
 * _armaagData [hum&temp, pm]
 */
module.exports = (_lat, _long, _armagData) => {
  var { choosenStationsID, pm10, humidity, temperature } = calculate(_lat, _long, _armagData);

  obj.humidity = humidity.length > 1 ? averageArr(humidity) : 0;
  obj.temperature = temperature.length > 1 ? averageArr(temperature) : 0;

  obj.pm10 = pm10.length > 1 ? averageArr(pm10) : "";

  obj.type = humidity.length > 1 ? modelTypes.model : modelTypes.closest;
  obj.stations = choosenStationsID;

  if (obj.temperature < INVALID_DATA) return new Error("Brak danych");

  return obj;
};
