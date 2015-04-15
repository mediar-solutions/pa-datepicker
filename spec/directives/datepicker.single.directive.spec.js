describe('directive: pa-datepicker (single)', function() {

  var getDayCells = function(element) {
    var cells = [];

    element.find('tbody tr').each(function() {
      var days = [];

      $(this).find('td').each(function() {
        days.push($(this).text().replace(/\s/g, ''));
      });

      cells.push(days);
    });

    return cells;
  };

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

    it('shows the correct days-of-week', function() {
      var cells = this.element.find('tr:nth-child(2) th').text();
      var weekdays = cells.replace(/\s/g, '');

      expect(weekdays).toBe('SunMonTueWedThuFriSat');
    });

    it('shows the navigation buttons', function() {
      expect(this.element.find('.prev-month a')).not.toHaveClass('ng-hide');
      expect(this.element.find('.next-month a')).not.toHaveClass('ng-hide');
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

    beforeEach(inject(function($rootScope, $compile) {
      this.element = angular.element('<pa-datepicker ng-model="date"></pa-datepicker>');

      this.scope = $rootScope.$new();
      this.scope.date = new Date('2015-04-15 00:00:00');

      $compile(this.element)(this.scope);
      this.scope.$digest();

      angular.element('body').append(this.element);
    }));

    it('starts in the selected month', function() {
      expect(this.element.find('.active-month')).toHaveText('April 2015');
    });

    it('shows the right days', function() {
      var cells = getDayCells(this.element);

      expect(cells).toEqual([
        ['29', '30', '31', '01', '02', '03', '04'],
        ['05', '06', '07', '08', '09', '10', '11'],
        ['12', '13', '14', '15', '16', '17', '18'],
        ['19', '20', '21', '22', '23', '24', '25'],
        ['26', '27', '28', '29', '30', '01', '02'],
      ]);
    });

    it('shows the right days if the model changes', function() {
      this.scope.date = new Date('2015-01-01 00:00:00');
      this.scope.$digest();

      var cells = getDayCells(this.element);

      expect(cells).toEqual([
        ['28', '29', '30', '31', '01', '02', '03'],
        ['04', '05', '06', '07', '08', '09', '10'],
        ['11', '12', '13', '14', '15', '16', '17'],
        ['18', '19', '20', '21', '22', '23', '24'],
        ['25', '26', '27', '28', '29', '30', '31'],
      ]);
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

  describe('overriding default options', function() {

    beforeEach(inject(function($rootScope, $compile, paDatepickerConfig) {
      this.configBackup = angular.extend({}, paDatepickerConfig);

      angular.extend(paDatepickerConfig, {
        startingDay: 2,
        minDate: new Date('2015-04-10 00:00:00'),
        maxDate: new Date('2015-04-20 00:00:00'),
      });

      this.element = angular.element('<pa-datepicker ng-model="date"></pa-datepicker>');

      this.scope = $rootScope.$new();
      this.scope.date = new Date('2015-04-15 00:00:00');

      $compile(this.element)(this.scope);
      this.scope.$digest();

      angular.element('body').append(this.element);
    }));

    afterEach(inject(function(paDatepickerConfig) {
      angular.extend(paDatepickerConfig, this.configBackup);
    }));

    describe('startingDay', function() {

      it('shows the correct days-of-week', function() {
        var cells = this.element.find('tr:nth-child(2) th').text();
        var weekdays = cells.replace(/\s/g, '');

        expect(weekdays).toBe('TueWedThuFriSatSunMon');
      });

      it('shows the right days', function() {
        var cells = getDayCells(this.element);

        expect(cells).toEqual([
          ['31', '01', '02', '03', '04', '05', '06', ],
          ['07', '08', '09', '10', '11', '12', '13', ],
          ['14', '15', '16', '17', '18', '19', '20', ],
          ['21', '22', '23', '24', '25', '26', '27', ],
          ['28', '29', '30', '01', '02', '03', '04', ],
        ]);
      });

    });

    describe('minDate/maxDate', function() {

      it('disables dates lower than April 10', function() {
        expect(this.element.find('tr:nth-child(2) td:nth-child(2)')).toHaveClass('disabled');
        expect(this.element.find('tr:nth-child(1) td:nth-child(5)')).toHaveClass('disabled');
      });

      it('keeps valid dates selectable', function() {
        expect(this.element.find('tr:nth-child(2) td:nth-child(4)')).not.toHaveClass('disabled');
        expect(this.element.find('tr:nth-child(3) td:nth-child(2)')).not.toHaveClass('disabled');
        expect(this.element.find('tr:nth-child(3) td:nth-child(7)')).not.toHaveClass('disabled');
      });

      it('disables dates higher than April 10', function() {
        expect(this.element.find('tr:nth-child(5) td:nth-child(2)')).toHaveClass('disabled');
        expect(this.element.find('tr:nth-child(4) td:nth-child(5)')).toHaveClass('disabled');
      });

    });

  });

});
