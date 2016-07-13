"use strict";

const gulp = require("gulp");
const tsc = require("gulp-tsc");
const iife = require("gulp-iife");
const babel = require("gulp-babel");
const Server = require('karma').Server;
const concat = require('gulp-concat');
const pkg = require("./package.json");
const tslint = require("gulp-tslint");
const uglify = require("gulp-uglify");
const header = require("gulp-header");
const runSequence = require("run-sequence");
const tsconfig = require("./tsconfig.json");
const server = require('gulp-server-livereload');
const iifeDefaults = {
	args: ["window", "document"],
	params: ["window", "document"]
};

const paths = {
	tscripts : { 
		src : tsconfig.files,
		dest : "dist",
		testDest: "test/dist"
	}
};

const testPaths = {
	tscripts : { 
		src : ["test/*.js"],
		dest: "test/build"
	}
};

const banner = [
	"/**",
	" * <%= pkg.name %> - <%= pkg.description %>",
	" * @version v<%= pkg.version %>",
	" * @link <%= pkg.homepage %>",
	" * @license <%= pkg.license %>",
	" */", 
	"",
	""
].join("\n");

gulp.task("compile", () => {
	return gulp
	.src(paths.tscripts.src)
	.pipe(tsc(tsconfig.compilerOptions))
	.pipe(iife(iifeDefaults))
	.pipe(header(banner, { pkg: pkg }))
	.pipe(gulp.dest(paths.tscripts.dest));
});

gulp.task("compile_tests", () => {
	return gulp
	.src(testPaths.tscripts.src)
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest(testPaths.tscripts.dest));
});

gulp.task("compile_test_build", () => {
	return gulp
	.src(paths.tscripts.src)
	.pipe(tsc(tsconfig.compilerOptions))
	.pipe(iife(iifeDefaults))
	.pipe(gulp.dest(paths.tscripts.testDest));
});

gulp.task("minified", () => {
	return gulp
	.src(paths.tscripts.src)
	.pipe(tsc({
		module: "system",
		target: "ES3",
		out: "ideal-postcodes-core.min.js"
	}))
	.pipe(uglify())
	.pipe(iife(iifeDefaults))
	.pipe(header(banner, { pkg: pkg }))
	.pipe(gulp.dest(paths.tscripts.dest));
});

gulp.task("lint:default", () => {
	return gulp.src(paths.tscripts.src)
		.pipe(tslint())
		.pipe(tslint.report("prose", {
			emitError: true
		}));
});

gulp.task('unittests', done => {
	new Server({
		configFile: `${__dirname}/test/config/karma.conf.js`,
		singleRun: true
	}, code => {
		if (code === 1) return done('Unit Test Failures');
		done();
	}).start();
});

gulp.task('saucelabs', done => {
	new Server({
		configFile: `${__dirname}/test/config/karma.conf-ci.js`,
		singleRun: true
	}, done).start();
});

gulp.task("default", done => {
	runSequence(
		"lint",
		"test",
		"build",
		done
	);
});

gulp.task("build", done => {
	runSequence(
		"compile",
		"minified",
		done
	);
});

gulp.task("lint", ["lint:default"]);

gulp.task("test", done => {
	runSequence(
		"lint", 
		"compile_tests", 
		"compile_test_build", 
		"unittests",
		done
	);
});

gulp.task("ci", done => {
	runSequence(
		"lint",
		"compile_test_build",
		"saucelabs", 
		done
	);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      clientConsole: true,
      open: true
    }));
});