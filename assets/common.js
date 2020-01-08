const fetch = require("node-fetch");
const convert = require("xml-js");

const INVALID_DATA = -999;

const stationsList = [
  [54.35678, 18.62882], // Gdańsk Śródmieście 0
  [54.3743, 18.70246], // Gdańsk Stogi  1
  [54.39802, 18.66587], // Gdańsk Nowy Port 2
  [54.56266, 18.48892], // Gdynia Pogorze 3
  [54.32884, 18.55559], // Gdańsk Szadołki  4
  [54.43333, 18.5811], // Sopot 5
  [54.37875, 18.61947], // Gdańsk Wrzeszcz  6
  [54.46696, 18.4634], // Gdynia Śródmieście 7
  [54.47429, 18.45881] // Gdynia Dąbrowa 8
];

const arrayAverage = array => {
  return array.reduce((a, b) => a + b) / array.length;
};

const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

const getDataFromHour = (_arr, _hour) => {
  let data = 0;

  for (let i = 0; i < _arr.length; i++) {
    if (parseFloat(_arr[_hour - i]) > INVALID_DATA) {
      data = parseFloat(_arr[_hour - i]);
    }
  }

  return data;
};

const parseRemoteXML = async url => {
  const response = await fetch(url);
  const text = await response.text();
  return convert.xml2js(text, { compact: true });
};

const getDistanceFromLatLonInKm = (_lat, _long, _station) => {
  let R = 6371;

  let lat2 = _station[0];
  let lon2 = _station[1];

  let dLat = deg2rad(lat2 - _lat);
  let dLon = deg2rad(lon2 - _long);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(_lat)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  return d;
};

const getLocationTemperature = (_location, _temperature, _point) => {
  var t;
  var y = 0;

  for (let k = 0; k < _location.length; k++) {
    t = 1.0;
    for (let j = 0; j < _location.length; j++) {
      if (j != k) {
        t = t * ((_point - _location[j]) / (_location[k] - _location[j]));
      }
    }
    y += t * _temperature[k];
  }

  return y;
};

const closestStations = (_latitude, _longitude) => {
  let stationsDistances = [];

  stationsList.forEach((coords, id) => {
    let distance = getDistanceFromLatLonInKm(_latitude, _longitude, coords);

    stationsDistances.push({ dist: distance, stationID: id });
  });

  stationsDistances.sort((a, b) => a.dist - b.dist);

  return stationsDistances[0].stationID;
};

const chooseStations = (_x, _y) => {
  let distanceArr = [];

  for (let i = 0; i < stationsList.length; i++) {
    let distance = getDistanceFromLatLonInKm(_x, _y, stationsList[i]);
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

const getCurTime = _curHours => {
  let curDate = new Date();
  let curHours = curDate.getHours();
  let curTime = curHours == 24 ? 0 : curHours;
  let hourElem = 48 + parseInt(curTime);

  return hourElem;
};

const locationMath = _stationCords => {
  return (_stationCords[0] + _stationCords[1]) / 2;
};

const weightedAverage = (_triangleStations, _values, _customPoint) => {
  let topToPointDistance = getDistanceFromLatLonInKm(
    _customPoint[0],
    _customPoint[1],
    stationsList[_triangleStations[0]]
  );
  let leftToPointDistance = getDistanceFromLatLonInKm(
    _customPoint[0],
    _customPoint[1],
    stationsList[_triangleStations[1]]
  );
  let rightToPointDistance = getDistanceFromLatLonInKm(
    _customPoint[0],
    _customPoint[1],
    stationsList[_triangleStations[2]]
  );

  let customPointTemp =
    (topToPointDistance * _values[0] + leftToPointDistance * _values[1] + rightToPointDistance * _values[2]) /
    (topToPointDistance + leftToPointDistance + rightToPointDistance);

  return customPointTemp;
};

const chooseTriangle = (_latitude, _longitude) => {
  let availableTriangles = [
    [3, 8, 7],
    [7, 8, 5],
    [7, 5, 2],
    [5, 8, 4],
    [5, 6, 4],
    [6, 0, 4],
    [0, 4, 1],
    [6, 0, 1],
    [5, 6, 2],
    [2, 6, 1]
  ];

  console.log(chooseStations(_latitude, _longitude));

  return chooseStations(_latitude, _longitude);
};

module.exports = {
  stationsList,
  arrayAverage,
  deg2rad,
  getDataFromHour,
  getDistanceFromLatLonInKm,
  parseRemoteXML,
  getLocationTemperature,
  closestStations,
  chooseStations,
  getCurTime,
  locationMath,
  chooseTriangle,
  weightedAverage
};
