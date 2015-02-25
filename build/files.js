/* jshint strict: false */
module.exports = {

  scripts: [
    // initializers
    'src/scripts/paDatepicker.module.js', // must go first

    // directives
    'src/scripts/directives/**/*.js',

    // services
    'src/scripts/services/**/*.js',

    // controllers
    'src/scripts/controllers/**/*.js',
  ],

  styles: [
    'src/stylesheets/**/*.css',
  ],

  templates: [
    'src/templates/**',
  ],

};
