(function() {

  'use strict';

  angular.module('pa-datepicker').directive('paDatepickerPopup', function() {

    return {
      restrict: 'E',
      controller: 'DatepickerPopupCtrl',
      controllerAs: 'popup',
      bindToController: true,
      templateUrl: 'templates/pa-datepicker/popup.html',
      transclude: true,
      replace: true,
      scope: {
        isOpen: '=',
        closeAfterSelection: '@',
      },
      link: function(scope, element, attrs, controller) {
        controller.container = element[0];
        controller.init();
      }
    };

  });

})();
