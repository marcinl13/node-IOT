const stations = require("./stationList");
const haversine = require("./method3/haversine")

module.exports = (_x, _y) => {
  let distanceArr = [];

  for (let i = 0; i < stations.length; i++) {
    let distance = haversine(_x, _y, stations[i]);
    nearestStation = i;

    distanceArr.push({ distance, nearestStation });
  }

  distanceArr = distanceArr.sort(function(a, b) {
    return a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0;
  });

  let stationList = [];

  for (let i = 0; i < 3; i++) {
    stationList.push(distanceArr[i].nearestStation);
  }

  return stationList;
};
