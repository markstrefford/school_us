'use strict';

describe('Controller: MySummaryCtrl', function () {

  // load the controller's module
  beforeEach(module('schoolusUiApp'));

  var MySummaryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MySummaryCtrl = $controller('MySummaryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
