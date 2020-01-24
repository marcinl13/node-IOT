const {
  stationsList,
  closestStations,
  chooseStations,
  getDataFromHour,
  getCurTime,
  arrayAverage,
  getLocationTemperature,
  locationMath,
  chooseTriangle,
  weightedAverage,
  triangularInterpolation,
  createVector
} = require("../assets/common");

module.exports = (_latitude, _longitude, _data, _isDebug = false) => {
  let convertedArmag = _data[0];
  let convertedArmagPM = _data[1]; //pms

  let armagEntity = convertedArmag.document.station;
  let armagEntityPM = convertedArmagPM.document.station;

  let hourElem = getCurTime();
  let point = (_latitude + _longitude) / 2;

  let response = [];

  let closestStation = [];
  closestStation.push(closestStations(_latitude, _longitude));

  let stations = [
    { type: "model", list: stationsList }, // model
    { type: "closest", list: closestStation }, //closest:
    { type: "average", list: chooseStations(_latitude, _longitude) }, //average:
    { type: "triangle", list: chooseTriangle(_latitude, _longitude) } //triangle dynamic search
  ];

  stations.forEach((elem, index) => {
    let type = elem.type;

    let choosenStationsID = [];

    let locations1 = [];
    let locations2 = [];
    let locations3 = [];

    let pm10 = [];
    let humidity = [];
    let temperature = [];

    elem.list.forEach((e, i) => {
      let id = elem.type !== "model" ? e : i;

      let curStation = armagEntity[id].substance;
      let curStationPM = armagEntityPM[id].substance;
      let splited = [];

      if (curStation) {
        curStation.forEach((ce, ci) => {
          if (ce._attributes.type == "WILG") {
            splited = ce._text.split("|");

            locations1.push(locationMath(e));
            humidity.push(getDataFromHour(splited, hourElem));
          }
          if (ce._attributes.type == "TEMP") {
            splited = ce._text.split("|");

            locations2.push(locationMath(e));
            choosenStationsID.push(i);
            temperature.push(getDataFromHour(splited, hourElem));
          }
        });
      }

      if (typeof curStationPM != "undefined" && typeof curStationPM != undefined) {
        for (let index = 0; index < curStationPM.length; index++) {
          if (curStationPM[index]._attributes.type == "PM10") {
            splited = curStationPM[index]._text.split("|");

            locations3.push(locationMath(e));
            pm10.push(getDataFromHour(splited, hourElem));
          }
        }
      }
    });

    var prefab = {};

    if (type == "model") {
      prefab = {
        humidity: getLocationTemperature(locations1, humidity, point),
        temperature: getLocationTemperature(locations2, temperature, point),
        pm10: getLocationTemperature(locations3, pm10, point)
      };

      if (_isDebug) prefab.stations = choosenStationsID;

      response.push({ model: prefab });
    }
    if (type == "closest") {
      prefab = {
        humidity: humidity.length > 0 ? humidity[0] : 0,
        temperature: temperature.length > 0 ? temperature[0] : 0,
        pm10: pm10.length > 1 ? pm10[0] : ""
      };

      if (_isDebug) prefab.stations = elem.list;

      response.push({ closest: prefab });
    }
    if (type == "average") {
      prefab = {
        humidity: humidity.length > 1 ? arrayAverage(humidity) : 0,
        temperature: temperature.length > 1 ? arrayAverage(temperature) : 0,
        pm10: pm10.length > 1 ? arrayAverage(pm10) : ""
      };

      if (_isDebug) prefab.stations = elem.list;

      response.push({ average: prefab });
    }
    if (type == "triangle") {
      let point3 = createVector(_longitude, _latitude);

      prefab = {
        humidity: humidity.length == 3 ? triangularInterpolation(elem.list, humidity, point3) : 0,
        temperature: temperature.length == 3 ? triangularInterpolation(elem.list, temperature, point3) : 0,
        pm10: pm10.length === 3 ? triangularInterpolation(elem.list, pm10, point3) : ""
      };

      if (_isDebug) prefab.stations = elem.list;

      response.push({ triangle: prefab });
    }
  });

  return response;
};
