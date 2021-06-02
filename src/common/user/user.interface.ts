export interface UserDetailsApiResult {
  firstName: string,
  lastName: string,
  email: string,
  _id: string,
  company: {
    name: string,
    permissions
  }
}
