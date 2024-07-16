/**
 * Class representing a database error.
 */
export class DatabaseError {
  _error: number;
  _message: string;
  _dbResponse: any;

  /**
   * Creates an instance of DatabaseError.
   * @param {number} error - The error code.
   * @param {string} message - The error message.
   * @param {any} dbResponse - The database response associated with the error.
   */
  constructor(error: number, message: string, dbResponse: any) {
    this._error = error;
    this._message = message;
    this._dbResponse = dbResponse;
  }
}
