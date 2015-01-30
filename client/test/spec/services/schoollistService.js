'use strict';

describe('Service: schoollistService', function () {

  // load the service's module
  beforeEach(module('schoolusUiApp'));

  // instantiate service
  var schoollistService;
  beforeEach(inject(function (_schoollistService_) {
    schoollistService = _schoollistService_;
  }));

  it('should do something', function () {
    expect(!!schoollistService).toBe(true);
  });

});
