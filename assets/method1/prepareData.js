const getDataFromHour = require("../getDataFromHour");
const responseModel = require("../responseModel");
const closestStations = require("./closestStations");

module.exports = (_latitude, _longitude, _data) => {
  let convertedArmag = _data[0];
  let convertedArmagPM = _data[1]; //pms

  let curDate = new Date();
  let curHours = curDate.getHours();
  let curTime = curHours == 24 ? 0 : curHours;
  let hourElem = 48 + parseInt(curTime);

  let pm10 = "";
  let humidity = 0;
  let temperature = 0;

  let choosenStationsID = closestStations(_latitude, _longitude);

  let armagEntity = convertedArmag.document.station;
  let armagEntityPM = convertedArmagPM.document.station;

  let curStation = armagEntity[choosenStationsID].substance;
  let curStationPM = armagEntityPM[choosenStationsID].substance;

  let splited = [];

  if (curStation) {
    curStation.forEach((ce, ci) => {
      if (ce._attributes.type == "WILG") {
        splited = ce._text.split("|");

        humidity = getDataFromHour(splited, hourElem);
      }
      if (ce._attributes.type == "TEMP") {
        splited = ce._text.split("|");

        temperature = getDataFromHour(splited, hourElem);
      }
    });
  }

  if (typeof curStationPM != "undefined" && typeof curStationPM != undefined) {
    for (let i = 0; i < curStationPM.length; i++) {
      if (curStationPM[i]._attributes.type == "PM10") {
        splited = curStationPM[i]._text.split("|");

        pm10 = getDataFromHour(splited, hourElem);
      }
    }
  }

  responseModel.stations = choosenStationsID;
  responseModel.pm10 = pm10.length > 1 ? averageArr(pm10) : "";
  responseModel.humidity = humidity.length > 1 ? averageArr(humidity) : 0;
  responseModel.temperature = temperature.length > 1 ? averageArr(temperature) : 0;
  responseModel.type = "closest";

  // if (obj.temperature < INVALID_DATA) return new Error("Brak danych");
  
  return responseModel;
};
