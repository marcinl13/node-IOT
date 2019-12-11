let stations = [
  [54.35678, 18.62882], //Gdańsk Śród
  [54.3743, 18.70246], //Gdańsk Stogi
  [54.398016, 18.665872], //Gdańsk Nowy port [54.398016, 18.665872]  no data
  [54.56266, 18.48892], //Gdynia Pogorze
  [54.32884, 18.55559], //Gdańsk Szadołki
  [54.43333, 18.5811], //Sopot
  [54.37875, 18.61947], //Gdańsk Wrzeszcz
  [54.46696, 18.4634], //Gdynia Środ
  [54.474297, 18.458813] //Gdynia Dąbrowa

  // [53.96914, 18.517212], //Starogard Gdański
  // [53.7263529, 18.9323043], //Kwidzyn
  // [54.464298, 17.03126], //Słupsk
  // [0, 0], //Kościerzyna  no data
  // [54.035091, 19.048571], //Malbork
  // [0, 0], //Lębork  no data
];

let deg2rad = _deg => {
  return _deg * (Math.PI / 180);
};

let getDistanceFromLatLonInKm = (_lat, _long, station) => {
  let R = 6371;

  let lat2 = station[0];
  let lon2 = station[1];

  let dLat = deg2rad(lat2 - _lat);
  let dLon = deg2rad(lon2 - _long);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(_lat)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km

  return d;
};

let nearestSearch = (_x, _y) => {
  let distArr = [];

  for (let i = 0; i < stations.length; i++) {
    let distance = getDistanceFromLatLonInKm(_x, _y, stations[i]);
    nearestStation = i;

    distArr.push({ distance, nearestStation });
  }

  distArr = distArr.sort(function(a, b) {
    return a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0;
  });

  let stationList = [];

  for (let i = 0; i < 3; i++) {
    stationList.push(distArr[i].nearestStation);
  }

  return stationList;
};

module.exports = (_x, _y) => {
  //nearest
  return nearestSearch(_x, _y);
};
