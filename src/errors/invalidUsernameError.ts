import StatusCodeError from "./statusCodeError";

export default class InvalidUsernameError extends StatusCodeError {
  constructor(reason: string) {
    super(`Invalid username: ${reason}`, 400);
  }
}
