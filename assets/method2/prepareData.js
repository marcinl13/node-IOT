const stations = require("../stationList");
const getDataFromHour = require("../getDataFromHour");
const getLocationTemperature = require("./getLocationTemperature");

let locationMath = _stationCords => {
  return (_stationCords[0] + _stationCords[1]) / 2;
};

module.exports = (_latitude, _longitude, _data) => {
  let point = (_latitude + _longitude) / 2;

  let curDate = new Date();
  let curHours = curDate.getHours();
  let curTime = curHours == 24 ? 0 : curHours;
  let hourElem = 48 + parseInt(curTime);

  let locations = [];
  let locations2 = [];
  let choosenStationsID = [];

  let humidity = [];
  let temperature = [];
  let splited = [];

  let convertedArmag = _data[0];
  let armagEntity = convertedArmag.document.station;

  stations.forEach((e, i) => {
    let curStation = armagEntity[i].substance;

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
  });

  return {
    humidity: getLocationTemperature(locations2, humidity, point),
    temperature: getLocationTemperature(locations, temperature, point),
    stations: choosenStationsID,
    model: "model"
  };
};
