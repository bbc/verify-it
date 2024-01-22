"use strict";

const DateGenerators = function (random) {
  this.date = () =>
    random.date(
      new Date(0),
      new Date(random.integer(0, Number.MAX_SAFE_INTEGER))
    );

  this.dateBetween = (start, end) => {
    if (!(start instanceof Date) || !(end instanceof Date)) {
      throw new Error(
        `Both the start and end values must be dates. Provided start: ${start}, end: ${end}`
      );
    }

    if (isNaN(start) || isNaN(end)) {
      throw new Error(
        `Both the start and end dates must be valid dates on or after ${new Date(
          0
        )}. Provided start: ${start}, end: ${end}`
      );
    }

    if (start > end) {
      throw new Error(
        `Start date must be before the end date. Provided start: ${start}, end: ${end}`
      );
    }

    return () => random.date(new Date(start), new Date(end));
  };

  this.dateAfter = (start) => {
    if (!(start instanceof Date)) {
      throw new Error(
        `The start value must be a date. Provided start: ${start}`
      );
    }

    if (isNaN(start)) {
      throw new Error(
        `The start date must be a valid date on or after ${new Date(
          0
        )}. Provided start: ${start}`
      );
    }

    return () =>
      random.date(
        new Date(start),
        new Date(random.integer(start, Number.MAX_SAFE_INTEGER))
      );
  };

  this.dateBefore = (end) => {
    if (!(end instanceof Date)) {
      throw new Error(`The end value must be a date. Provided end: ${end}`);
    }

    if (isNaN(end)) {
      throw new Error(
        `The end date must be a valid date on or after ${new Date(
          0
        )}. Provided end: ${end}`
      );
    }

    return () => random.date(new Date(random.integer(0, end)), new Date(end));
  };
};

module.exports = DateGenerators;
