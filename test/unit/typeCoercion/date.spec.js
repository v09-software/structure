const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Date', () => {
    const User = attributes({
      birth: Date
    })(class User {});

    it('does not coerce if value is already a date', () => {
      const birth = new Date();

      const user = new User({ birth });

      expect(user.birth).to.not.equal(new Date(birth.toString()));
      expect(user.birth).to.eql(birth);
    });

    it('does not coerces undefined', () => {
      const user = new User({
        birth: undefined
      });

      expect(user.birth).to.be.undefined;
    });

    it('coerces string to date', () => {
      const user = new User({
        birth: 'Feb 3, 1892'
      });

      expect(user.birth).to.eql(new Date('Feb 3, 1892'));
    });

    it('coerces null to first date on Unix time', () => {
      const user = new User({
        birth: null
      });

      expect(user.birth).to.eql(new Date('1970-01-01T00:00:00'));
    });
  });
});
