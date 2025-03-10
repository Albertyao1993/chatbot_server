import {mongoose} from "mongoose";
import {connectTestDB, closeTestDB, clearTestDB} from "./testDb.js";

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

it("should connect to the test database", async () => {
    const connectionState = mongoose.connection.readyState;
    expect(connectionState).toBe(1);
});

it('should insert data into the test database', async () => {
    // 创建一个临时集合并插入数据
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'data' });
    const result = await testCollection.findOne({test: 'data'});
    expect(result).toBeDefined();
    expect(result.test).toBe('data');
});

it('should clear the test database', async () => {
    await clearTestDB();
    const testCollection = mongoose.connection.collection('test');
    const result = await testCollection.findOne({test: 'data'});
    expect(result).toBeNull();
});