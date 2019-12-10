const express = require("express");
const createError = require("http-errors");

const app = express();
const prefab = require("./assets/prefab");
const getDataJSON = require("./assets/getDataJSON");

/** GET coords
 * Latitude N/S
 * Longitude E/W
 */

promises = [
  getDataJSON("https://armaag.gda.pl/data/xml/weather_wszystko2.xml"), // temp&hum
  getDataJSON("https://armaag.gda.pl/data/xml/stacje_porownawcze.xml") // pm2.5 & pm10
];

app.get("/:latitude/:longitude", (req, res, next) => {
  let latitude = req.params.latitude ? parseFloat(req.params.latitude) : 0;
  let longitude = req.params.longitude ? parseFloat(req.params.longitude) : 0;

  Promise.all(promises).then(response => {
    let result = prefab(latitude, longitude, response);

    res.send(result);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
  return;
});

module.exports = app;
