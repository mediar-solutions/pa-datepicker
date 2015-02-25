/* jshint strict: false */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');

var config = require('./build/config.js');
var files = require('./build/files.js');

// Clear task
gulp.task('clear', function() {
  del(config.dist_folder);
});

// Scripts task
gulp.task('scripts', function() {
  gulp.src(files.scripts).pipe(
    concat(config.scripts.filename)
  ).pipe(
    gulp.dest(config.dist_folder)
  ).pipe(
    uglify({ mangle: true })
  ).pipe(
    rename(config.scripts.filenameMin)
  ).pipe(
    gulp.dest(config.dist_folder)
  );
});

// Styles task
gulp.task('styles', function() {
  gulp.src(files.styles).pipe(
    concat(config.styles.filename)
  ).pipe(
    gulp.dest(config.dist_folder)
  ).pipe(
    minifyCSS()
  ).pipe(
    rename(config.styles.filenameMin)
  ).pipe(
    gulp.dest(config.dist_folder)
  );
});

// Templates task
gulp.task('templates', function() {
  gulp.src(files.templates).pipe(
    concat(config.templates.filename)
  ).pipe(
    templateCache()
  ).pipe(
    gulp.dest(config.dist_folder)
  );
});

// Watch task
gulp.task('watch', ['default'], function() {
  gulp.watch(config.scripts.watchlist, ['scripts']);
  gulp.watch(config.styles.watchlist, ['styles']);
  gulp.watch(config.templates.watchlist, ['templates']);
});

// Default task
gulp.task('default', ['scripts', 'styles', 'templates']);
