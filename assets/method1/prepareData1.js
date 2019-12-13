let getDataFromHour = require("../getDataFromHour");
let closestStations = require("./closestStations");

const INVALID_DATA = -999;

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

  if (curStation) {
    let splited = [];

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

  let response = {
    humidity: humidity,
    temperature: temperature,
    pm10: pm10,
    stations: choosenStationsID,
    type: "closest"
  };

  if (response.temperature <= INVALID_DATA || response.humidity <= INVALID_DATA) return new Error("Brak danych");

  return response;
};
