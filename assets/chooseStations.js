let stations = [
  [54.35678, 18.62882], //Gdańsk Śród
  [54.3743, 18.70246], //Gdańsk Stogi
  [0, 0], //Gdańsk Nowy port [54.398016, 18.665872]  no data
  [54.56266, 18.48892], //Gdynia Pogorze
  [54.32884, 18.55559], //Gdańsk Szadołki
  [54.43333, 18.5811], //Sopot Dolny Taras
  [54.37875, 18.61947], //Gdańsk Wrzeszcz
  [54.46696, 18.4634], //Gdynia Środ
  [53.96914, 18.517212], //Starogard Gdański
  [0, 0], //Kwidzyn no data
  [54.464298, 17.03126], //Słupsk
  [0, 0], //Kościerzyna  no data
  [54.035091, 19.048571], //Malbork
  [0, 0], //Lębork  no data
  [54.474297, 18.458813] //Gdynia Dąbrowa
];

function nearestSearch(_x, _y) {
  var distArr = [];

  for (let i = 0; i < stations.length; i++) {
    var distance = Math.pow(stations[i][0] - _x, 2) + Math.pow(stations[i][1] - _y, 2);

    distance = parseFloat(Math.sqrt(distance));
    nearestStation = i;

    distArr.push({ distance, nearestStation });
  }

  distArr = distArr.sort(function(a, b) {
    return a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0;
  });

  //
  let stationList = [];

  for (let i = 0; i < 3; i++) {
    stationList.push(distArr[i].nearestStation);
  }

  stationList = stationList.sort(function(a, b) {
    return a > b;
  });

  return { stationList };
}

module.exports = (_x, _y) => {
  //nearest
  return nearestSearch(_x, _y);
};
