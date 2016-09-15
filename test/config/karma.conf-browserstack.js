"use strict";

const _ = require("lodash");
const pkg = require("../../package.json");
const defaults = require("./karma.default.js");
const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
const launchers = require("./platforms.browserstack.js");
let customLaunchers = {InternetExplorer_9: launchers["InternetExplorer_9"]};

module.exports = config => {
  config.set(_.extend(defaults, {
    logLevel: config.LOG_INFO,
    browserStack: {
      project: pkg.name,
      username: username,
      accessKey: accessKey,
      build: `${Date.now()}-${pkg.version}`
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true
  }));
};
