export class RError extends Error {
  readonly code: number
  constructor(message: string, code = 500) {
    super(message)
    this.code = code
  }
}
