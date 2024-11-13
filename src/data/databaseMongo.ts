import { config } from '../config/config';
import mongoose, { model, Schema } from "mongoose"
import { IProduct } from '../interfaces/product.interface';
import { IUser } from '../interfaces/user.interface';


const regexName = new RegExp(/^[A-Za-z ]{3,50}$/);
const regexPrice = new RegExp(/^[1-9]\d*(\.\d+)?$/);
const regexQuantity = new RegExp(/^[1-9]\d*$/);
const regexEmail = new RegExp(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/);


// Create a Schema corresponding to the Product interface.
const productSchema = new Schema<IProduct>({
    id: { type: Number, required: true },
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
    id: { 
        type: Number, 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: Number, 
        required: true 
    },
    email: { 
        type: String, 
        required:true,
        validate: {
            validator: (value: string) => regexEmail.test(value.toString()),
            message: 'The email needs to be an email.'
        }
    },
    role: { 
        type: String, 
        required:true 
    }
});

// Create a Product Model.
const Product = model<IProduct>('Product', productSchema);

// Create a User Model.
const User = model<IUser>('User', userSchema);

export const connectToMongoDatabase = async (database:string) => {

    try {
        await mongoose.connect(database);
        console.log(`Connected to the database ${config.nodeEnv} to URI ${database}`);
    } catch(error) {
        console.error("Cannot connect to Mongo DB : ", error)
    }
}