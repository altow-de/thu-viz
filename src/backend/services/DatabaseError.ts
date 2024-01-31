export class DatabaseError {
  _error: number;
  _message: string;
  _dbResponse: any;

  constructor(error: number, message: string, dbResponse: any) {
    this._error = error;
    this._message = message;
    this._dbResponse = dbResponse;
  }
}
