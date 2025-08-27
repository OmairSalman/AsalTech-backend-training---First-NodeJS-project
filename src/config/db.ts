import mongoose from 'mongoose';

const connectDB = async () =>
{
    try
    {
        await mongoose.connect(process.env.DATABASE_URL!);
        console.log(`Connected successfully to MongoDB, databse: ${process.env.DATABASE_NAME}`);
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