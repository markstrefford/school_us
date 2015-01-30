'use strict';

describe('Service: Postcodevalidation', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var Postcodevalidation;
  beforeEach(inject(function (_Postcodevalidation_) {
    Postcodevalidation = _Postcodevalidation_;
  }));

  it('should do something', function () {
    expect(!!Postcodevalidation).toBe(true);
  });

});
