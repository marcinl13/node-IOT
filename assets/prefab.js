const calculateData = require("./method1/prepareData");
const calculateData2 = require("./method2/prepareData");
const calculateData3 = require("./method3/prepareData");

let obj = {
  temperature: 0,
  humidity: 0,
  pm10: [],
  stations: [],
  type: ""
};

/**
 * _armaagData [hum&temp, pm]
 */
module.exports = (_lat, _long, _armagData) => {
  var posibility1 = calculateData(_lat, _long, _armagData);
  var posibility2 = calculateData2(_lat, _long, _armagData);
  var posibility3 = calculateData3(_lat, _long, _armagData);

  // obj.pm10 = posibility1.pm10;
  // obj.humidity = posibility1.humidity;
  // obj.temperature = posibility1.temperature;
  // obj.stations = posibility1.choosenStationsID;
  // obj.type = posibility1.model;

  // if (obj.temperature < INVALID_DATA) return new Error("Brak danych");

  return { posibility1, posibility2, posibility3 };
};
