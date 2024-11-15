import { config } from '../config/config';
import mongoose, { model, Schema } from "mongoose"
import { IProduct } from '../interfaces/product.interface';
import { IUser } from '../interfaces/user.interface';
import { getDataFromFile } from './apiDataPicker';
import { regexEmail, regexName, regexPrice, regexQuantity } from './regex';



//https://mongoosejs.com/docs/validation.html

// Create a Schema corresponding to the Product interface.
const productSchema = new Schema<IProduct>({
    title: { type: String, 
        required: true, 
        validate: {
            validator: (value: string) => regexName.test(value),
            message: 'The name needs to be a string between 3 and 50 characters and match the requirements.'
        }
    },
    description: { 
        type: String 
    },
    category: { 
        type: String 
    },
    stock: { 
        type: Number, 
        required:true, 
        validate: {
            validator: (value: number) => regexQuantity.test(value.toString()),
            message: 'The price needs to be a positive number.'
        }
     },
    price: { 
        type: Number, 
        required:true, 
        validate: {
            validator: (value: number) => regexPrice.test(value.toString()),
            message: 'The stock needs to be a positive integer.'
        }
    }
});
  

// Create a Schema corresponding to the User interface.
const userSchema = new Schema<IUser>({

    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required:true,
        unique:true,
        validate: {
            validator: (value: string) => regexEmail.test(value.toString()),
            message: 'The email needs to be an email.'
        }
    },
    role: { 
        type: String, 
        required:true,
        enum: {
            values: ['Gestionnaire', 'Employé'],
            message: '{VALUE} is not supported'
        }
    }
});

// Create a Product Model.
export const MongoProduct = model<IProduct>('Product', productSchema);

// Create a User Model.
export const MongoUser = model<IUser>('User', userSchema);

export const connectToMongoDatabase = async (database:string) => {

    try {
        await mongoose.connect(database);
        console.log(`Connected to the database ${config.nodeEnv} to URI ${database}`);
    } catch(error) {
        console.error("Cannot connect to Mongo DB : ", error)
    }
    
}


export function validateMongoProduct(product:IProduct) {
    const prodInstance = new MongoProduct(product); //Create a product with the data 
    const validationError = prodInstance.validateSync(); //Retrun null if the product is valid
    return !validationError? true : false
}

export function validateMongoUser(user:IUser) {
    const userInstance = new MongoUser(user); //Create a product with the data 
    const validationError = userInstance.validateSync(); //Retrun null if the product is valid
    return !validationError? true : false
}

export function populateMongoDatabase() {

    MongoProduct.collection.drop()
    MongoUser.collection.drop()

    
    const jsonProductArray: IProduct[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseProducts)));
    jsonProductArray.filter(product => {
        if(validateMongoProduct(product)) new MongoProduct(product).save()
    });
    console.log("Mongo table products filled ")

    const jsonUserArray: IUser[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseUsers)));
    jsonUserArray.filter(user => {
        if(validateMongoUser(user)) new MongoUser(user).save()
    });
    console.log("Mongo table users filled ")
    
} 