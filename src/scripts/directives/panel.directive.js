(function() {

  'use strict';

  angular.module('pa-datepicker').directive('paPanel', function() {

    return {
      restrict: 'E',
      controller: 'DatepickerPanelCtrl',
      controllerAs: 'panel',
      bindToController: true,
      require: ['^paDatepicker', '^paPanel'],
      templateUrl: 'templates/pa-datepicker/panel.html',
      scope: {
        config: '=',
        period: '@',
      },
      link: function(scope, element, attrs, controllers) {
        controllers[1].container = controllers[0];
        controllers[1].init();
      }
    };

  });

})();
