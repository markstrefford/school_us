'use strict';

describe('Directive: leafletDirective', function () {
  beforeEach(module('schoolusUiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<leaflet-directive></leaflet-directive>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the leafletDirective directive');
  }));
});
