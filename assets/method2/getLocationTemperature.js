let getLocationTemperature = (_location, _temperature, _point) => {
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

module.exports = getLocationTemperature;
