/**
 * Params is a wrapper around URLSearchParams that supports multiple prefixes for parameters.
 */
export default class Params extends URLSearchParams {
  private readonly _prefixes: string[]

  /**
   * Create a new Params based on the given input and prefixes.
   *
   * @param input The input parameters to parse
   * @param prefixes The prefixes
   */
  constructor(input: string, prefixes: string[]) {
    super(input)
    this._prefixes = prefixes
  }

  /**
   * Delete the parameters with the given name
   *
   * @param name The parameter name
   */
  delete(name: string): void {
    for (const prefix of this._prefixes) {
      super.delete(`${prefix}${name}`)
    }
  }

  /**
   * Get the value of the given parameter. If multiple exist with the prefixes, then the one with the first
   * prefix is returned.
   *
   * @param name The parameter name
   */
  get(name: string): string | null {
    for (const prefix of this._prefixes) {
      const value = super.get(`${prefix}${name}`)
      if (value) {
        return value
      }
    }
    return null
  }

  /**
   * Get all the values of the given parameter. If multiple exist with the prefixes then the parameter with the first
   * prefix is returned.
   *
   * @param name The parameter name
   */
  getAll(name: string): string[] {
    for (const prefix of this._prefixes) {
      if (super.has(`${prefix}${name}`)) {
        return super.getAll(`${prefix}${name}`)
      }
    }
    return []
  }

  /**
   * Returns true if a parameter with the given name exists.
   *
   * @param name The parameter name
   */
  has(name: string): boolean {
    for (const prefix of this._prefixes) {
      if (super.has(`${prefix}${name}`)) {
        return true
      }
    }
    return false
  }
}
