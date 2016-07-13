"use strict";

const _ = require("lodash");
const defaults = require("./karma.default.js");
const karma_jasmine_ajax = require("karma-jasmine-ajax");

module.exports = config => {
	config.set(_.extend(defaults, {
		browsers: ["Chrome"]
	}));
};
