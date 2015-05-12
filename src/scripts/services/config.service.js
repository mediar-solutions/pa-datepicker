(function() {

  'use strict';

  angular.module('pa-datepicker').constant('paDatepickerConfig', {
    panels: 1,
    mode: 'single',
    startingDay: 0,
    showOutliers: true,
    minDate: null,
    maxDate: null,
    popup: {
      closeAfterSelection: true,
    },
  });

})();
