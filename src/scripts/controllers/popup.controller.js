(function() {

  'use strict';

  angular.module('pa-datepicker').controller('DatepickerPopupCtrl',
    ['$scope', '$document', '$timeout', 'paDatepickerConfig',
    function($scope, $document, $timeout, paDatepickerConfig) {

      angular.extend(this, {

        init: function() {
          this.initOpeningWatcher();
          this.initConfig();
          this.initClickHandler();
        },

        initOpeningWatcher: function() {
          $scope.$watch(
            function() { return this.isOpen; }.bind(this),
            this.openingHandler.bind(this)
          );
        },

        initConfig: function() {
          this.config = angular.copy(paDatepickerConfig.popup);

          if (this.closeAfterSelection !== undefined) {
            this.config.closeAfterSelection = this.closeAfterSelection === 'true';
          }
        },

        initClickHandler: function() {
          this.clickHandler = this.onClickOutside.bind(this);
        },

        openingHandler: function() {
          var handler = function() {
            if (this.isOpen) {
              $document.bind('click', this.clickHandler);
            } else {
              $document.unbind('click', this.clickHandler);
            }
          };

          $timeout(handler.bind(this), 200);
        },

        onClickOutside: function() {
          $scope.$apply(function() {
            this.isOpen = false;
          }.bind(this));
        },

        preventClosing: function($event) {
          $event.stopPropagation();
          $event.preventDefault();
        },

        close: function() {
          console.log(this.config.closeAfterSelection);
          if (this.config.closeAfterSelection) {
            this.isOpen = false;
            this.openingHandler();
          }
        },

      });

    }]
  );

})();
