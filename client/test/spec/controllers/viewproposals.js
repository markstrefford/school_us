'use strict';

describe('Controller: ViewproposalsCtrl', function () {

  // load the controller's module
  beforeEach(module('schoolusUiApp'));

  var ViewproposalsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewproposalsCtrl = $controller('ViewproposalsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
