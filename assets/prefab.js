const calculate = require("./prepareData");

const DEFAULT_DATA = 0;
const INVALID_DATA = -999;

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

/**
 * _armaagData [hum&temp, pm]
 */
module.exports = (_lat, _long, _armagData) => {
  var { choosenStationsID, pm10, humidity, temperature } = calculate(_lat, _long, _armagData);

  obj.pm10 = pm10;
  obj.humidity = humidity;
  obj.temperature = temperature;
  obj.stations = choosenStationsID;
  obj.type = choosenStationsID.length > 1 ? modelTypes.model : modelTypes.closest;

  if (obj.temperature < INVALID_DATA) return new Error("Brak danych");

  return obj;
};
