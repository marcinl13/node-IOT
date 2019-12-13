"use strict";
const express = require("express");
const app = express();
const prepareData = require("./assets/prepareData");

const PORT = 5000;

app.get("/:latitude/:longitude", async (req, res, next) => {
  const latitude = req.params.latitude ? parseFloat(req.params.latitude) : null;
  const longitude = req.params.longitude ? parseFloat(req.params.longitude) : null;

  const preparedData = await prepareData(latitude, longitude);
  res.send(preparedData);
});

app.listen(PORT, () => console.log(`API listening on port ${PORT}!`))
