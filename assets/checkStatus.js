const { parseRemoteXML } = require("./common");

let checkStatus = async (req, res, next) => {
  let acceptableAmountOfStations = 9;

  await Promise.all([
    parseRemoteXML("https://armaag.gda.pl/data/xml/weather.xml"), // temperature & humidity
    parseRemoteXML("https://armaag.gda.pl/data/xml/stacje_porownawcze.xml") // pm10
  ]).then(response => {
    if (
      response[0].document.station.length === acceptableAmountOfStations &&
      response[1].document.station.length === acceptableAmountOfStations
    ) {
      res.send({ status: "ok" });
    } else {
      res.send({ status: "error", message: "dane niekompletne" });
    }
  });
};

module.exports = checkStatus;
