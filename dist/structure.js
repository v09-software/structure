(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("joi"));
	else if(typeof define === 'function' && define.amd)
		define("Structure", ["lodash", "joi"], factory);
	else if(typeof exports === 'object')
		exports["Structure"] = factory(require("lodash"), require("joi"));
	else
		root["Structure"] = factory(root["_"], root["joi"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_13__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  attributes: __webpack_require__(2)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(3),
	    normalizeSchema = _require.normalizeSchema;

	var _require2 = __webpack_require__(22),
	    getInitialValues = _require2.getInitialValues;

	var _require3 = __webpack_require__(20),
	    SCHEMA = _require3.SCHEMA;

	var _require4 = __webpack_require__(23),
	    attributesDescriptor = _require4.attributesDescriptor,
	    validationDescriptor = _require4.validationDescriptor,
	    serializationDescriptor = _require4.serializationDescriptor;

	var define = Object.defineProperty;

	function attributesDecorator(declaredSchema) {
	  if (arguments.length > 1) {
	    var ErroneousPassedClass = arguments[1];

	    var errorMessage = 'You passed the structure class as the second parameter of attributes(). The expected usage is `attributes(schema)(' + (ErroneousPassedClass.name || 'StructureClass') + ')`.';

	    throw new Error(errorMessage);
	  }

	  return function decorator(Class) {
	    var WrapperClass = new Proxy(Class, {
	      construct: function construct(target, constructorArgs, newTarget) {
	        var instance = Reflect.construct(target, constructorArgs, newTarget);
	        var passedAttributes = constructorArgs[0] || {};

	        instance.attributes = getInitialValues(passedAttributes, declaredSchema, instance);

	        return instance;
	      }
	    });

	    declaredSchema = normalizeSchema(declaredSchema);

	    if (WrapperClass[SCHEMA]) {
	      declaredSchema = Object.assign({}, WrapperClass[SCHEMA], declaredSchema);
	    }

	    define(WrapperClass, SCHEMA, {
	      value: declaredSchema
	    });

	    define(WrapperClass.prototype, SCHEMA, {
	      value: declaredSchema
	    });

	    define(WrapperClass.prototype, 'attributes', attributesDescriptor);

	    Object.keys(declaredSchema).forEach(function (attr) {
	      define(WrapperClass.prototype, attr, {
	        enumerable: true,
	        get: function get() {
	          return this.attributes[attr];
	        },
	        set: function set(value) {
	          this.attributes[attr] = declaredSchema[attr].coerce(value);
	        }
	      });
	    });

	    define(WrapperClass.prototype, 'validate', validationDescriptor);

	    define(WrapperClass.prototype, 'toJSON', serializationDescriptor);

	    return WrapperClass;
	  };
	}

	module.exports = attributesDecorator;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _require = __webpack_require__(4),
	    coercionFor = _require.coercionFor;

	var _require2 = __webpack_require__(12),
	    validationForAttribute = _require2.validationForAttribute,
	    validationForSchema = _require2.validationForSchema;

	var _require3 = __webpack_require__(20),
	    VALIDATE = _require3.VALIDATE;

	function normalizeAttribute(attribute, attributeName) {
	  switch (typeof attribute === 'undefined' ? 'undefined' : _typeof(attribute)) {
	    case 'object':
	      if (!attribute.type) {
	        throw new Error('Missing type for attribute: ' + attributeName + '.');
	      }

	      if (typeof attribute.type !== 'function') {
	        throw new TypeError('Attribute type must be a constructor: ' + attributeName + '.');
	      }

	      if (attribute.itemType) {
	        attribute.itemType = normalizeAttribute(attribute.itemType, 'itemType');
	      }

	      return Object.assign({}, attribute, {
	        coerce: coercionFor(attribute, attribute.itemType),
	        validation: validationForAttribute(attribute)
	      });

	    case 'function':
	      var normalizedType = { type: attribute };
	      normalizedType.coerce = coercionFor(normalizedType);
	      normalizedType.validation = validationForAttribute(normalizedType);

	      return normalizedType;

	    default:
	      throw new TypeError('Invalid type for attribute: ' + attributeName + '.');
	  }
	}

	function normalizeSchema(rawSchema) {
	  var schema = Object.create(null);

	  Object.keys(rawSchema).forEach(function (attributeName) {
	    schema[attributeName] = normalizeAttribute(rawSchema[attributeName], attributeName);
	  });

	  var schemaValidation = validationForSchema(schema);

	  Object.defineProperty(schema, VALIDATE, {
	    value: schemaValidation
	  });

	  return schema;
	}

	exports.normalizeSchema = normalizeSchema;
	exports.VALIDATE = VALIDATE;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayCoercionFor = __webpack_require__(5);
	var genericCoercionFor = __webpack_require__(7);

	var types = [__webpack_require__(8), __webpack_require__(10), __webpack_require__(11)];

	function coercionFor(typeDescriptor, itemTypeDescriptor) {
	  if (itemTypeDescriptor) {
	    return arrayCoercionFor(typeDescriptor, itemTypeDescriptor);
	  }

	  var coercion = types.find(function (c) {
	    return c.type === typeDescriptor.type;
	  });

	  if (!coercion) {
	    return genericCoercionFor(typeDescriptor);
	  }

	  return function coerce(value) {
	    if (value === undefined) {
	      return;
	    }

	    if (coercion.test && coercion.test(value)) {
	      return value;
	    }

	    return coercion.coerce(value);
	  };
	}

	exports.coercionFor = coercionFor;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var _require = __webpack_require__(6),
	    ARRAY_OR_ITERABLE = _require.ARRAY_OR_ITERABLE;

	module.exports = function arrayCoercionFor(typeDescriptor, itemTypeDescriptor) {
	  return function coerceArray(value) {
	    if (value === undefined) {
	      return;
	    }

	    if (value === null || value.length === undefined && !value[Symbol.iterator]) {
	      throw new TypeError(ARRAY_OR_ITERABLE);
	    }

	    if (value[Symbol.iterator]) {
	      value = Array.apply(undefined, _toConsumableArray(value));
	    }

	    var coercedValue = new typeDescriptor.type();

	    for (var i = 0; i < value.length; i++) {
	      coercedValue.push(itemTypeDescriptor.coerce(value[i]));
	    }

	    return coercedValue;
	  };
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  NON_OBJECT_ATTRIBUTES: '#attributes can\'t be set to a non-object.',
	  ARRAY_OR_ITERABLE: 'Value must be iterable or array-like.'
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function genericCoercionFor(typeDescriptor) {
	  return function coerce(value) {
	    if (value === undefined) {
	      return;
	    }

	    if (value instanceof typeDescriptor.type) {
	      return value;
	    }

	    return new typeDescriptor.type(value);
	  };
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isString = _require.isString;

	module.exports = {
	  type: String,
	  test: isString,
	  coerce: function coerce(value) {
	    if (value === null) {
	      return '';
	    }

	    return String(value);
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isNumber = _require.isNumber;

	module.exports = {
	  type: Number,
	  test: isNumber,
	  coerce: function coerce(value) {
	    if (value === null) {
	      return 0;
	    }

	    return Number(value);
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  type: Boolean,
	  coerce: function coerce(value) {
	    return Boolean(value);
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(13);

	var validations = [__webpack_require__(14), __webpack_require__(16), __webpack_require__(17), __webpack_require__(18)];

	var nestedValidation = __webpack_require__(19);
	var arrayValidation = __webpack_require__(21);

	function validationForAttribute(typeDescriptor) {
	  if (typeDescriptor.itemType !== undefined) {
	    return arrayValidation(typeDescriptor, typeDescriptor.itemType);
	  }

	  var validation = validations.find(function (v) {
	    return v.type === typeDescriptor.type;
	  });

	  if (!validation) {
	    return nestedValidation(typeDescriptor);
	  }

	  return validation.createJoiSchema(typeDescriptor);
	}

	var mapDetail = function mapDetail(_ref) {
	  var message = _ref.message,
	      path = _ref.path;
	  return { message: message, path: path };
	};

	var validatorOptions = {
	  abortEarly: false,
	  convert: false,
	  allowUnknown: false
	};

	function validationForSchema(schema) {
	  var schemaValidation = {};

	  Object.keys(schema).forEach(function (attributeName) {
	    schemaValidation[attributeName] = schema[attributeName].validation;
	  });

	  var joiValidation = joi.object().keys(schemaValidation);

	  return {
	    validate: function validate(structure) {
	      var validationErrors;

	      var _joiValidation$valida = joiValidation.validate(structure, validatorOptions),
	          error = _joiValidation$valida.error;

	      if (error) {
	        validationErrors = error.details.map(mapDetail);
	      }

	      return validationErrors;
	    }
	  };
	}

	exports.validationForAttribute = validationForAttribute;
	exports.validationForSchema = validationForSchema;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(13);

	var _require = __webpack_require__(15),
	    mapToJoi = _require.mapToJoi,
	    equalOption = _require.equalOption;

	module.exports = {
	  type: String,
	  joiMappings: [['minLength', 'min', true], ['maxLength', 'max', true], ['exactLength', 'length', true], ['regex', 'regex', true], ['alphanumeric', 'alphanum'], ['lowerCase', 'lowercase'], ['upperCase', 'uppercase'], ['email', 'email'], ['required', 'required']],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = joi.string();

	    if (typeDescriptor.empty) {
	      joiSchema = joiSchema.allow('');
	    }

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var joi = __webpack_require__(13);

	var _require = __webpack_require__(9),
	    isPlainObject = _require.isPlainObject;

	exports.mapToJoi = function mapToJoi(typeDescriptor, _ref) {
	  var initial = _ref.initial,
	      mappings = _ref.mappings;

	  return mappings.reduce(function (joiSchema, _ref2) {
	    var _ref3 = _slicedToArray(_ref2, 3),
	        optionName = _ref3[0],
	        joiMethod = _ref3[1],
	        passValueToJoi = _ref3[2];

	    if (typeDescriptor[optionName] === undefined) {
	      return joiSchema;
	    }

	    if (passValueToJoi) {
	      return joiSchema[joiMethod](typeDescriptor[optionName]);
	    }

	    return joiSchema[joiMethod]();
	  }, initial);
	};

	function mapValueOrReference(valueOrReference) {
	  if (isPlainObject(valueOrReference)) {
	    return joi.ref(valueOrReference.attr);
	  }

	  return valueOrReference;
	}

	exports.mapToJoiWithReference = function mapToJoiWithReference(typeDescriptor, _ref4) {
	  var initial = _ref4.initial,
	      mappings = _ref4.mappings;

	  return mappings.reduce(function (joiSchema, _ref5) {
	    var _ref6 = _slicedToArray(_ref5, 2),
	        optionName = _ref6[0],
	        joiMethod = _ref6[1];

	    var optionValue = typeDescriptor[optionName];

	    if (optionValue === undefined) {
	      return joiSchema;
	    }

	    optionValue = mapValueOrReference(optionValue);

	    return joiSchema[joiMethod](optionValue);
	  }, initial);
	};

	exports.equalOption = function equalOption(typeDescriptor, _ref7) {
	  var initial = _ref7.initial;

	  var possibilities = typeDescriptor.equal;

	  if (possibilities === undefined) {
	    return initial;
	  }

	  if (Array.isArray(possibilities)) {
	    possibilities = possibilities.map(mapValueOrReference);
	  } else {
	    possibilities = mapValueOrReference(possibilities);
	  }

	  return initial.equal(possibilities);
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(13);

	var _require = __webpack_require__(15),
	    mapToJoi = _require.mapToJoi,
	    mapToJoiWithReference = _require.mapToJoiWithReference,
	    equalOption = _require.equalOption;

	module.exports = {
	  type: Number,
	  joiMappings: [['integer', 'integer'], ['precision', 'precision', true], ['multiple', 'multiple', true], ['positive', 'positive', true], ['negative', 'negative', true], ['required', 'required']],
	  valueOrRefOptions: [['min', 'min'], ['greater', 'greater'], ['max', 'max'], ['less', 'less']],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = mapToJoiWithReference(typeDescriptor, {
	      initial: joi.number(),
	      mappings: this.valueOrRefOptions
	    });

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
	  }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(13);

	var _require = __webpack_require__(15),
	    mapToJoi = _require.mapToJoi,
	    equalOption = _require.equalOption;

	module.exports = {
	  type: Boolean,
	  joiMappings: [['required', 'required']],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = joi.boolean();

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(13);

	var _require = __webpack_require__(15),
	    mapToJoi = _require.mapToJoi,
	    mapToJoiWithReference = _require.mapToJoiWithReference,
	    equalOption = _require.equalOption;

	module.exports = {
	  type: Date,
	  joiMappings: [['required', 'required']],
	  valueOrRefOptions: [['min', 'min'], ['max', 'max']],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = mapToJoiWithReference(typeDescriptor, {
	      initial: joi.date(),
	      mappings: this.valueOrRefOptions
	    });

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
	  }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(13);

	var _require = __webpack_require__(20),
	    SCHEMA = _require.SCHEMA;

	module.exports = function nestedValidation(typeDescriptor) {
	  var joiSchema = joi.object();
	  var typeSchema = typeDescriptor.type[SCHEMA];

	  if (typeSchema !== undefined) {
	    var nestedValidations = {};

	    Object.keys(typeSchema).forEach(function (v) {
	      nestedValidations[v] = typeSchema[v].validation;
	    });

	    joiSchema = joiSchema.keys(nestedValidations);
	  }

	  if (typeDescriptor.required) {
	    joiSchema = joiSchema.required();
	  }

	  return joiSchema;
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  SCHEMA: Symbol('schema'),
	  ATTRIBUTES: Symbol('attributes'),
	  VALIDATE: Symbol('validate')
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(13);

	var _require = __webpack_require__(15),
	    mapToJoi = _require.mapToJoi;

	var joiMappings = [['required', 'required'], ['minLength', 'min', true], ['maxLength', 'max', true], ['exactLength', 'length', true]];

	module.exports = function arrayValidation(typeDescriptor, itemTypeDescriptor) {
	  var joiSchema = joi.array().items(itemTypeDescriptor.validation);
	  var canBeSparse = typeDescriptor.sparse === undefined || typeDescriptor.sparse;

	  joiSchema = joiSchema.sparse(canBeSparse);

	  joiSchema = mapToJoi(typeDescriptor, { initial: joiSchema, mappings: joiMappings });

	  return joiSchema;
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	function getValue(value, instance) {
	  if (typeof value === 'function') {
	    return value(instance);
	  }

	  return value;
	}

	function getInitialValues(attributes, schema, instance) {
	  for (var attr in schema) {
	    attributes[attr] = attributes[attr] === undefined ? getValue(schema[attr].default, instance) : attributes[attr];
	  }

	  return attributes;
	}

	exports.getInitialValues = getInitialValues;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _require = __webpack_require__(20),
	    SCHEMA = _require.SCHEMA,
	    ATTRIBUTES = _require.ATTRIBUTES,
	    VALIDATE = _require.VALIDATE;

	var _require2 = __webpack_require__(6),
	    NON_OBJECT_ATTRIBUTES = _require2.NON_OBJECT_ATTRIBUTES;

	var _require3 = __webpack_require__(24),
	    serialize = _require3.serialize;

	var createAttrs = function createAttrs() {
	  return Object.create(null);
	};
	var define = Object.defineProperty;
	var OBJECT_TYPE = 'object';

	exports.attributesDescriptor = {
	  get: function get() {
	    return this[ATTRIBUTES];
	  },
	  set: function set(newAttributes) {
	    if (!newAttributes || (typeof newAttributes === 'undefined' ? 'undefined' : _typeof(newAttributes)) !== OBJECT_TYPE) {
	      throw new TypeError(NON_OBJECT_ATTRIBUTES);
	    }

	    var attributes = createAttrs();
	    var schema = this[SCHEMA];

	    for (var attrName in schema) {
	      attributes[attrName] = schema[attrName].coerce(newAttributes[attrName]);
	    }

	    define(this, ATTRIBUTES, {
	      configurable: true,
	      value: attributes
	    });
	  }
	};

	exports.validationDescriptor = {
	  value: function validate() {
	    var validation = this[SCHEMA][VALIDATE];
	    var serializedStructure = this.toJSON();

	    var errors = validation.validate(serializedStructure);

	    if (errors) {
	      return {
	        valid: false,
	        errors: errors
	      };
	    }

	    return { valid: true };
	  }
	};

	exports.serializationDescriptor = {
	  value: function toJSON() {
	    return serialize(this);
	  }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(20),
	    SCHEMA = _require.SCHEMA;

	function serialize(structure) {
	  if (structure === undefined) {
	    return;
	  }

	  var schema = structure[SCHEMA];
	  var serializedStructure = Object.create(null);

	  for (var attrName in schema) {
	    var attribute = structure[attrName];

	    if (attribute == null) {
	      continue;
	    }

	    var serializedValue = void 0;

	    if (schema[attrName].itemType && schema[attrName].itemType.type[SCHEMA] !== undefined) {
	      serializedValue = attribute.map(serialize);
	    } else if (schema[attrName].type[SCHEMA] !== undefined) {
	      serializedValue = serialize(attribute);
	    } else {
	      serializedValue = attribute;
	    }

	    serializedStructure[attrName] = serializedValue;
	  }

	  return serializedStructure;
	}

	exports.serialize = serialize;

/***/ }
/******/ ])
});
;