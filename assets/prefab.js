const convert = require("xml-js");
const choosenStations = require("./chooseStations");

let obj = {
  temperature: 0,
  humidity: 0,
  type: ""
};

let modelTypes = {
  model: "model",
  closest: "closest"
};

let averageArr = arr => {
  var sum = arr.reduce((a, b) => {
    return a + b;
  });

  return sum / arr.length;
};

module.exports = (lat, long, _armagData) => {
  let convertedArmag = JSON.parse(convert.xml2json(_armagData, { compact: true, spaces: 2 }));

  let curDate = new Date();
  let currentTimeZoneOffsetInHours = curDate.getTimezoneOffset() / 60;
  let curHours = curDate.getHours();
  let curTime = curHours - currentTimeZoneOffsetInHours;

  console.log("curTime1 ", currentTimeZoneOffsetInHours);
  console.log("curTime2 ", curHours);
  console.log("curTime3 ", curTime);

  let temperature = [];
  let humidity = [];

  if (curTime == 24) {
    curTime = 0;
  }

  var choosenStationsID = choosenStations(lat, long);
  console.log("choosenStationsID", choosenStationsID);

  var armagEntity = convertedArmag.document.station;
  let hourElem = 48 + parseInt(curTime);

  choosenStationsID.forEach((e, i) => {
    var curStation = armagEntity[e].substance;

    if (curStation) {
      curStation.forEach((ce, ci) => {
        var splited = [];
        var chooseHourFromSplitted = 0;

        if (ce._attributes.type == "WILG") {
          splited = ce._text.split("|");
          chooseHourFromSplitted = parseFloat(splited[hourElem]);

          humidity.push(chooseHourFromSplitted);
        }
        if (ce._attributes.type == "TEMP") {
          splited = ce._text.split("|");
          chooseHourFromSplitted = parseFloat(splited[hourElem]);

          temperature.push(chooseHourFromSplitted);
        }
      });
    }
  });

  obj.humidity = humidity.length > 0 ? averageArr(humidity) : 0;
  obj.temperature = temperature.length > 0 ? averageArr(temperature) : 0;
  obj.type = choosenStationsID.length > 0 ? modelTypes.model : modelTypes.closest;

  return obj;
};
