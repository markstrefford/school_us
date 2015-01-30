'use strict';

describe('Controller: SchoollistCtrl', function () {

  // load the controller's module
  beforeEach(module('schoolusUiApp'));

  var SchoollistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SchoollistCtrl = $controller('SchoollistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
