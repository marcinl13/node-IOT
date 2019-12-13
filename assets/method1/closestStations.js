const stationList = require("../stationList");

let closestStations = (_latitude, _longitude, _stationList) => {
  let stationsDistances = [];

  _stationList.forEach((coords, id) => {
    let distance = haversine(_latitude, _longitude, coords);

    stationsDistances.push({ dist: distance, stationID: id });
  });

  stationsDistances.sort((a, b) => a.dist - b.dist);

  return stationsDistances[0].stationID;
};

module.exports = (_latitude, _longitude) => {
  return closestStations(_latitude, _longitude, stationList);
};
