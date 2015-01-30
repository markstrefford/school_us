'use strict';

describe('Directive: googleMap', function () {
  beforeEach(module('schoolusUiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<google-map></google-map>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the googleMap directive');
  }));
});
