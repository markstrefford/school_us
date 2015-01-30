'use strict';

describe('Service: proposalService', function () {

  // load the service's module
  beforeEach(module('schoolusUiApp'));

  // instantiate service
  var proposalService;
  beforeEach(inject(function (_proposalService_) {
    proposalService = _proposalService_;
  }));

  it('should do something', function () {
    expect(!!proposalService).toBe(true);
  });

});
