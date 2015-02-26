/* jshint strict: false */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');

var del = require('del');
var path = require('path');

var config = require('./build/config.js');
var files = require('./build/files.js');

// Clear task
gulp.task('clear', function() {
  del(config.distFolder);
});

// Scripts task
gulp.task('scripts', function() {
  gulp.src(files.scripts).pipe(
    concat(config.scripts.filename)
  ).pipe(
    gulp.dest(config.distFolder)
  ).pipe(
    uglify({ mangle: true })
  ).pipe(
    rename(config.scripts.filenameMin)
  ).pipe(
    gulp.dest(config.distFolder)
  );
});

// Styles task
gulp.task('styles', function() {
  gulp.src(files.styles).pipe(
    concat(config.styles.filename)
  ).pipe(
    gulp.dest(config.distFolder)
  ).pipe(
    minifyCSS()
  ).pipe(
    rename(config.styles.filenameMin)
  ).pipe(
    gulp.dest(config.distFolder)
  );
});

// Templates task
gulp.task('templates', function() {
  var templateCacheConfig = {
    module: config.moduleName,
    base: function(file) {
      return config.templates.baseDir + '/' + path.basename(file.history[0]);
    }
  };

  gulp.src(files.templates).pipe(
    templateCache(config.templates.filename, templateCacheConfig)
  ).pipe(
    gulp.dest(config.distFolder)
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
