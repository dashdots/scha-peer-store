/**
 * @fileOverview Base API Surface tests.
 */
var chai = require('chai');
var expect = chai.expect;

var SchaStore = require('../..').SchaStore;

describe('SchaStore API Surface', function() {
  it('should be a function', function() {
    expect(SchaStore).to.be.a('function');
    expect(SchaStore.BaseEntity).to.be.a('function');
    expect(SchaStore.BaseModel).to.be.a('function');
    expect(SchaStore.BaseController).to.be.a('function');
    expect(SchaStore.BaseSchaModel).to.be.a('function');
    expect(SchaStore.BaseMidware).to.be.a('function');
    expect(SchaStore.options).to.be.a('function');
  });
});