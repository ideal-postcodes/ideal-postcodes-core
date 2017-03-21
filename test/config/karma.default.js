"use strict";

let helpers = [
	"../helpers/*.js",
	"../helpers/xhr_stubbing/*.js",
	"../helpers/xhr_stubbing/responses/*.js"
];

if (!!process.env.LIVE) helpers.push("../config/live_settings.js");

const files = helpers.concat([
	"../dist/*.js",
	"../build/*.js"
]);

module.exports = {
	"testName": "ideal-postcodes-core",
	"basePath": "",
	"frameworks": ["jasmine-ajax", "jasmine"],
	"files": files,
	"colors": true,
	"reporters": ["dots"],
	"port": 9876,
	"colors": true,
	"singleRun": true,
	"browserConsoleLogOptions": {
    level: "log",
    terminal: true
  }
};
