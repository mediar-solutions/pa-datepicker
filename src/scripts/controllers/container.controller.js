(function() {

  'use strict';

  angular.module('pa-datepicker').controller('DatepickerContainerCtrl',
    ['paDatepickerConfig', function(paDatepickerConfig) {

      angular.extend(this, {

        init: function() {
          this.datePanels = [];
          this.selections = {};

          this.initConfig();
          this.initToday();
          this.initPanels();
          this.initCurrentPeriod();
          this.initModel();
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
          var base = this.today;

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
          }
        },

        updatePanels: function(month) {
          this.datePanels.forEach(function(p) { p.month += month; });
        },

        selectDate: function(date) {
          if (this.isRange()) {
            this.handleDateSelection(date);
          } else {
            this.ngModel = date;
          }
        },

        handleDateSelection: function(date) {
          if (!this.isSelecting()) {
            this.startSelection(date);
          } else {
            this.stopSelection(date);
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
          if (!this.ngModel) this.ngModel = {};
          this.ngModel[this.currentPeriod] = { start: start, end: end };
        },

        isRange: function() {
          return this.config.mode === 'range';
        },

        isDateDisabled: function(date) {
          return (this.config.minDate && date < this.config.minDate) ||
            (this.config.maxDate && date > this.config.maxDate);
        },

        isDateSelected: function(date) {
          if (this.isRange()) {
            return this.isDateWithinBasePeriod(date) ||
              this.isDateWithinComparePeriod(date);
          }

          return this.ngModel && date.getTime() === this.ngModel.getTime();
        },

        isDateWithinBasePeriod: function(date) {
          return this.isDateWithinPeriod('base', date);
        },

        isDateWithinComparePeriod: function(date) {
          return this.isDateWithinPeriod('compare', date);
        },

        isDateWithinPeriod: function(period, date) {
          if (!this.isRange()) {
            return false;
          } else if (this.isSelecting() && this.currentPeriod === period) {
            return this.isDateWithinSelection(date);
          }

          var selection = this.ngModel[period];
          return selection && date >= selection.start && date <= selection.end;
        },

        isDateWithinSelection: function(date) {
          var selection = this.selections[this.currentPeriod];
          return date >= selection.start && date <= selection.end;
        },

        isToday: function(date) {
          return date.getTime() === this.today.getTime();
        },

        getStartingDay: function() {
          return (parseInt(this.config.startingDay, 10) % 7) || 0;
        },

      });

    }]
  );

})();
