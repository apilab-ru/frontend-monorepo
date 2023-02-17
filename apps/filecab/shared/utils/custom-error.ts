export class CustomError extends Error {
  constructor(
      // @ts-ignore
    public name,
      // @ts-ignore
    public message,
    public payload?: Object,
  ) {
    super(message);
  }
}
