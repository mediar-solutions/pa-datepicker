(function() {

  'use strict';

  angular.module('pa-datepicker').controller('DatepickerContainerCtrl',
    ['$scope', 'paDatepickerConfig', function($scope, paDatepickerConfig) {

      angular.extend(this, {

        init: function() {
          this.datePanels = [];
          this.selections = {};

          this.initConfig();
          this.initToday();
          this.initCurrentPeriod();
          this.initModel();
          this.initPanels();
          this.initMonitorWatcher();
        },

        initMonitorWatcher: function() {
          $scope.$watch(
            function() { return this.ngModel; }.bind(this),
            this.initModel.bind(this)
          );
        },

        initConfig: function() {
          this.config = angular.copy(paDatepickerConfig);

          angular.forEach(this.config, function(value, option) {
            if (typeof this[option] !== 'undefined') {
              this.config[option] = this[option];
            }
          }.bind(this));
        },

        initToday: function() {
          this.today = new Date();
          this.today.setHours(0, 0, 0, 0);
        },

        initPanels: function() {
          var numberOfPanels = parseInt(this.config.panels, 10);
          var base = this.getPanelStart();

          for (var i = 0; i < numberOfPanels; i++) {
            this.datePanels[i] = {
              first: i === 0,
              last: i === numberOfPanels - 1,
              year: base.getFullYear(),
              month: base.getMonth() + i - numberOfPanels + 1,
            };
          }
        },

        initCurrentPeriod: function() {
          this.currentPeriod = this.currentPeriod || 'base';
        },

        initModel: function() {
          if (this.isRange() && !this.ngModel) {
            this.ngModel = {};
          } else if (this.ngModel instanceof Date) {
            this.ngModel.setHours(0, 0, 0, 0);
          } else if (typeof(this.ngModel) === 'string' || this.ngModel instanceof String) {
            this.ngModel = new Date(this.ngModel);
            this.ngModel.setHours(0, 0, 0, 0);
          } else {
            this.ngModel = undefined;
          }
        },

        getPanelStart: function() {
          if (this.isRange()) {
            return this.getRangePanelStart();
          } else {
            return this.ngModel || this.today;
          }
        },

        getRangePanelStart: function() {
          if (this.ngModel.comparison && this.ngModel.comparison.end instanceof Date) {
            return this.ngModel.comparison.end;
          } else if (this.ngModel.base && this.ngModel.base.end instanceof Date) {
            return this.ngModel.base.end;
          } else {
            return this.today;
          }
        },

        updatePanels: function(month, $event) {
          $event.preventDefault();
          this.datePanels.forEach(function(p) { p.month += month; });
        },

        selectDate: function(date) {
          if (this.isRange()) {
            this.handleDateSelection(date);
          } else {
            this.ngModel = date;
            this.closePopup();
          }
        },

        handleDateSelection: function(date) {
          if (!this.isSelecting()) {
            this.startSelection(date);
          } else {
            this.stopSelection(date);
            this.closePopup();
          }
        },

        isSelecting: function() {
          return !!this.selections[this.currentPeriod];
        },

        startSelection: function(date) {
          this.selections[this.currentPeriod] = { selected: date, start: date, end: date };
        },

        previewSelection: function(date) {
          if (!this.isSelecting()) {
            return false;
          }

          var selection = this.selections[this.currentPeriod];

          if (date >= selection.selected) {
            selection.start = selection.selected;
            selection.end = date;
          } else {
            selection.start = date;
            selection.end = selection.selected;
          }
        },

        stopSelection: function(date) {
          var selection = this.selections[this.currentPeriod];

          if (date > selection.selected) {
            this.updateCurrentPeriod(selection.selected, date);
          } else {
            this.updateCurrentPeriod(date, selection.selected);
          }

          this.selections[this.currentPeriod] = null;
        },

        updateCurrentPeriod: function(start, end) {
          this.ngModel[this.currentPeriod] = { start: start, end: end };
        },

        isRange: function() {
          return this.config.mode === 'range';
        },

        isDateEnabled: function(date) {
          if (this.config.minDate && this.compare(date, this.config.minDate) < 0) {
            return false;
          } else if (this.config.maxDate && this.compare(date, this.config.maxDate) > 0) {
            return false;
          } else {
            return true;
          }
        },

        isDateSelected: function(date) {
          if (this.isRange()) {
            return this.isDateWithinBasePeriod(date) ||
              this.isDateWithinComparisonPeriod(date);
          }

          return this.ngModel instanceof Date && date.getTime() === this.ngModel.getTime();
        },

        isDateWithinBasePeriod: function(date) {
          return this.isDateWithinPeriod('base', date);
        },

        isDateWithinComparisonPeriod: function(date) {
          return this.isDateWithinPeriod('comparison', date);
        },

        isDateWithinPeriod: function(period, date) {
          if (!this.isRange()) {
            return false;
          } else if (this.isSelecting() && this.currentPeriod === period) {
            return this.isDateWithinSelection(date);
          }

          var selection = this.ngModel[period];

          if (selection && selection.start && selection.end) {
            return selection && this.compare(date, selection.start) >= 0 &&
              this.compare(date, selection.end) <= 0;
          } else {
            return false;
          }
        },

        isDateWithinSelection: function(date) {
          var selection = this.selections[this.currentPeriod];

          if (selection && selection.start && selection.end) {
            return selection && this.compare(date, selection.start) >= 0 &&
              this.compare(date, selection.end) <= 0;
          } else {
            return false;
          }
        },

        isToday: function(date) {
          return this.compare(date, this.today) === 0;
        },

        getStartingDay: function() {
          return (parseInt(this.config.startingDay, 10) % 7) || 0;
        },

        closePopup: function() {
          if (this.popup) {
            this.popup.close();
          }
        },

        compare: function(date1, date2) {
          var subject1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
          var subject2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

          return subject1 - subject2;
        },

      });

    }]
  );

})();
