import request from 'supertest';
import bcrypt from 'bcrypt';
import { server } from '../server.js';
import { connectTestDB, closeTestDB, clearTestDB } from './testDb.js';
import User from '../models/user.js';

describe('用户登录 API 测试', () => {
  let app;

  beforeAll(async () => {
    await connectTestDB();
    app = server();
  });

  beforeEach(async () => {
    // 在每个测试前创建一个测试用户
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword
    });
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('应该成功登录已存在的用户', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(loginData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeTruthy();
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.username).toBe('testuser');
    expect(response.body.user.email).toBe(loginData.email);
  });

  it('应该拒绝错误的密码', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(loginData)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('不正确');
  });

  it('应该拒绝不存在的用户登录', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(loginData)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('不正确');
  });
});