import mongoose from 'mongoose';

const connectDB = async () =>
{
    try
    {
        const DB_NAME = 'usersconnect';
        await mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`);
        console.log(`Connected successfully to MongoDB, databse: ${DB_NAME}`);
    }
    catch(error)
    {
        const errorDate = new Date();
        const errorDateString = errorDate.toLocaleDateString();
        const errorTimeString = errorDate.toLocaleTimeString();
        console.error(`[${errorDateString} @ ${errorTimeString}] MongoDB connection error:\n`, error);
    }
};

export default connectDB;