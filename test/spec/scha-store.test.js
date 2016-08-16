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
  
  it('should store and read a number', function() {
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    return schaStore.set('beta', 1)
      .bind(this)
      .then(function() {
        return schaStore.get('beta');
      })
      .then(function(res) {
        expect(res).to.be.a('number');
        expect(res).to.equal(1);
      });
  });
  
  it('should store and read a boolean true', function() {
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    return schaStore.set('beta-alpha', true)
      .bind(this)
      .then(function() {
        return schaStore.get('beta-alpha');
      })
      .then(function(res) {
        expect(res).to.be.a('boolean');
        expect(res).to.be.true;
      });
  });
  
  it('should store and read a boolean false', function() {
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    return schaStore.set('beta-beta', false)
      .bind(this)
      .then(function() {
        return schaStore.get('beta-beta');
      })
      .then(function(res) {
        expect(res).to.be.a('boolean');
        expect(res).to.be.false;
      });
  });
  
  it('should store and read an Array', function() {
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    return schaStore.set('gamma', [1, 2, 3])
      .bind(this)
      .then(function() {
        return schaStore.get('gamma');
      })
      .then(function(res) {
        expect(res).to.be.an('array');
        expect(res).to.deep.equal([1, 2, 3]);
      });
  });
  
  it('should store and read an Object', function() {
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    var value = {
      a: 1,
      b: 'two',
      c: [1, 2, 3],
    };
    return schaStore.set('delta', value)
      .bind(this)
      .then(function() {
        return schaStore.get('delta');
      })
      .then(function(res) {
        expect(res).to.be.an('object');
        expect(res).to.deep.equal(value);
      });
  });

  it('should delete a value', function() {
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    return schaStore.set('epsilon', 'word')
      .bind(this)
      .then(function() {
        return schaStore.del('epsilon');
      })
      .then(function() {
        return schaStore.get('epsilon');
      })
      .then(function(res) {
        expect(res).to.be.null;
      });
  });

  it('should store with expiration', function() {
    this.timeout(5000);
    var schaStore = new SchaStore(this.prefix);
    schaStore.setClient(this.scha);
    return schaStore.set('theta', 'value', 'EX', 3)
      .bind(this)
      .then(function() {
        return schaStore.get('theta');
      })
      .then(function(res) {
        expect(res).to.be.a('string');
        expect(res).to.equal('value');

        return new Promise(function (resolve) {
          setTimeout(resolve, 3000);
        });
      })
      .then(function() {
        return schaStore.get('theta');
      })
      .then(function(res) {
        expect(res).to.be.null;
      });
  });

});