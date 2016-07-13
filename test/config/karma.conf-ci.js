"use strict";

const _ = require("lodash");
const defaults = require("./karma.default.js");
const customLaunchers = require("./platforms.js");

module.exports = config => {
  config.set(_.extend(defaults, {
    reporters: ["dots", "saucelabs"],
    logLevel: config.LOG_INFO,
    sauceLabs: {
      testName: "Ideal Postcodes Core"
    },
    captureTimeout: 120000,
    recordScreenshots: true,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true
  }));
};
