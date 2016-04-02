var assert = require('assert');
var sinon = require('sinon');

var Index = require('../src/index');

describe('Index', function () {
  describe('processWebhook', function () {
    it('creates an instance', function () {
      var trackerClient = {
        project: sinon.stub().returns({
        })
      };
      Index.processWebhook(null, trackerClient, {
        project: { id: 1234 },
        primary_resources: []
      });
    });
  });
});
