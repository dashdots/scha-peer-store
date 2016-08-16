/**
 * @fileOverview Full API tests.
 */
var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

var SchaStore = require('../..').SchaStore;

describe('Full API Tests', function() {

  beforeEach(function() {
    return SchaStore.getClient()
      .bind(this)
      .then(function(scha) {
        this.scha = scha;
      });
  });

  beforeEach(function() {
    this.prefix = 'test.scha-simple-store.' + Date.now() + '.';
  });

  it('should store and read a string', function() {
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    return schaStore.set('alpha', 'word')
      .bind(this)
      .then(function() {
        return schaStore.get('alpha');
      })
      .then(function(res) {
        expect(res).to.be.a('string');
        expect(res).to.equal('word');
      });
  });

});