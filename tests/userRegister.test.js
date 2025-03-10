import request from 'supertest';
import { server } from '../server.js';
import { connectTestDB, closeTestDB, clearTestDB } from './testDb.js';
import User from '../models/user.js';

describe('用户注册 API 测试', () => {
  let app;

  beforeAll(async () => {
    await connectTestDB();
    app = server();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('应该成功注册新用户', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(201);

    // 验证响应
    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeTruthy();
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.username).toBe(userData.username);
    expect(response.body.user.email).toBe(userData.email);
    
    // 验证用户已保存到数据库
    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).toBeTruthy();
    expect(savedUser.username).toBe(userData.username);
  });

  it('应该拒绝重复的电子邮件注册', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    // 先注册一个用户
    await request(app)
      .post('/api/users/register')
      .send(userData);

    // 尝试使用相同的电子邮件再次注册
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'anothername',
        email: 'test@example.com',
        password: 'anotherpassword'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('已被使用');
  });

  it('应该拒绝缺少必要字段的注册请求', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        // 缺少 email
        password: 'password123'
      })
      .expect(500); // 或者根据你的错误处理可能是 400

    expect(response.body.success).toBe(false);
  });
});

//TODO: 解决Unit Test 的bug 