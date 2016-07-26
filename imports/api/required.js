export class RequiredError extends Error {
  /**
   * RequiredError constructor
   *
   * @param {String} message
   * @param {String} filename
   * @param {Int} lineNumber
   */
  constructor(message, filename, lineNumber) {
    super(message, filename, lineNumber);

    this.name = 'RequiredError';
  }
}

/**
 * Throws a RequiredError when called.
 *
 * @throws RequiredError
 */
function required() {
  throw new RequiredError('Missing parameter !');
}

export default required;
