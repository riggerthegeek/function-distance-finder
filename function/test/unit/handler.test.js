/**
 * handler.test
 */

/* Node modules */

/* Third-party modules */
const yml = require('js-yaml');

/* Files */
const { expect, proxyquire, sinon } = require('../helpers/setup');

describe('Handler tests', function () {

  beforeEach(function () {
    this.distance = {
      get: sinon.stub(),
    };

    this.handler = proxyquire('../function/handler', {
      'google-distance': this.distance,
    });
  });

  describe('JSON input', function () {

    it('should throw an error if no opts object', function () {
      return this.handler()
        .then(() => {
          throw new Error('invalid');
        })
        .catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('DATA MISSING: start');
        });
    });

    it('should throw an error if no start postcode', function () {
      const input = JSON.stringify({
        start: null
      });

      return this.handler(input)
        .then(() => {
          throw new Error('invalid');
        }).catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('DATA MISSING: start');
        });
    });

    it('should throw an error if no dest postcode', function () {
      const input = JSON.stringify({
        start: 'AB12 3CD',
        dest: null,
      });

      return this.handler(input)
        .then(() => {
          throw new Error('invalid');
        }).catch(err => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('DATA MISSING: dest');
        });
    });

    it('should get single journey if no return param', function () {
      this.distance.get
        .withArgs({
          origin: 'AB12 3CD',
          destination: 'EF34 5GH',
          mode: undefined,
          avoid: undefined,
        })
        .yields(null, {
          distanceValue: 1234,
        });

      const input = JSON.stringify({
        start: 'AB12 3CD',
        dest: 'EF34 5GH'
      });

      return this.handler(input)
        .then((totalDistance) => {
          expect(totalDistance).to.be.eql('1234');
          expect(this.distance.get).to.be.calledOnce;
          expect(this.distance.get).to.be.calledWith({
            origin: 'AB12 3CD',
            destination: 'EF34 5GH',
            mode: undefined,
            avoid: undefined,
          });
        });
    });

    it('should get single journey if return is false', function () {
      this.distance.get
        .withArgs({
          origin: 'start postcode',
          destination: 'dest postcode',
          mode: 'journey mode',
          avoid: 'journey avoid',
        })
        .yields(null, {
          distanceValue: 4323480,
        });

      const input = JSON.stringify({
        start: 'start postcode',
        dest: 'dest postcode',
        mode: 'journey mode',
        avoid: 'journey avoid',
      });

      return this.handler(input)
        .then((totalDistance) => {
          expect(totalDistance).to.be.eql('4323480');
          expect(this.distance.get).to.be.calledOnce;
          expect(this.distance.get).to.be.calledWith({
            origin: 'start postcode',
            destination: 'dest postcode',
            mode: 'journey mode',
            avoid: 'journey avoid',
          });
        });
    });

    it('should get return journey if return is true', function () {
      this.distance.get
        .withArgs({
          origin: 'ab12 3cd',
          destination: 'ef45 6gh',
          mode: undefined,
          avoid: undefined,
        })
        .yields(null, {
          distanceValue: 10000,
        });

      this.distance.get
        .withArgs({
          origin: 'ef45 6gh',
          destination: 'ab12 3cd',
          mode: undefined,
          avoid: undefined,
        })
        .yields(null, {
          distanceValue: 20000,
        });

      const input = JSON.stringify({
        start: 'ab12 3cd',
        dest: 'ef45 6gh',
        return: true,
      });

      return this.handler(input)
        .then((totalDistance) => {
          expect(totalDistance).to.be.eql('30000');
          expect(this.distance.get).to.be.calledTwice;
          expect(this.distance.get).to.be.calledWith({
            origin: 'ab12 3cd',
            destination: 'ef45 6gh',
            mode: undefined,
            avoid: undefined,
          });
          expect(this.distance.get).to.be.calledWith({
            origin: 'ef45 6gh',
            destination: 'ab12 3cd',
            mode: undefined,
            avoid: undefined,
          });
        });
    });

  });

  describe('YAML input', function () {

    it('should throw an error if no opts object', function () {
      return this.handler()
        .then(() => {
          throw new Error('invalid');
        })
        .catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('DATA MISSING: start');
        });
    });

    it('should throw an error if no start postcode', function () {
      const input = yml.safeDump({
        start: null
      });

      return this.handler(input)
        .then(() => {
          throw new Error('invalid');
        }).catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('DATA MISSING: start');
        });
    });

    it('should throw an error if no dest postcode', function () {
      const input = yml.safeDump({
        start: 'AB12 3CD',
        dest: null,
      });

      return this.handler(input)
        .then(() => {
          throw new Error('invalid');
        }).catch(err => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('DATA MISSING: dest');
        });
    });

    it('should get single journey if no return param', function () {
      this.distance.get
        .withArgs({
          origin: 'AB12 3CD',
          destination: 'EF34 5GH',
          mode: undefined,
          avoid: undefined,
        })
        .yields(null, {
          distanceValue: 1234,
        });

      const input = yml.safeDump({
        start: 'AB12 3CD',
        dest: 'EF34 5GH'
      });

      return this.handler(input)
        .then((totalDistance) => {
          expect(totalDistance).to.be.eql('1234');
          expect(this.distance.get).to.be.calledOnce;
          expect(this.distance.get).to.be.calledWith({
            origin: 'AB12 3CD',
            destination: 'EF34 5GH',
            mode: undefined,
            avoid: undefined,
          });
        });
    });

    it('should get single journey if return is false', function () {
      this.distance.get
        .withArgs({
          origin: 'start postcode',
          destination: 'dest postcode',
          mode: 'journey mode',
          avoid: 'journey avoid',
        })
        .yields(null, {
          distanceValue: 4323480,
        });

      const input = yml.safeDump({
        start: 'start postcode',
        dest: 'dest postcode',
        mode: 'journey mode',
        avoid: 'journey avoid',
      });

      return this.handler(input)
        .then((totalDistance) => {
          expect(totalDistance).to.be.eql('4323480');
          expect(this.distance.get).to.be.calledOnce;
          expect(this.distance.get).to.be.calledWith({
            origin: 'start postcode',
            destination: 'dest postcode',
            mode: 'journey mode',
            avoid: 'journey avoid',
          });
        });
    });

    it('should get return journey if return is true', function () {
      this.distance.get
        .withArgs({
          origin: 'ab12 3cd',
          destination: 'ef45 6gh',
          mode: undefined,
          avoid: undefined,
        })
        .yields(null, {
          distanceValue: 10000,
        });

      this.distance.get
        .withArgs({
          origin: 'ef45 6gh',
          destination: 'ab12 3cd',
          mode: undefined,
          avoid: undefined,
        })
        .yields(null, {
          distanceValue: 20000,
        });

      const input = yml.safeDump({
        start: 'ab12 3cd',
        dest: 'ef45 6gh',
        return: true,
      });

      return this.handler(input)
        .then((totalDistance) => {
          expect(totalDistance).to.be.eql('30000');
          expect(this.distance.get).to.be.calledTwice;
          expect(this.distance.get).to.be.calledWith({
            origin: 'ab12 3cd',
            destination: 'ef45 6gh',
            mode: undefined,
            avoid: undefined,
          });
          expect(this.distance.get).to.be.calledWith({
            origin: 'ef45 6gh',
            destination: 'ab12 3cd',
            mode: undefined,
            avoid: undefined,
          });
        });
    });

  });

});
