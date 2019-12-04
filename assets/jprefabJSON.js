const armaagParsed = require("./armaagParsed");
const choosenStationsList = require("./chooseStations");

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

module.exports = (req, res, next) => {
  let latitude = req.params.latitude ? req.params.latitude : 0;
  let longitude = req.params.longitude ? req.params.longitude : 0;

  let temperature = [];
  let humidity = [];

  let armaagData = armaagParsed();
  let curTime = new Date().getHours();

  //24 first elem
  if (curTime == 24) {
    curTime = 0;
  }

  let hourElem = 48 + parseInt(curTime);
  let choosenStationsID = [0, 4, 8];

  /**
   * add code to check stations is near by coords
   *
   * if yes then add to choosenStations elem of those
   * else the nearest
   *
   */

  const choose_Stations = choosenStationsList(latitude, longitude);
  choosenStationsID = choose_Stations.stationList;

  for (let i = 0; i < choosenStationsID.length; i++) {
    var stationData = armaagData.document.station[choosenStationsID[i]].substance;
    var buffer = [];
    var stationDataFromHour = 0;

    for (let j = 0; j < stationData.length; j++) {
      if (stationData[j]._attributes.type == "WILG") {
        buffer = armaagData.document.station[choosenStationsID[i]].substance[3]["_text"].split("|");

        stationDataFromHour = buffer[hourElem];

        humidity.push(parseFloat(stationDataFromHour));

        //reset
        buffer = [];
        stationDataFromHour = 0;
      }
      if (stationData[j]._attributes.type == "TEMP") {
        buffer = armaagData.document.station[choosenStationsID[i]].substance[2]["_text"].split("|");

        stationDataFromHour = buffer[hourElem];

        temperature.push(parseFloat(stationDataFromHour));

        //reset
        buffer = [];
        stationDataFromHour = 0;
      }
    }
  }

  obj.humidity = humidity.length > 0 ? averageArr(humidity) : 0;
  obj.temperature = temperature.length > 0 ? averageArr(temperature) : 0;

  // triangle or closest
  if (choosenStationsID.length > 1) {
    obj.type = modelTypes.model;
  } else {
    obj.type = modelTypes.closest;
  }

  res.send(obj);
};
