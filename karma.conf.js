/* jshint strict: false */
var files = require('./build/files');

var getFilesList = function() {
  var scripts = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
    'bower_components/angular/angular.js',
  ];

  // mocks
  scripts.unshift('spec/support/bindMock.js');

  // appends appliction files
  scripts = scripts.concat(files.scripts);

  // appends some more files...
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

  // adds coverage processor
  files.scripts.forEach(function(file) {
    processors[file] = 'coverage';
  });

  return processors;
};

var getReporters = function() {
  var reporters = ['progress'];

  if (process.env.TRAVIS) {
    reporters.push('coverage');
  }

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
    browsers : ['PhantomJS'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
    ],
    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/templates/',
      prependPrefix: 'templates/pa-datepicker/',
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
