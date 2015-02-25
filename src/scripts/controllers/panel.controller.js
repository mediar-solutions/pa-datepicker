(function() {

  'use strict';

  angular.module('pa-datepicker').controller('DatepickerPanelCtrl',
    ['$scope', function($scope) {

      angular.extend(this, {

        init: function() {
          this.updatePanel();
          this.initToday();
          this.initConfigWatcher();
        },

        updatePanel: function() {
          this.setBoundaries();
          this.separateRows();
        },

        initToday: function() {
          this.today = new Date();
          this.today.setHours(0, 0, 0, 0);
        },

        initConfigWatcher: function() {
          $scope.$watch(
            function() { return this.config; }.bind(this),
            this.updatePanel.bind(this),
            true
          );
        },

        setBoundaries: function() {
          this.start = new Date(this.config.year, this.config.month, 1);
          this.end = new Date(this.config.year, 1 + parseInt(this.config.month, 10), 0);
        },

        separateRows: function() {
          var currentDay = 1 - this.start.getDay() + this.container.getStartingDay();
          var current = new Date(this.config.year, this.config.month, currentDay);

          if (current > this.start) {
            current = new Date(current.getTime() - 86400000 * 7);
          }

          var rows = Math.ceil(((this.end - current) / 86400000 + 1) / 7);

          this.fillRows(rows, current);
        },

        fillRows: function(rows, current) {
          this.rows = [];

          for (var i = 0; i < rows; i++) {
            this.rows[i] = [];

            for (var j = 0; j < 7; j ++) {
              this.rows[i][j] = new Date(current.getTime());
              current.setDate(current.getDate() + 1);
            }
          }
        },

        selectDate: function(date) {
          if (!this.isDisabled(date)) {
            this.container.selectDate(date);
          }
        },

        previewSelection: function(date) {
          if (!this.isDisabled(date)) {
            this.container.previewSelection(date);
          }
        },

        isDisabled: function(date) {
          return this.container.isDateDisabled(date) || date < this.start ||
            date > this.end;
        },

        isDateSelected: function(date) {
          return !this.isDisabled(date) && this.container.isDateSelected(date);
        },

        isDateWithinBasePeriod: function(date) {
          return !this.isDisabled(date) && this.container.isDateWithinBasePeriod(date);
        },

        isDateWithinComparePeriod: function(date) {
          return !this.isDisabled(date) && this.container.isDateWithinComparePeriod(date);
        },

        isToday: function(date) {
          return date.getTime() === this.today.getTime();
        },

      });

    }]
  );

})();
