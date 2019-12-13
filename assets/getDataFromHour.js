const INVALID_DATA = -999;

let getDataFromHour = (_arr, _hour) => {
  let data = 0;

  for (let i = 0; i < _arr.length; i++) {
    if (parseFloat(_arr[_hour - i]) > INVALID_DATA) {
      data = parseFloat(_arr[_hour - i]);
    }
  }

  return data;
};

module.exports = getDataFromHour;
