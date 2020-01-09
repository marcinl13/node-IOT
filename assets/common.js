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

const createVector = (_x, _y) => {
  return { x: _x, y: _y };
};

const mapStationPoints = () => {
  let stations = [...stationsList];

  return stations.map(p => {
    return createVector(p[1], p[0]);
  });
};

const ptInTriangle = (p, p0, p1, p2) => {
  const A = (1 / 2) * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
  const sign = A < 0 ? -1 : 1;
  const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
  const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

  return s > 0 && t > 0 && s + t < 2 * A * sign;
};

const area = (p0, p1, p2) => {
  return (1 / 2) * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
};

const pointDistance = (_p0, _p1) => {
  const a = _p0.x - _p1.x;
  const b = _p0.y - _p1.y;

  return Math.sqrt(a * a + b * b);
};

const smallestTriangle = (point, triangles) => {
  const ts = triangles.map(t => {
    return {
      area: Math.abs(area(...t)),
      distsum: pointDistance(point, t[0]) + pointDistance(point, t[1]) + pointDistance(point, t[2]),
      triangle: t
    };
  });

  ts.sort((a, b) => b.distsum - a.distsum).reverse();

  if (ts && ts[0]) return ts[0];
};

const dynamicTriangle = ({ lat, long }) => {
  let points = mapStationPoints();
  let triangles = [];

  //point searched
  // let searchedPoint = createVector(18.52882, 54.37); // example
  let searchedPoint = createVector(long, lat);

  for (let i = 0; i < points.length; i++) {
    const p0 = points[i];

    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[j];

      if (i !== j) {
        for (let k = j + 1; k < points.length; k++) {
          const p2 = points[k];

          if (j !== k && ptInTriangle(searchedPoint, p0, p1, p2)) {
            triangles.push([p0, p1, p2]);
          }
        }
      }
    }
  }

  let smallest = smallestTriangle(searchedPoint, triangles);

  let choosenStationsFromTriangle = [];
  if (smallest) {
    let t = smallest.triangle;

    points.forEach((e, i) => {
      if (
        (e.x === t[0].x && e.y === t[0].y) ||
        (e.x === t[1].x && e.y === t[1].y) ||
        (e.x === t[2].x && e.y === t[2].y)
      )
        choosenStationsFromTriangle.push(i);
    });
  }

  return choosenStationsFromTriangle;
};

const chooseTriangle = (_latitude, _longitude) => {
  return dynamicTriangle({ lat: _latitude, long: _longitude });
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
  weightedAverage,
  dynamicTriangle
};
