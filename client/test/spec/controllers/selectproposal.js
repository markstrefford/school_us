'use strict';

describe('Controller: SelectproposalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var SelectproposalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SelectproposalCtrl = $controller('SelectproposalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
