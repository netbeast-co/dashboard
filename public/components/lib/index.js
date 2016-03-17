/* global localStorage */

export class Session {
  static save (key, value) {
    if (!key || !value) return
    if (typeof value !== 'string') value = JSON.stringify(value)
    localStorage.setItem('session.' + key, value)
  }

  static load (key) {
    try {
      return JSON.parse(localStorage.getItem('session.' + key))
    } catch (exception) {
      return undefined
    }
  }

  static delete (key) {
    localStorage.removeItem('session.' + key)
  }
}

export class API {
  static install (app) {
    return app
  }
}

export default { Session, API }
