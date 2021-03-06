const { expect } = require('chai');
const { attributes } = require('../../src');

describe('creating an structure class', () => {
  describe('structure class is passed as the second parameter', () => {
    context('when structure class has a name', () => {
      it('throws with a message with structure class name', () => {
        expect(() => {
          attributes({}, class User {});
        }).to.throw(Error, /^You passed the structure class.*\(User\)`\./);
      });
    });

    context('when structure class is anonymous', () => {
      it('throws with a message with generic structure name', () => {
        // It's like this because Babel gives the name _class
        // to anonymous classes and do function auto-naming,
        // breaking browser tests
        const anonymousClass = (() => function() {})();

        expect(() => {
          attributes({}, anonymousClass);
        }).to.throw(Error, /^You passed the structure class.*\(StructureClass\)`\./);
      });
    });
  });


  describe('using class static methods and properties', () => {
    class RawUser {
      static staticMethod() {
        return 'I am on a static method';
      }
    }

    RawUser.staticProperty = 'I am a static property';

    const User = attributes({
      name: String
    })(RawUser);

    it('has access to static methods and properties', () => {
      expect(User.staticMethod()).to.equal('I am on a static method');
      expect(User.staticProperty).to.equal('I am a static property');
    });
  });

  describe('using default values for attributes', () => {
    context('when the provided default value is a function', () => {
      const User = attributes({
        age: { type: Number, default: () => 18 }
      })(class User {});

      it('defines the attribute with the default value executing the function', () => {
        const user = new User();

        expect(user.age).to.equal(18);
      });
    });

    context('when the provided default value is a property', () => {
      const User = attributes({
        age: { type: Number, default: 18 }
      })(class User {});

      it('defines the attribute with the default value of the property', () => {
        const user = new User();

        expect(user.age).to.equal(18);
      });
    });
  });
});
