let deg2rad = _deg => {
  return _deg * (Math.PI / 180);
};

let getDistanceFromLatLonInKm = (_lat, _long, _station) => {
  let R = 6371;

  let lat2 = _station[0];
  let lon2 = _station[1];

  let dLat = deg2rad(lat2 - _lat);
  let dLon = deg2rad(lon2 - _long);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(_lat)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km

  return d;
};

module.exports = getDistanceFromLatLonInKm;
