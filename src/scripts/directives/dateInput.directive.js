(function() {

  'use strict';

  angular.module('pa-datepicker').directive('dateInput',
    ['$filter', 'DateParser', function($filter, DateParser) {

      var createDateFormatter = function(format) {
        return function(value) {
          var dateObj = new Date(value);

          if (!isNaN(dateObj.getTime())) {
            return $filter('date')(dateObj, format);
          } else {
            return null;
          }
        };
      };

      var createDateParser = function(format) {
        return function(value) {
          return DateParser.parse(value, format);
        };
      };

      return {
        require: 'ngModel',
        template: '<input type="text" />',
        replace: true,
        scope: {
          format: '@',
        },
        link: function(scope, elm, attrs, ngModelCtrl) {
          var format = scope.format || 'shortDate';

          ngModelCtrl.$formatters.unshift(createDateFormatter(format));
          ngModelCtrl.$parsers.unshift(createDateParser(format));
        },
      };

    }]
  );

})();
