import { IUser } from '../interfaces/user.interface';

export class UserModel implements IUser {
  constructor(
    public id: number,
    public username: string,
    public password: number,
    public email: string,
    public role: string

  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
  }




}