export default class CError extends Error {
  public readonly message: string
  public readonly code: number
  public readonly status: number
  public readonly detail: string
  constructor (message: string, code: number, status: number = 500, detail?: string) {
    super()
    this.message = message
    this.code = code
    this.status = status
    this.detail = detail
  }
}
