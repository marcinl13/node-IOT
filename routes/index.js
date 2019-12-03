const express = require("express");
const router = express.Router();
const parseFromAPI = require("../assets/jprefabJSON");

/** GET coords
 * Latitude N/S
 * Longitude E/W
 */

router.get("/:latitude/:longitude", function(req, res, next) {
  parseFromAPI(req, res, next);
});

module.exports = router;
