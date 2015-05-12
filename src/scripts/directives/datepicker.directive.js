(function() {

  'use strict';

  angular.module('pa-datepicker').directive('paDatepicker', function() {

    return {
      restrict: 'E',
      controller: 'DatepickerContainerCtrl',
      controllerAs: 'container',
      bindToController: true,
      require: ['^ngModel', '^paDatepicker', '?^paDatepickerPopup'],
      templateUrl: 'templates/pa-datepicker/container.html',
      scope: {
        panels: '@',
        mode: '@',
        currentPeriod: '=?',
        startingDay: '@',
        showOutliers: '@',
        minDate: '=',
        maxDate: '=',
        ngModel: '=',
      },
      link: function(scope, element, attrs, controllers) {
        controllers[1].popup = controllers[2];
        controllers[1].init();
      }
    };

  });

})();
