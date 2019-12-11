const express = require("express");

const app = express();
const prefab = require("./assets/prefab");
const parseRemoteXML = require("./assets/parseRemoteXML");

const PORT = 5000;

promises = [
  parseRemoteXML("https://armaag.gda.pl/data/xml/weather.xml"), // temp & hum
  parseRemoteXML("https://armaag.gda.pl/data/xml/stacje_porownawcze.xml") // pm2.5 & pm10
];

/** GET coords
 * Latitude N/S
 * Longitude E/W
 */
app.get("/:latitude/:longitude", (req, res, next) => {
  let latitude = req.params.latitude ? parseFloat(req.params.latitude) : 0;
  let longitude = req.params.longitude ? parseFloat(req.params.longitude) : 0;

  Promise.all(promises).then(response => {
    let result = prefab(latitude, longitude, response);

    res.send(result);
  });
});

app.listen(PORT, () => console.log(`API listening on port ${PORT}!`))
