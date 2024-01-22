"use strict";

const { expect } = require("chai");
const testdouble = require("testdouble");
const VerifyIt = require("../index.js");
const TestData = require("./TestData");
const { Test } = require("mocha");

const Gen = VerifyIt.Gen;

describe("Generators", () => {
  describe("word", () => {
    it("should produce a string", () => {
      Gen.word().should.be.a("String");
    });

    it("should produce different values for subsequent calls", () => {
      Gen.word().should.not.eql(Gen.word());
    });

    it("should only return a single word with no spaces", () => {
      new Array(1000).fill(0).forEach(() => Gen.word().should.not.match(/\s/));
    });

    it("should not return an empty string", () => {
      new Array(1000)
        .fill(0)
        .forEach(() => Gen.word().should.have.length.greaterThan(0));
    });
  });

  describe("string", () => {
    it("should produce a string", () => {
      Gen.string().should.be.a("String");
    });

    it("should produce different values for subsequent calls", () => {
      Gen.string().should.not.eql(Gen.string());
    });

    it("should produce different length strings for subsequent calls", () => {
      const lengths = new Array(100).fill(0).map(() => Gen.string().length);
      const lengthSet = new Set(lengths);
      lengthSet.size.should.be.greaterThan(1);
    });
  });

  describe("stringNonNumeric", () => {
    it("should produce a string", () => {
      Gen.stringNonNumeric().should.be.a("String");
    });

    it("should produce different values for subsequent calls", () => {
      Gen.stringNonNumeric().should.not.eql(Gen.stringNonNumeric());
    });

    it("should not include numeric characters", () => {
      const numerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      new Array(100).fill(0).forEach(() => {
        const generated = Gen.stringNonNumeric();
        numerals.forEach((numeral) => generated.should.not.contain(numeral));
      });
    });

    it("should not return an empty string", () => {
      new Array(1000)
        .fill(0)
        .forEach(() =>
          Gen.stringNonNumeric().should.have.length.greaterThan(0)
        );
    });
  });

  describe("stringWithLength", () => {
    it("should throw an error if no length is provided", () => {
      const expectedMessage =
        "The length of string to be generated must be provided";
      expect(() => Gen.stringWithLength()).to.throw(Error, expectedMessage);
    });

    it("should produce a string", () => {
      Gen.stringWithLength(10)().should.be.a("String");
    });

    it("should produce different values for subsequent calls", () => {
      Gen.stringWithLength(10)().should.not.eql(Gen.stringWithLength(10)());
    });

    it("should produce a string of the specified length", () => {
      const length = TestData.integer(5, 10);
      Gen.stringWithLength(length)().should.have.length(length);
    });
  });

  describe("integer", () => {
    it("should produce an integer", () => {
      const generated = Gen.integer();
      generated.should.be.a("Number");
      return Number.isInteger(generated).should.be.true;
    });

    it("should produce different values for subsequent calls", () => {
      Gen.integer().should.not.eql(Gen.integer());
    });
  });

  describe("integerBetween", () => {
    it("should throw an error if no minimum is provided", () => {
      const min = undefined;
      const max = TestData.integer(0, 200);
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the minimum is null", () => {
      const min = null;
      const max = TestData.integer(0, 200);
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if no maximum is provided", () => {
      const min = TestData.integer(0, 200);
      const max = undefined;
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the maximum is null", () => {
      const min = TestData.integer(0, 200);
      const max = null;
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the minimum is not an integer", () => {
      const min = TestData.string();
      const max = TestData.integer(0, 200);
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the minimum value is less than Number.MIN_SAFE_INTEGER", () => {
      const min = Number.MIN_SAFE_INTEGER - TestData.integer(1, 5);
      const max = TestData.integer(0, 100);
      const expectedMessage = `Minimum value must be greater than ${Number.MIN_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the maximum value is greater than Number.MAX_SAFE_INTEGER", () => {
      const min = TestData.integer(0, 100);
      const max = Number.MAX_SAFE_INTEGER + TestData.integer(1, 5);
      const expectedMessage = `Maximum value must be less than ${Number.MAX_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the minimum is greater than the maximum", () => {
      const min = TestData.integer(10, 20);
      const max = TestData.integer(0, 9);
      const expectedMessage = `Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.integerBetween(min, max)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should generate an integer between the minimum and maximum", () => {
      const min = TestData.integer(0, 100);
      const max = TestData.integer(101, 200);
      const generated = Gen.integerBetween(min, max)();
      generated.should.be.a("Number");
      generated.should.be.greaterThan(min - 1);
      generated.should.be.lessThan(max + 1);
      return Number.isInteger(generated).should.be.true;
    });

    it("should generate different integers for subsequent calls", () => {
      const gen = Gen.integerBetween(
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      );
      gen().should.not.eql(gen());
    });
  });

  describe("float", () => {
    it("should produce a number", () => {
      const generated = Gen.float();
      generated.should.be.a("Number");
    });

    it("should produce different values for subsequent calls", () => {
      Gen.float().should.not.eql(Gen.float());
    });
  });

  describe("floatBetween", () => {
    it("should throw an error if no minimum is provided", () => {
      const min = undefined;
      const max = TestData.float(0, 200);
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.floatBetween(min, max)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the minimum is null", () => {
      const min = null;
      const max = TestData.float(0, 200);
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.floatBetween(min, max)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if no maximum is provided", () => {
      const min = TestData.float(0, 200);
      const max = undefined;
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.floatBetween(min, max)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the maximum is null", () => {
      const min = TestData.float(0, 200);
      const max = null;
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.floatBetween(min, max)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the minimum is not a number", () => {
      const min = TestData.string();
      const max = TestData.float(0, 200);
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.floatBetween(min, max)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the minimum is greater than the maximum", () => {
      const min = TestData.float(10, 20);
      const max = TestData.float(0, 9);
      const expectedMessage = `Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`;
      expect(() => Gen.floatBetween(min, max)).to.throw(Error, expectedMessage);
    });

    it("should generate a number between the minimum and maximum", () => {
      const min = TestData.float(0, 100);
      const max = TestData.float(101, 200);
      const generated = Gen.floatBetween(min, max)();
      generated.should.be.a("Number");
      generated.should.be.greaterThan(min);
      generated.should.be.lessThan(max);
    });

    it("should generate different numbers for subsequent calls", () => {
      const gen = Gen.floatBetween(
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      );
      gen().should.not.eql(gen());
    });
  });

  describe("array", () => {
    it("should throw an error if no generator function is provided", () => {
      const expectedMessage = "A generator function must be provided";
      expect(() => Gen.array()).to.throw(Error, expectedMessage);
    });

    it("should generate an array if a generator function is provided", () => {
      const generator = () => 1;
      Gen.array(generator)().should.be.an("Array");
    });

    it("should generate an array with a length > 0", () => {
      const generator = () => 1;
      Gen.array(generator)().should.have.length.greaterThan(0);
    });

    it("should call the generator function lazily", () => {
      const generator = testdouble.constructor(() => 1);
      Gen.array(generator);
      testdouble.verify(generator(), { times: 0 });
    });

    it("should use the values from the generator function", () => {
      const value = TestData.string();
      const generator = () => value;
      const generated = Gen.array(generator)();
      const elementsWithCorrectValue = generated.filter(
        (element) => element === value
      );
      elementsWithCorrectValue.length.should.eql(generated.length);
    });

    it("should generate different length arrays when no length is provided", () => {
      const arrayGenerator = Gen.array(() => 1);
      const generated = new Array(10).fill(1).map(() => arrayGenerator());
      const lengthSet = new Set(generated.map((array) => array.length));
      lengthSet.size.should.be.greaterThan(1);
    });

    it("should call return the values from the generator", () => {
      const offset = TestData.integer(5, 50);
      const input = new Array(100)
        .fill(1)
        .map((value, index) => offset + index);
      let calls = 0;
      const generator = () => {
        calls = calls + 1;
        return input[calls - 1];
      };

      const array = Gen.array(generator)();
      array.should.eql(input.slice(0, array.length));
    });

    it("should generate fixed-length arrays when a length is provided", () => {
      const length = TestData.integer(5, 50);
      const arrayGenerator = Gen.array(() => 1, length);
      arrayGenerator().should.have.length(length);
    });

    it("should use the generator function when a length is provided", () => {
      const length = TestData.integer(5, 50);
      const generator = testdouble.constructor(() => 1);
      const arrayGenerator = Gen.array(generator, length);
      arrayGenerator();
      testdouble.verify(generator(), { times: length, ignoreExtraArgs: true });
    });
  });

  describe("distinct", () => {
    it("should throw an error if no generator function is provided", () => {
      const expectedMessage = "A generator function must be provided";
      expect(() => Gen.distinct()).to.throw(Error, expectedMessage);
    });

    it("should throw an error if no number of values is provided", () => {
      const expectedMessage =
        "A number of values greater than 1 must be provided";
      expect(() => Gen.distinct(() => null)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the number of values is not a number", () => {
      const expectedMessage =
        "A number of values greater than 1 must be provided";
      expect(() => Gen.distinct(() => null, "string")).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the number of values is a negative number", () => {
      const expectedMessage =
        "A number of values greater than 1 must be provided";
      expect(() => Gen.distinct(() => null, -1)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should return a generator that returns an array of values from the generator function", () => {
      const numberOfValues = TestData.integer(5, 10);
      const generator = () => TestData.string();
      Gen.distinct(generator, numberOfValues)().should.have.length(
        numberOfValues
      );
    });

    it("should call the generator function lazily", () => {
      const generator = testdouble.constructor(() => 1);
      Gen.distinct(generator, 2);
      testdouble.verify(generator(), { times: 0 });
    });

    it("should return the values from the generator", () => {
      const value1 = TestData.string();
      const value2 = TestData.string();

      let callCount = 0;
      const generator = () => {
        if (callCount === 0) {
          callCount++;
          return value1;
        } else {
          return value2;
        }
      };

      Gen.distinct(generator, 2)().should.eql([value1, value2]);
    });

    it("should continue to call the generator until distinct values are found", () => {
      const value1 = TestData.string();
      const value2 = TestData.string();

      let callCount = 0;
      const generator = () => {
        if (callCount < 2) {
          callCount++;
          return value1;
        } else {
          return value2;
        }
      };

      Gen.distinct(generator, 2)().should.eql([value1, value2]);
    });

    it("should limit subsequent calls to the generator to 10 if the result is always equal to the first value", () => {
      const expectedMessage =
        "Could not generate distinct values using the provided generator - tried 10 times";
      const generator = testdouble.constructor(() => "1");

      expect(() => Gen.distinct(generator, 10)()).to.throw(
        Error,
        expectedMessage
      );
      testdouble.verify(generator(), { times: 11 });
    });
  });

  describe("object", () => {
    it("should produce an object", () => {
      Gen.object().should.be.an("Object");
    });

    it("should produce an object with some keys", () => {
      const generated = Gen.object();
      Object.getOwnPropertyNames(generated).should.have.length.greaterThan(0);
    });

    it("should produce different objects on subsequent calls", () => {
      const first = Gen.object();
      const second = Gen.object();

      first.should.not.eql(second);
    });

    it("should produce objects with different keys on subsequent calls", () => {
      const first = Gen.object();
      const second = Gen.object();

      Object.getOwnPropertyNames(first).should.not.eql(
        Object.getOwnPropertyNames(second)
      );
    });

    it("should produce objects with different numbers of keys", () => {
      const generated = new Array(10).fill(0).map(() => Gen.object());
      const lengthSet = new Set(
        generated.map((object) => Object.getOwnPropertyNames(object).length)
      );
      lengthSet.size.should.be.greaterThan(1);
    });

    it("should produce objects with string values", () => {
      const generated = Gen.object();
      Object.getOwnPropertyNames(generated).forEach((name) => {
        generated[name].should.be.a("String");
      });
    });
  });

  describe("objectWith", () => {
    it("should throw an error if no property names are supplied", () => {
      expect(() => Gen.objectWith()).to.throw(
        Error,
        "At least one property name must be provided"
      );
    });

    it("should return an Object", () => {
      Gen.objectWith("")().should.be.an("Object");
    });

    it("should return an object with the correct number of property names", () => {
      const numberOfProperties = TestData.integer(1, 10);
      const args = new Array(numberOfProperties)
        .fill(1)
        .map(() => TestData.string(30));
      const generated = Gen.objectWith.apply(Gen, args)();
      Object.getOwnPropertyNames(generated).length.should.eql(
        numberOfProperties
      );
    });

    it("should return an object with the required property names", () => {
      const property1 = TestData.string();
      const property2 = TestData.string();

      const generated = Gen.objectWith(property1, property2)();
      Object.getOwnPropertyNames(generated).should.contain(
        property1,
        property2
      );
    });

    it("should return an object with string property values", () => {
      const property1 = TestData.string();
      const property2 = TestData.string();

      const generated = Gen.objectWith(property1, property2)();
      generated[property1].should.be.a("String");
      generated[property2].should.be.a("String");
    });

    it("should return an object with randomised property values", () => {
      const property1 = TestData.string();
      const property2 = TestData.string();

      const generated = Gen.objectWith(property1, property2)();
      generated[property1].should.not.eql(generated[property2]);
    });
  });

  describe("error", () => {
    it("should produce an error", () => {
      Gen.error().should.be.an("Error");
    });

    it("should produce an error with a message", () => {
      Gen.error().message.length.should.be.greaterThan(0);
    });

    it("should produce different messages on subsequent calls", () => {
      const first = Gen.error();
      const second = Gen.error();

      first.message.should.not.eql(second.message);
    });
  });

  describe("pick", () => {
    it("should throw an error if no values are supplied", () => {
      expect(Gen.pick).to.throw(
        Error,
        "The options to be picked from must be provided"
      );
    });

    it("should throw an error if the argument supplied is not an array", () => {
      const values = TestData.object();
      expect(() => Gen.pick(values)).to.throw(
        Error,
        "The options to be picked from must be an array"
      );
    });

    it("should throw an error if the argument supplied is empty", () => {
      expect(() => Gen.pick([])).to.throw(
        Error,
        "The options array must have at least one entry"
      );
    });

    it("should pick one of the entries from the values array", () => {
      const length = TestData.integer(5, 10);
      const values = new Array(length).fill(1).map(TestData.string);
      Gen.pick(values)().should.be.oneOf(values);
    });

    it("should pick different entries in subsequent calls", () => {
      const values = new Array(10).fill(1).map(TestData.string);
      const generated = new Array(10).fill(0).map(() => Gen.pick(values)());
      const indexSet = new Set(generated.map((value) => values.indexOf(value)));
      indexSet.size.should.be.greaterThan(1);
    });
  });

  describe("boolean", () => {
    it("should return a boolean value", () => {
      Gen.boolean().should.be.oneOf([true, false]);
    });

    it("should pick different entries in subsequent calls", () => {
      const generated = new Array(10).fill(0).map(() => Gen.boolean());
      const indexSet = new Set(generated);
      indexSet.size.should.be.greaterThan(1);
    });
  });

  describe("date", () => {
    it("should produce a date", () => {
      Gen.date().should.be.a("Date");
    });

    it("should generate different dates for subsequent calls", () => {
      Gen.date().should.not.eql(Gen.date());
    });
  });

  describe("dateBetween", () => {
    it("should throw an error if no start date is provided", () => {
      const start = undefined;
      const end = new Date("01-01-2011");
      const expectedMessage = `Both the start and end values must be dates. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the start date is null", () => {
      const start = null;
      const end = new Date("01-01-2011");
      const expectedMessage = `Both the start and end values must be dates. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the start date is not a date", () => {
      const start = TestData.string();
      const end = new Date("01-01-2011");
      const expectedMessage = `Both the start and end values must be dates. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the start date is before 01-01-1970", () => {
      const start = new Date("31-12-1969");
      const end = new Date("01-01-2011");
      const expectedMessage = `Both the start and end dates must be valid dates on or after ${new Date(
        0
      )}. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if no end date is provided", () => {
      const start = new Date("01-01-2001");
      const end = undefined;
      const expectedMessage = `Both the start and end values must be dates. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the end date is null", () => {
      const start = new Date("01-01-2001");
      const end = null;
      const expectedMessage = `Both the start and end values must be dates. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the end date is not a date", () => {
      const start = new Date("01-01-2001");
      const end = TestData.string();
      const expectedMessage = `Both the start and end values must be dates. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the start and end dates are before 01-01-1970", () => {
      const start = new Date("30-12-1969");
      const end = new Date("31-12-1969");
      const expectedMessage = `Both the start and end dates must be valid dates on or after ${new Date(
        0
      )}. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should throw an error if the start date is after the end date", () => {
      const start = new Date("02-01-2011");
      const end = new Date("01-01-2011");
      const expectedMessage = `Start date must be before the end date. Provided start: ${start}, end: ${end}`;
      expect(() => Gen.dateBetween(start, end)).to.throw(
        Error,
        expectedMessage
      );
    });

    it("should produce a date between two dates", () => {
      const start = new Date("01-01-2001");
      const end = new Date("01-01-2011");
      const generated = Gen.dateBetween(start, end)();
      generated.should.be.a("Date");
      generated.should.greaterThan(new Date(start - 1));
      generated.should.lessThan(new Date(end + 1));
    });

    it("should generate different dates for subsequent calls", () => {
      const gen = Gen.dateBetween(
        new Date("01-01-2001"),
        new Date("01-01-2011")
      );
      gen().should.not.eql(gen());
    });
  });

  describe("dateAfter", () => {
    it("should throw an error if no start date is provided", () => {
      const start = undefined;
      const expectedMessage = `The start value must be a date. Provided start: ${start}`;
      expect(() => Gen.dateAfter(start)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the start date is null", () => {
      const start = null;
      const expectedMessage = `The start value must be a date. Provided start: ${start}`;
      expect(() => Gen.dateAfter(start)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the start date is not a date", () => {
      const start = TestData.string();
      const expectedMessage = `The start value must be a date. Provided start: ${start}`;
      expect(() => Gen.dateAfter(start)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the start date is before 01-01-1970", () => {
      const start = new Date("31-12-1969");
      const expectedMessage = `The start date must be a valid date on or after ${new Date(
        0
      )}. Provided start: ${start}`;
      expect(() => Gen.dateAfter(start)).to.throw(Error, expectedMessage);
    });

    it("should produce a date after the chosen date", () => {
      const start = new Date("01-01-2001");
      const generated = Gen.dateAfter(start)();
      generated.should.be.a("Date");
      generated.should.greaterThan(new Date(start - 1));
    });

    it("should generate different dates for subsequent calls", () => {
      const gen = Gen.dateAfter(new Date("01-01-2001"));
      gen().should.not.eql(gen());
    });
  });

  describe("dateBefore", () => {
    it("should throw an error if no end date is provided", () => {
      const end = undefined;
      const expectedMessage = `The end value must be a date. Provided end: ${end}`;
      expect(() => Gen.dateBefore(end)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the end date is null", () => {
      const end = null;
      const expectedMessage = `The end value must be a date. Provided end: ${end}`;
      expect(() => Gen.dateBefore(end)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the end date is not a date", () => {
      const end = TestData.string();
      const expectedMessage = `The end value must be a date. Provided end: ${end}`;
      expect(() => Gen.dateBefore(end)).to.throw(Error, expectedMessage);
    });

    it("should throw an error if the end date is before 01-01-1970", () => {
      const end = new Date("31-12-1969");
      const expectedMessage = `The end date must be a valid date on or after ${new Date(
        0
      )}. Provided end: ${end}`;
      expect(() => Gen.dateBefore(end)).to.throw(Error, expectedMessage);
    });

    it("should produce a date before the chosen date", () => {
      const end = new Date("01-01-2001");
      const generated = Gen.dateBefore(end)();
      generated.should.be.a("Date");
      generated.should.lessThan(new Date(end + 1));
    });

    it("should generate different dates for subsequent calls", () => {
      const gen = Gen.dateBefore(new Date("01-01-2001"));
      gen().should.not.eql(gen());
    });
  });
});
