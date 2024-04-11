interface AuthData {
  id: string;
}

export class AuthManager {
  auth: AuthData

  setAuthenticaded(auth: AuthData): this {
    this.auth = auth
    return this
  }

  getAuthenticated(): AuthData {
    return this.auth
  }

}