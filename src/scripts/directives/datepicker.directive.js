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
        base: '=',
        compare: '=',
        currentPeriod: '=?',
        startingDay: '@',
        minDate: '=',
        maxDate: '=',
        ngModel: '=',
      },
      link: function(scope, element, attrs, controller) {
        controller[1].popup = controller[2];
        controller[1].init();
      }
    };

  });

})();
