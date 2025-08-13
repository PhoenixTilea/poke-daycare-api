import StatusCodeError from "./statusCodeError";

export default class UsernameUnavailableError extends StatusCodeError {
  constructor(username: string) {
    super(`The username ${username} is unavailable. Try another.`, 403);
  }
}
