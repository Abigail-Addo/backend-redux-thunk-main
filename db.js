import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const mongoUrl = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoUrl)

        if(connection) {
            console.log('mongodb is connected successfully')
        }
        
    } catch (error) {
        console.log(error)
        
    }
}


export default connectDB;