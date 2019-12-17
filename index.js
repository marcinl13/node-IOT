"use strict";
const express = require("express");
const app = express();
const prepareData = require("./assets/prepareData");
const checkStatus = require("./assets/checkStatus");

const PORT = 5000;

app.get("/:latitude/:longitude/:debug?", async (req, res, next) => {
  const latitude = req.params.latitude ? parseFloat(req.params.latitude) : null;
  const longitude = req.params.longitude ? parseFloat(req.params.longitude) : null;
  let isDebug = false;

  if (req.params.debug) isDebug = req.params.debug == "debug" ? true : false;

  const preparedData = await prepareData(latitude, longitude, isDebug);

  res.send(preparedData);
});

app.get("/status", async (req, res, next) => {
  checkStatus(req, res, next);
});

app.listen(PORT, () => console.log(`API listening on port ${PORT}!`));
