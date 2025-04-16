import mongoose from "mongoose";
import "dotenv/config";

export const connectdb = async () => {
    try {
        if (mongoose.connection.readyState == 1) {
            return true;
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 6000,
        });
        console.log("hitdb");

        return true;
    } catch (error) {
        return false;
    }
};
export const getConnectionState = () => {
    return mongoose.connection.readyState == 1 ? true : false;
};
