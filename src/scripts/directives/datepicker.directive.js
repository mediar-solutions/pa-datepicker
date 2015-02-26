(function() {

  'use strict';

  angular.module('pa-datepicker').directive('paDatepicker', function() {

    return {
      restrict: 'E',
      controller: 'DatepickerContainerCtrl',
      controllerAs: 'container',
      bindToController: true,
      templateUrl: 'templates/pa-datepicker/container.html',
      scope: {
        panels: '@',
        mode: '@',
        base: '=',
        compare: '=',
        currentPeriod: '=',
        startingDay: '@',
        minDate: '=',
        maxDate: '='
      },
      link: function(scope, element, attrs, controller) {
        controller.init();
      }
    };

  });

})();
