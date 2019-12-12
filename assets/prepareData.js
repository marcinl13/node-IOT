const choosenStations = require("./chooseStations");

let getDataFromHour = (_arr, _hour) => {
  let data = 0;
  let invalidData = -999;

  for (let i = 0; i < _arr.length; i++) {
    if (parseFloat(_arr[_hour - i]) > invalidData) {
      data = parseFloat(_arr[_hour - i]);
    }
  }

  return data;
};

module.exports = (_latitude, _longitude, _data) => {
  let convertedArmag = _data[0];
  let convertedArmagPM = _data[1]; //pms

  let curDate = new Date();
  let curHours = curDate.getHours();
  let curTime = curHours == 24 ? 0 : curHours;
  let hourElem = 48 + parseInt(curTime);

  let pm10 = [];
  let humidity = [];
  let temperature = [];

  let choosenStationsID = choosenStations(_latitude, _longitude);

  let armagEntity = convertedArmag.document.station;
  let armagEntityPM = convertedArmagPM.document.station;

  choosenStationsID.forEach((e, i) => {
    let curStation = armagEntity[e].substance;
    let curStationPM = armagEntityPM[e].substance;
    let splited = [];

    if (curStation) {
      curStation.forEach((ce, ci) => {
        if (ce._attributes.type == "WILG") {
          splited = ce._text.split("|");

          humidity.push(getDataFromHour(splited, hourElem));
        }
        if (ce._attributes.type == "TEMP") {
          splited = ce._text.split("|");

          temperature.push(getDataFromHour(splited, hourElem));
        }
      });
    }

    if (typeof curStationPM != "undefined" && typeof curStationPM != undefined) {
      for (let index = 0; index < curStationPM.length; index++) {
        if (curStationPM[index]._attributes.type == "PM10") {
          splited = curStationPM[index]._text.split("|");

          pm10.push(getDataFromHour(splited, hourElem));
        }
      }
    }
  });

  return { choosenStationsID, pm10, humidity, temperature };
};
