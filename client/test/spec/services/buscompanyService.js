'use strict';

describe('Service: buscompanyService', function () {

  // load the service's module
  beforeEach(module('schoolusUiApp'));

  // instantiate service
  var buscompanyService;
  beforeEach(inject(function (_buscompanyService_) {
    buscompanyService = _buscompanyService_;
  }));

  it('should do something', function () {
    expect(!!buscompanyService).toBe(true);
  });

});
