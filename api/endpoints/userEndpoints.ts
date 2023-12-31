class UserEndpoint {
  private readonly prefix = "/users";

  withPrefix(path?: string) {
    if (path) return `${this.prefix}/${path}`;
    return `${this.prefix}`;
  }

  createUser() {
    return this.withPrefix("createUser");
  }

  signIn() {
    return this.withPrefix("signIn");
  }

  getUserById(id: string) {
    return this.withPrefix(`userById/${id}`);
  }

  updateUserRole(id: string) {
    return this.withPrefix(`userById/${id}`);
  }

  getUserByEmail(email: string) {
    return this.withPrefix(`byEmail/${email}`);
  }

  getUsers() {
    return this.withPrefix();
  }

  getCurrentUser(): string {
    return this.withPrefix("current");
  }

  deleteUserById(id: string) {
    return this.withPrefix(`userById/${id}`);
  }
}

export const userEndpoint = new UserEndpoint();
