'use strict';

describe('Controller: MydetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('schoolusUiApp'));

  var MydetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MydetailsCtrl = $controller('MydetailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
