const express = require("express");
const https = require("https");

const router = express.Router();
const prefab = require("../assets/prefab");

/** GET coords
 * Latitude N/S
 * Longitude E/W
 */

router.get("/:latitude/:longitude", (req, res, next) => {
  let latitude = req.params.latitude ? parseFloat(req.params.latitude) : 0;
  let longitude = req.params.longitude ? parseFloat(req.params.longitude) : 0;

  console.log(latitude, longitude);

  var data = "";
  https.get("https://armaag.gda.pl/data/xml/weather_wszystko2.xml", function(response) {
    if (response.statusCode >= 200 && response.statusCode < 400) {
      response.on("data", function(data_) {
        data += data_.toString();
      });
      response.on("end", function() {
        var result = prefab(latitude, longitude, data);

        if (result.temperature > 300) {
          res.status(400);
          res.send("Brak Danych")
        } else {
          res.status(200);
          res.send(result);
        }
        
      });
    }
  });
});

module.exports = router;
