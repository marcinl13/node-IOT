const { stationsList, getDataFromHour, getLocationTemperature } = require("../assets/common");
let stations = stationsList;

let locationMath = _stationCords => {
  return (_stationCords[0] + _stationCords[1]) / 2;
};

module.exports = (_latitude, _longitude, _data, _isDebug = false) => {
  let point = (_latitude + _longitude) / 2;

  let curDate = new Date();
  let curHours = curDate.getHours();
  let curTime = curHours == 24 ? 0 : curHours;
  let hourElem = 48 + parseInt(curTime);

  let locations = [];
  let locations2 = [];
  let locations3 = [];
  let choosenStationsID = [];

  let pm10 = [];
  let humidity = [];
  let temperature = [];

  let convertedArmag = _data[0];
  let convertedArmagPM = _data[1];

  let armagEntity = convertedArmag.document.station;
  let armagEntityPM = convertedArmagPM.document.station;

  stations.forEach((e, i) => {
    let curStation = armagEntity[i].substance;
    let curStationPM = armagEntityPM[i].substance;
    let splited = [];

    if (curStation) {
      curStation.forEach((ce, ci) => {
        if (ce._attributes.type == "WILG") {
          splited = ce._text.split("|");

          locations2.push(locationMath(e));
          humidity.push(getDataFromHour(splited, hourElem));
        }
        if (ce._attributes.type == "TEMP") {
          splited = ce._text.split("|");

          locations.push(locationMath(e));
          choosenStationsID.push(i);
          temperature.push(getDataFromHour(splited, hourElem));
        }
      });
    }

    if (typeof curStationPM != "undefined" && typeof curStationPM != undefined) {
      for (let i = 0; i < curStationPM.length; i++) {
        if (curStationPM[i]._attributes.type == "PM10") {
          splited = curStationPM[i]._text.split("|");

          locations3.push(locationMath(e));
          pm10.push(getDataFromHour(splited, hourElem));
        }
      }
    }
  });

  let response = {
    humidity: getLocationTemperature(locations2, humidity, point),
    temperature: getLocationTemperature(locations, temperature, point),
    pm10: getLocationTemperature(locations3, pm10, point)
  };
  
  if (_isDebug) response.stations = choosenStationsID;

  return response;
};
