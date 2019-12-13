const calculateData = require("./method1/prepareData1");
const calculateData2 = require("./method2/prepareData2");
const calculateData3 = require("./method3/prepareData3");



/**
 * _armaagData [hum&temp, pm]
 */
module.exports = (_lat, _long, _armagData) => {
  var posibility1 = calculateData(_lat, _long, _armagData);
  var posibility2 = calculateData2(_lat, _long, _armagData);
  var posibility3 = calculateData3(_lat, _long, _armagData);

  // if (obj.temperature < INVALID_DATA) return new Error("Brak danych");

  return { posibility1, posibility2, posibility3 };
};
