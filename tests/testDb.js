import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';

let mongoServer;

// test database connection
export const connectTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
}

export const closeTestDB = async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
}

export const clearTestDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

