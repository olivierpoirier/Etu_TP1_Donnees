import { config } from '../config/config';
import { getDataFromFile, writeDataToFile } from '../data/apiDataPicker';
import { IUser } from '../interfaces/user.interface';


const pathDataUser = config.pathDatabaseUsers;

export class UserService {

  public static async createUser(user: IUser) {
    const productDataArray: IUser[] = Array.from(JSON.parse(getDataFromFile(pathDataUser)));
    productDataArray.push(user);
    let dataChanged = JSON.stringify(productDataArray, null, 4);
    writeDataToFile(pathDataUser, dataChanged);
    return dataChanged;
  }
}