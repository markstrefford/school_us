'use strict';

describe('Controller: FindschoolCtrl', function () {

  // load the controller's module
  beforeEach(module('schoolusUiApp'));

  var FindschoolCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FindschoolCtrl = $controller('FindschoolCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
