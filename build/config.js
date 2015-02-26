/* jshint strict: false */
module.exports = {

  distFolder: './dist',

  moduleName: 'pa-datepicker',

  scripts: {
    filename: 'paDatepicker.js',
    filenameMin: 'paDatepicker.min.js',
    watchlist: './src/scripts/**/*.js',
  },

  styles: {
    filename: 'paDatepicker.css',
    filenameMin: 'paDatepicker.min.css',
    watchlist: 'src/stylesheets/**/*.css',
  },

  templates: {
    filename: 'paDatepicker.tpls.js',
    baseDir: 'templates/pa-datepicker',
    watchlist: 'src/templates/**/*.html',
  },

};
