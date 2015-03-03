describe('directive: pa-date-input', function() {

  beforeEach(function() {
    module('pa-datepicker');
  });

  describe('using the default format (shortDate)', function() {

    beforeEach(inject(function($rootScope, $compile) {
      this.element = angular.element('<pa-date-input ng-model="date"></pa-date-input>');

      this.scope = $rootScope.$new();
      this.scope.date = new Date('2015-03-02 00:00:00');

      $compile(this.element)(this.scope);
      this.scope.$digest();
    }));

    it('formats the date correctly', function() {
      expect(this.element.val()).toBe('3/2/15');
    });

    it('updates the model when a valid date is inputed', function() {
      this.element.val('4/3/16').trigger('input');
      this.scope.$apply();

      var expected = new Date('2016-04-03 00:00:00');
      expect(this.scope.date.getTime()).toBe(expected.getTime());
    });

    it('recognizes leading zeros', function() {
      this.element.val('04/03/16').trigger('input');
      this.scope.$apply();

      var expected = new Date('2016-04-03 00:00:00');
      expect(this.scope.date.getTime()).toBe(expected.getTime());
    });

    it('sets the model to undefined when an invalid date is inputed', function() {
      this.element.val('asdasd').trigger('input');
      this.scope.$apply();

      expect(this.scope.date).toBe(undefined);
    });

    it('shows nothing when the model is not a valid date', function() {
      this.scope.date = new Date('asiudhaiusdhas');
      this.scope.$digest();

      expect(this.element.val()).toBe('');
    });

  });

  describe('using another format', function() {

    beforeEach(inject(function($rootScope, $compile) {
      this.element = angular.element('<pa-date-input ng-model="date" format="dd/MM/yyyy"></pa-date-input>');

      this.scope = $rootScope.$new();
      this.scope.date = new Date('2015-03-02 00:00:00');

      $compile(this.element)(this.scope);
      this.scope.$digest();
    }));

    it('formats the date correctly', function() {
      expect(this.element.val()).toBe('02/03/2015');
    });

    it('updates the model when a valid date is inputed', function() {
      this.element.val('03/04/2016').trigger('input');
      this.scope.$apply();

      var expected = new Date('2016-04-03 00:00:00');
      expect(this.scope.date.getTime()).toBe(expected.getTime());
    });

    it('recognizes missing leading zeros', function() {
      this.element.val('3/4/2016').trigger('input');
      this.scope.$apply();

      var expected = new Date('2016-04-03 00:00:00');
      expect(this.scope.date.getTime()).toBe(expected.getTime());
    });

  });

});
