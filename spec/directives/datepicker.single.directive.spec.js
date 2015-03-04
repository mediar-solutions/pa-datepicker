describe('directive: pa-date-input', function() {

  beforeEach(function() {
    module('pa-datepicker');
  });

  afterEach(function() {
    angular.element('body').empty();
  });

  describe('basic functionality', function() {

    beforeEach(inject(function($rootScope, $compile, $filter) {
      this.element = angular.element('<pa-datepicker ng-model="date"></pa-datepicker>');

      this.dateFilter = $filter('date');
      this.scope = $rootScope.$new();

      this.today = new Date();
      this.today.setHours(0, 0, 0, 0);

      $compile(this.element)(this.scope);
      this.scope.$digest();

      angular.element('body').append(this.element);
    }));

    it('does not change the model', function() {
      expect(this.scope.date).toBe(undefined);
    });

    it('starts in the current month', function() {
      var expected = this.dateFilter(this.today, 'MMMM yyyy');
      expect(this.element.find('.active-month')).toHaveText(expected);
    });

    it('marks current day', function() {
      var expected = this.dateFilter(this.today, 'dd');
      expect(this.element.find('td.today')).toHaveText(expected);
    });

    it('shows the navigation buttons', function() {
      expect(this.element.find('.prev-month a')).toBeVisible();
      expect(this.element.find('.next-month a')).toBeVisible();
    });

    describe('navigating back', function() {

      beforeEach(function() {
        this.element.find('.prev-month a').click();
      });

      it('shows the current month', function() {
        var prevMonth = new Date(this.today.getTime());
        prevMonth.setMonth(prevMonth.getMonth() - 1);

        var expected = this.dateFilter(prevMonth, 'MMMM yyyy');
        expect(this.element.find('.active-month')).toHaveText(expected);
      });

    });

    describe('navigating forward', function() {

      beforeEach(function() {
        this.element.find('.next-month a').click();
      });

      it('shows the current month', function() {
        var prevMonth = new Date(this.today.getTime());
        prevMonth.setMonth(prevMonth.getMonth() + 1);

        var expected = this.dateFilter(prevMonth, 'MMMM yyyy');
        expect(this.element.find('.active-month')).toHaveText(expected);
      });

    });

  });

  describe('when the date is already set', function() {

    beforeEach(inject(function($rootScope, $compile, $filter) {
      this.element = angular.element('<pa-datepicker ng-model="date"></pa-datepicker>');

      this.dateFilter = $filter('date');

      this.scope = $rootScope.$new();
      this.scope.date = new Date('2015-04-15 00:00:00');

      $compile(this.element)(this.scope);
      this.scope.$digest();

      angular.element('body').append(this.element);
    }));

    it('starts in the selected month', function() {
      expect(this.element.find('.active-month')).toHaveText('April 2015');
    });

    it('marks the current date as selected', function() {
      expect(this.element.find('td.selected')).toHaveText('15');
    });

    it('selects another date', function() {
      this.element.find('tbody tr:nth-child(2) td:nth-child(4)').click();
      var expected = new Date('2015-04-08 00:00:00');

      expect(this.scope.date.getTime()).toBe(expected.getTime());
      expect(this.element.find('td.selected')).toHaveText('08');
    });

    it('marks disabled dates', function() {
      expect(this.element.find('tbody tr:nth-child(1) td:nth-child(3)')).toHaveClass('disabled');
      expect(this.element.find('tbody tr:nth-child(5) td:nth-child(6)')).toHaveClass('disabled');
    });

    it('prevents disabled dates from being selected', function() {
      var expected = this.scope.date.getTime();
      this.element.find('td.disabled').eq(2).click();

      expect(this.scope.date.getTime()).toBe(expected);
      expect(this.element.find('td.selected')).toHaveText('15');
    });

  });

});
