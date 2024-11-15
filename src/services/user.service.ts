import { config } from '../config/config';
import { writeDataToFile } from '../data/apiDataPicker';
import { IUser } from '../interfaces/user.interface';



export class UserService {

  public static async createUser(userDataArray:IUser[], user: IUser) {
    userDataArray.push(user);
    let dataChanged = JSON.stringify(userDataArray, null, 4);
    writeDataToFile(config.pathDatabaseUsers, dataChanged);
    return dataChanged;
  }
}