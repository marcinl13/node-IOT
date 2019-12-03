const armaagParsed = require("./armaagParsed");

let obj = {
  lat: 1,
  long: 1,
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

//add checking triangle from cords position

module.exports = (req, res, next) => {
  let latitude = req.params.latitude ? req.params.latitude : 0;
  let longitude = req.params.longitude ? req.params.longitude : 0;

  let temperature = [];
  let humidity = [];

  let curTime = new Date().getHours();

  //24 first elem
  if (curTime == 24) {
    curTime = 0;
  }

  let choosenStations = [0];
  let hourElem = 48 + parseInt(curTime);


  /**
   * add code to check stations is near by coords 
   * 
   * if yes then add to choosenStations elem of those
   * else the nearest
   * 
   */

  for (let i = 0; i < choosenStations.length; i++) {
    var splited = armaagParsed().document.station[choosenStations[i]].substance[2]["_text"].split("|"); //temp
    var hourVal = splited[hourElem];
    temperature.push(hourVal);

    splited = armaagParsed().document.station[choosenStations[i]].substance[3]["_text"].split("|"); //wilg
    hourVal = splited[hourElem];
    humidity.push(hourVal);
  }

  obj.lat = latitude;
  obj.long = longitude;
  obj.humidity = averageArr(humidity);
  obj.temperature = averageArr(temperature);

  // triangle or closest
  if (choosenStations.length > 1) {
    obj.type = modelTypes.model;
  } else {
    obj.type = modelTypes.closest;
  }

  res.send(obj);
};
