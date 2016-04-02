var assert = require('assert');
var Index = require('../src/index');

describe('Index', function () {
  it('creates an instance', function () {
    assert.equal(typeof new Index, 'object');
  });
});
