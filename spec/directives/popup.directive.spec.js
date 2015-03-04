/* jshint multistr: true */
describe('directive: pa-datepicker-popup', function() {

  beforeEach(function() {
    module('pa-datepicker');
  });

  afterEach(function() {
    angular.element('body').empty();
  });

  describe('open/close', function() {

    beforeEach(inject(function($rootScope, $compile, $timeout) {
      this.element = angular.element('\
        <pa-datepicker-popup is-open="isPopupOpen">\
          <pa-datepicker ng-model="date.selected"></pa-datepicker>\
        </pa-datepicker-popup>\
      ');

      this.scope = $rootScope.$new();
      this.scope.date = { selected: new Date('2015-03-02 00:00:00') };

      $compile(this.element)(this.scope);
      this.scope.$digest();

      $timeout.flush();

      angular.element(document.querySelector('body')).append(this.element);
    }));

    it('starts up hidden', function() {
      expect(this.element).toBeHidden();
    });

    it('shows up when the flag is true', function() {
      this.scope.isPopupOpen = true;
      this.scope.$digest();

      expect(this.element).not.toBeHidden();
    });

    it('closes the popup when a date is selected', function() {
      this.scope.isPopupOpen = true;
      this.scope.$digest();

      angular.element('tr:nth-child(2) td:nth-child(2)').click();
      var expected = new Date('2015-03-09 00:00:00');

      expect(this.element).toBeHidden();
      expect(this.scope.date.selected.getTime()).toBe(expected.getTime());
    });

  });

  describe('outside click closes popup', function() {

    beforeEach(inject(function($rootScope, $compile, $timeout) {
      this.element = angular.element('\
        <pa-datepicker-popup is-open="isPopupOpen">\
          <pa-datepicker ng-model="date"></pa-datepicker>\
        </pa-datepicker-popup>\
      ');

      this.scope = $rootScope.$new();
      this.scope.isPopupOpen = true;

      $compile(this.element)(this.scope);
      this.scope.$digest();

      $timeout.flush();

      angular.element('body').append(this.element);
    }));

    it('closes when clicking outside of datepicker', function() {
      $(document).click();
      expect(this.element).toBeHidden();
    });

    it('keeps the popup opened when the datepicker is clicked', function() {
      this.element.find('th.active-month').click();
      expect(this.element).not.toBeHidden();
    });

  });

  describe('closeAfterSelection option', function() {

    beforeEach(inject(function($rootScope, $compile, $timeout) {
      this.element = angular.element('\
        <pa-datepicker-popup is-open="isPopupOpen" close-after-selection="false">\
          <pa-datepicker ng-model="date.selected"></pa-datepicker>\
        </pa-datepicker-popup>\
      ');

      this.scope = $rootScope.$new();
      this.scope.isPopupOpen = true;
      this.scope.date = {};

      $compile(this.element)(this.scope);
      this.scope.$digest();

      $timeout.flush();

      angular.element('body').append(this.element);
      angular.element('tr:nth-child(2) td:nth-child(2)').click();
    }));

    it('selects a date', function() {
      var expected = new Date('2015-03-09 00:00:00');
      expect(this.scope.date.selected.getTime()).toBe(expected.getTime());
    });

    it('keeps the popup opened', function() {
      expect(this.element).not.toBeHidden();
    });

  });

});
