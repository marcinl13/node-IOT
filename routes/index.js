const express = require("express");
const https = require("https");

const router = express.Router();
const prefab = require("../assets/prefab");


/** GET coords
 * Latitude N/S
 * Longitude E/W
 */

router.get("/:latitude/:longitude", (req, res, next) => {
  let latitude = req.params.latitude ? req.params.latitude : 0;
  let longitude = req.params.longitude ? req.params.longitude : 0;

  var data = "";
  https.get("https://armaag.gda.pl/data/xml/weather_wszystko2.xml", function(res) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      res.on("data", function(data_) {
        data += data_.toString();
      });
      res.on("end", function() {
        var result = prefab(latitude, longitude, data);

        res.send(result);
      });
    }
  });
});

module.exports = router;
