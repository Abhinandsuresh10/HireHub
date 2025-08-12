import mongoose from 'mongoose';
import clearExpiredPremium from '../utils/cron.util';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string);
        clearExpiredPremium();
        console.log('MongoDB Connected');
    } catch (error) {
        console.log("Error connecting to MongoDB", error)
    }
}

export default connectDB;