/* jshint strict: false */
var files = require('./build/files');

var getFilesList = function() {
  var scripts = files.scripts;

  // jQuery and Angular must come first
  scripts.unshift('bower_components/angular/angular.js');
  scripts.unshift('bower_components/jquery/dist/jquery.js');

  // append some more files...
  scripts = scripts.concat([
    // angular mocks
    'bower_components/angular-mocks/angular-mocks.js',

    // test files
    'spec/**/*.js',

    // template files
    'src/templates/**/*.html',
  ]);

  return scripts;
};

var getPreprocessors = function() {
  var processors = { '**/*.html': 'ng-html2js' };

  // removes initializers
  // files.app_scripts.shift();
  // files.app_scripts.shift();

  // adds coverage processor
  // files.app_scripts.forEach(function(file) {
  //   processors[file] = 'coverage';
  // });

  return processors;
};

var getReporters = function() {
  var reporters = ['progress'];

  // if (process.env.CIRCLECI) {
  //   reporters.push('coverage');
  // }

  return reporters;
};

module.exports = function(config) {

  config.set({
    basePath : './',
    files : getFilesList(),
    preprocessors: getPreprocessors(),
    reporters: getReporters(),
    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
    ],
    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit',
    },
    ngHtml2JsPreprocessor: {
      moduleName: 'pa-datepicker',
    },
    coverageReporter: {
      reporters: [{
        type: 'text-summary',
      }, {
        type: 'lcovonly',
        dir: '.',
        subdir: '.',
        file: 'coverage.info',
      }]
    },
  });
};
