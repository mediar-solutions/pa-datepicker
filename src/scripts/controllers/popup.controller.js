(function() {

  'use strict';

  angular.module('pa-datepicker').controller('DatepickerPopupCtrl',
    ['$rootScope', '$scope', '$document', '$timeout', 'paDatepickerConfig',
    function($rootScope, $scope, $document, $timeout, paDatepickerConfig) {

      angular.extend(this, {

        init: function() {
          this.initOpeningWatcher();
          this.initConfig();
          this.initSelectionHandlers();
          this.initClickHandler();
          this.openingHandler();
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

        initSelectionHandlers: function() {
          $rootScope.$on('paDatepicker.selection.started', function() {
            this.isSelectingPeriod = true;
          }.bind(this));

          $rootScope.$on('paDatepicker.selection.ended', function() {
            this.isSelectingPeriod = false;
          }.bind(this));
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
            if (this.isSelectingPeriod !== true) {
              this.closePopup();
            } else {
              $rootScope.$broadcast('paDatepicker.popup.unfinishedSelection');
            }
          }.bind(this));
        },

        preventClosing: function($event) {
          $event.stopPropagation();
        },

        close: function() {
          if (this.config.closeAfterSelection) {
            this.closePopup();
          }
        },

        closePopup: function() {
          this.isOpen = false;
          this.openingHandler();
        },

      });

    }]
  );

})();
