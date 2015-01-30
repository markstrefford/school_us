'use strict';

describe('Controller: SelecthomeCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var SelecthomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SelecthomeCtrl = $controller('SelecthomeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
