/* jshint multistr: true */
describe('directive: pa-datepicker (range)', function() {

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

  var getSelectedCells = function(element) {
    var trim = function(str) {
      return str.replace(/\s/g, '');
    };

    return {
      base: trim(element.find('td.base').text()),
      comparison: trim(element.find('td.comparison').text()),
      both: trim(element.find('td.base.comparison').text()),
    };
  };

  beforeEach(function() {
    module('pa-datepicker');
  });

  afterEach(function() {
    angular.element('body').empty();
  });

  describe('basic functionality', function() {

    beforeEach(inject(function($rootScope, $compile, $filter) {
      this.element = angular.element('\
        <pa-datepicker ng-model="date" mode="range" panels="3"\
          current-period="currentPeriod"></pa-datepicker>\
      ');

      this.dateFilter = $filter('date');
      this.scope = $rootScope.$new();

      this.today = new Date();
      this.today.setHours(0, 0, 0, 0);

      $compile(this.element)(this.scope);
      this.scope.$digest();

      angular.element('body').append(this.element);
      this.panels = this.element.find('.date-panel');
    }));

    it('inits the model to an object', function() {
      expect(this.scope.date).toEqual({});
    });

    it('inits the current period to base', function() {
      expect(this.scope.currentPeriod).toBe('base');
    });

    it('inits the right number of panels', function() {
      expect(this.panels.size()).toBe(3);
    });

    it('starts the panels with the right months', function() {
      var firstPanel = new Date(this.today.getTime());
      firstPanel.setMonth(this.today.getMonth() - 2);

      var secondPanel = new Date(this.today.getTime());
      secondPanel.setMonth(this.today.getMonth() - 1);

      expect(this.panels.eq(0).find('.active-month')).toHaveText(
        this.dateFilter(firstPanel, 'MMMM yyyy')
      );

      expect(this.panels.eq(1).find('.active-month')).toHaveText(
        this.dateFilter(secondPanel, 'MMMM yyyy')
      );

      expect(this.panels.eq(2).find('.active-month')).toHaveText(
        this.dateFilter(this.today, 'MMMM yyyy')
      );
    });

    it('shows the navigation buttons correctly', function() {
      expect(this.panels.eq(0).find('.prev-month a')).not.toHaveClass('ng-hide');
      expect(this.panels.eq(0).find('.next-month a')).toHaveClass('ng-hide');

      expect(this.panels.eq(1).find('.prev-month a')).toHaveClass('ng-hide');
      expect(this.panels.eq(1).find('.next-month a')).toHaveClass('ng-hide');

      expect(this.panels.eq(2).find('.prev-month a')).toHaveClass('ng-hide');
      expect(this.panels.eq(2).find('.next-month a')).not.toHaveClass('ng-hide');
    });

    describe('navigating back', function() {

      beforeEach(function() {
        this.panels.eq(0).find('.prev-month a').click();
      });

      it('shows the current month', function() {
        var firstPanel = new Date(this.today.getTime());
        firstPanel.setMonth(this.today.getMonth() - 3);

        var secondPanel = new Date(this.today.getTime());
        secondPanel.setMonth(this.today.getMonth() - 2);

        var thirdPanel = new Date(this.today.getTime());
        thirdPanel.setMonth(this.today.getMonth() - 1);

        expect(this.panels.eq(0).find('.active-month')).toHaveText(
          this.dateFilter(firstPanel, 'MMMM yyyy')
        );

        expect(this.panels.eq(1).find('.active-month')).toHaveText(
          this.dateFilter(secondPanel, 'MMMM yyyy')
        );

        expect(this.panels.eq(2).find('.active-month')).toHaveText(
          this.dateFilter(thirdPanel, 'MMMM yyyy')
        );
      });

    });

    describe('navigating forward', function() {

      beforeEach(function() {
        this.panels.eq(2).find('.next-month a').click();
      });

      it('shows the current month', function() {
        var firstPanel = new Date(this.today.getTime());
        firstPanel.setMonth(this.today.getMonth() - 1);

        var thirdPanel = new Date(this.today.getTime());
        thirdPanel.setMonth(this.today.getMonth() + 1);

        expect(this.panels.eq(0).find('.active-month')).toHaveText(
          this.dateFilter(firstPanel, 'MMMM yyyy')
        );

        expect(this.panels.eq(1).find('.active-month')).toHaveText(
          this.dateFilter(this.today, 'MMMM yyyy')
        );

        expect(this.panels.eq(2).find('.active-month')).toHaveText(
          this.dateFilter(thirdPanel, 'MMMM yyyy')
        );
      });

    });

  });

  describe('when the base period is set', function() {

    beforeEach(inject(function($rootScope, $compile) {
      this.element = angular.element('\
        <pa-datepicker ng-model="date" mode="range" panels="3"\
          current-period="currentPeriod"></pa-datepicker>\
      ');

      this.scope = $rootScope.$new();
      this.scope.date = {
        base: {
          start: new Date('2015-04-06 00:00:00'),
          end: new Date('2015-04-10 00:00:00'),
        }
      };

      $compile(this.element)(this.scope);
      this.scope.$digest();

      angular.element('body').append(this.element);
      this.panels = this.element.find('.date-panel');
    }));

    it('starts the panels with the right months', function() {
      expect(this.panels.eq(0).find('.active-month')).toHaveText('February 2015');
      expect(this.panels.eq(1).find('.active-month')).toHaveText('March 2015');
      expect(this.panels.eq(2).find('.active-month')).toHaveText('April 2015');
    });

    it('shows the right days for panel 1', function() {
      var cells = getDayCells(this.panels.eq(0));

      expect(cells).toEqual([
        ['01', '02', '03', '04', '05', '06', '07'],
        ['08', '09', '10', '11', '12', '13', '14'],
        ['15', '16', '17', '18', '19', '20', '21'],
        ['22', '23', '24', '25', '26', '27', '28'],
      ]);
    });

    it('shows the right days for panel 2', function() {
      var cells = getDayCells(this.panels.eq(1));

      expect(cells).toEqual([
        ['01', '02', '03', '04', '05', '06', '07'],
        ['08', '09', '10', '11', '12', '13', '14'],
        ['15', '16', '17', '18', '19', '20', '21'],
        ['22', '23', '24', '25', '26', '27', '28'],
        ['29', '30', '31', '01', '02', '03', '04'],
      ]);
    });

    it('shows the right days for panel 3', function() {
      var cells = getDayCells(this.panels.eq(2));

      expect(cells).toEqual([
        ['29', '30', '31', '01', '02', '03', '04'],
        ['05', '06', '07', '08', '09', '10', '11'],
        ['12', '13', '14', '15', '16', '17', '18'],
        ['19', '20', '21', '22', '23', '24', '25'],
        ['26', '27', '28', '29', '30', '01', '02'],
      ]);
    });

    it('marks the current period', function() {
      var selected = getSelectedCells(this.element);
      expect(selected.base).toBe('0607080910');
    });

  });

  describe('when the base and comparison period are set', function() {

    beforeEach(inject(function($rootScope, $compile) {
      this.element = angular.element('\
        <pa-datepicker ng-model="date" mode="range" panels="3"\
          current-period="currentPeriod"></pa-datepicker>\
      ');

      this.rootScope = $rootScope;

      this.scope = $rootScope.$new();
      this.scope.date = {
        base: {
          start: new Date('2015-04-06 00:00:00'),
          end: new Date('2015-04-10 00:00:00'),
        },
        comparison: {
          start: new Date('2015-04-08 00:00:00'),
          end: new Date('2015-04-12 00:00:00'),
        }
      };

      $compile(this.element)(this.scope);
      this.scope.$digest();

      angular.element('body').append(this.element);
      this.panels = this.element.find('.date-panel');
    }));

    it('marks the selected period', function() {
      var selected = getSelectedCells(this.element);

      expect(selected.base).toBe('0607080910');
      expect(selected.comparison).toBe('0809101112');
      expect(selected.both).toBe('080910');
    });

    describe('range selection', function() {

      it('dont preview the selection if there are no active selection', function() {
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(3)').mouseover();

        var selected = getSelectedCells(this.element);
        expect(selected.base).toBe('0607080910');
      });

      it('broadcasts the selection events', function() {
        this.rootScope.$broadcast = jasmine.createSpy();
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(2)').click();
        expect(this.rootScope.$broadcast).toHaveBeenCalledWith('paDatepicker.selection.started');

        this.rootScope.$broadcast = jasmine.createSpy();
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(6)').click();
        expect(this.rootScope.$broadcast).toHaveBeenCalledWith('paDatepicker.selection.ended');
      });

      it('selects the base and comparison periods', function() {
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(2)').click();
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(6)').click();

        this.scope.currentPeriod = 'comparison';
        this.scope.$digest();

        this.panels.eq(1).find('tbody tr:nth-child(3) td:nth-child(6)').click();
        this.panels.eq(1).find('tbody tr:nth-child(3) td:nth-child(2)').click();

        var expected = {
          base: {
            start: new Date('2015-03-09 00:00:00'),
            end: new Date('2015-03-13 00:00:00'),
          },
          comparison: {
            start: new Date('2015-03-16 00:00:00'),
            end: new Date('2015-03-20 00:00:00'),
          },
        };

        expect(this.scope.date.base.start.getTime()).toBe(expected.base.start.getTime());
        expect(this.scope.date.base.end.getTime()).toBe(expected.base.end.getTime());
        expect(this.scope.date.comparison.start.getTime()).toBe(expected.comparison.start.getTime());
        expect(this.scope.date.comparison.end.getTime()).toBe(expected.comparison.end.getTime());
      });

      it('ignores clicks on disabled dates', function() {
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(2)').click();
        this.panels.eq(1).find('tbody tr:nth-child(5) td:nth-child(6)').click();
        this.panels.eq(1).find('tbody tr:nth-child(5) td:nth-child(7)').click();
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(6)').click();

        var expected = {
          base: {
            start: new Date('2015-03-09 00:00:00'),
            end: new Date('2015-03-13 00:00:00'),
          },
        };

        expect(this.scope.date.base.start.getTime()).toBe(expected.base.start.getTime());
        expect(this.scope.date.base.end.getTime()).toBe(expected.base.end.getTime());
      });

      it('previews the selection on mouseover when the hovered date is after the first one', function() {
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(2)').click();
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(3)').mouseover();

        var selected = getSelectedCells(this.element);
        expect(selected.base).toBe('0910');
      });

      it('previews the selection on mouseover when the hovered date is before the first one', function() {
        this.panels.eq(1).find('tbody tr:nth-child(2) td:nth-child(2)').click();
        this.panels.eq(1).find('tbody tr:nth-child(1) td:nth-child(7)').mouseover();

        var selected = getSelectedCells(this.element);
        expect(selected.base).toBe('070809');
      });

    });

  describe('panel month selection', function() {

    it('shows the right months if the comparison period is further than the base period', function() {
      var titles = this.panels.find('thead tr:nth-child(1) th:nth-child(2)');

      expect(titles.eq(0).text().trim()).toBe('February 2015');
      expect(titles.eq(1).text().trim()).toBe('March 2015');
      expect(titles.eq(2).text().trim()).toBe('April 2015');
    });

    it('shows the right months if the comparison period is further than the base period', function() {
      this.scope.date = {
        base: {
          start: new Date('2015-06-06 00:00:00'),
          end: new Date('2015-06-10 00:00:00'),
        },
        comparison: {
          start: new Date('2015-04-08 00:00:00'),
          end: new Date('2015-04-12 00:00:00'),
        }
      };

      this.scope.$apply();
      var titles = this.panels.find('thead tr:nth-child(1) th:nth-child(2)');

      expect(titles.eq(0).text().trim()).toBe('February 2015');
      expect(titles.eq(1).text().trim()).toBe('March 2015');
      expect(titles.eq(2).text().trim()).toBe('April 2015');
    });

  });

  });

});
