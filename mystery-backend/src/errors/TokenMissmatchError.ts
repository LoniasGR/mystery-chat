export class TokenMissmatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenMissmatchError";
  }
}
