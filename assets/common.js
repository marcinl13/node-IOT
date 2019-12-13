const fetch = require("node-fetch");
const convert = require("xml-js");

const INVALID_DATA = -999;

const stationsList = [
    [54.35678, 18.62882], // Gdańsk Śródmieście
    [54.37430, 18.70246], // Gdańsk Stogi
    [54.39802, 18.66587], // Gdańsk Nowy Port
    [54.56266, 18.48892], // Gdynia Pogorze
    [54.32884, 18.55559], // Gdańsk Szadołki
    [54.43333, 18.58110], // Sopot
    [54.37875, 18.61947], // Gdańsk Wrzeszcz
    [54.46696, 18.46340], // Gdynia Śródmieście
    [54.47429, 18.45881]  // Gdynia Dąbrowa
];

const arrayAverage = array => {
    return array.reduce((a,b) => a + b) / array.length;
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


module.exports = {
    stationsList, arrayAverage, deg2rad, getDataFromHour, getDistanceFromLatLonInKm, parseRemoteXML, getLocationTemperature, closestStations, chooseStations
};
