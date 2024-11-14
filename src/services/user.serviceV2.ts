import { MongoUser } from '../data/databaseMongo';
import { IUser } from '../interfaces/user.interface';

export class MongoUserService {

  public static async createUser(user: IUser) {
    //https://mongoosejs.com/docs/api/model.html#Model.prototype.save()
    return await new MongoUser(user).save();
  }
}