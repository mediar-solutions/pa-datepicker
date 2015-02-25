(function() {

  'use strict';

  angular.module('pa-datepicker').controller('DatepickerContainerCtrl',
    ['paDatepickerConfig', function(paDatepickerConfig) {

      angular.extend(this, {

        datePanels: [],
        selections: {},

        init: function() {
          this.initConfig();
          this.initCurrentPeriod();
          this.initPeriodDates();
          this.initPanels();
        },

        initConfig: function() {
          this.config = angular.copy(paDatepickerConfig);

          angular.forEach(this.config, function(value, option) {
            if (typeof this[option] !== 'undefined') {
              this.config[option] = this[option];
            }
          }.bind(this));
        },

        initCurrentPeriod: function() {
          this.currentPeriod = this.currentPeriod || 'base';
        },

        initPeriodDates: function() {
          var today = new Date();
          today.setHours(0, 0, 0, 0);

          this.base = { start: today, end: today };
          this.compare = { start: today, end: today };
        },

        initPanels: function() {
          var numberOfPanels = parseInt(this.config.panels, 10);

          for (var i = 0; i < numberOfPanels; i++) {
            this.datePanels[i] = {
              first: i === 0,
              last: i === numberOfPanels - 1,
              year: this.compare.end.getFullYear(),
              month: this.compare.end.getMonth() + i - numberOfPanels + 1,
            };
          }
        },

        updatePanels: function(month) {
          this.datePanels.forEach(function(p) { p.month += month; });
        },

        selectDate: function(date) {
          if (!this.selections[this.currentPeriod]) {
            this.startSelection(date);
          } else {
            this.stopSelection(date);
          }
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
          this[this.currentPeriod] = { start: start, end: end };
        },

        isDateDisabled: function(date) {
          return (this.config.minDate && date < this.config.minDate) ||
            (this.config.maxDate && date > this.config.maxDate);
        },

        isDateSelected: function(date) {
          return this.isDateWithinBasePeriod(date) ||
            this.isDateWithinComparePeriod(date);
        },

        isDateWithinBasePeriod: function(date) {
          return this.isDateWithinPeriod('base', date);
        },

        isDateWithinComparePeriod: function(date) {
          return this.isDateWithinPeriod('compare', date);
        },

        isDateWithinPeriod: function(period, date) {
          if (this.isSelecting() && this.currentPeriod === period) {
            return this.isDateWithinSelection(date);
          }

          var selection = this[period];
          return date >= selection.start && date <= selection.end;
        },

        isSelecting: function() {
          var selection = this.selections[this.currentPeriod];
          return selection && selection.selected;
        },

        isDateWithinSelection: function(date) {
          var selection = this.selections[this.currentPeriod];
          return this.isSelecting() && date >= selection.start && date <= selection.end;
        },

        getStartingDay: function() {
          return (parseInt(this.config.startingDay, 10) % 7) || 0;
        },

      });

    }]
  );

})();
