export class UserTokenModel {
  constructor(
    public user: {
      id: number,
      username: string,
      password: number,
      email: string,
      role: string

    },
    iat: number,
    exp: number

  ) {

  }

}