import request from 'supertest';
import jwt from 'jsonwebtoken';
import { server } from '../server.js';
import { connectTestDB, closeTestDB, clearTestDB } from './testDb.js';
import User from '../models/user.js';

describe('获取当前用户 API 测试', () => {
  let app;
  let token;
  let testUser;

  beforeAll(async () => {
    await connectTestDB();
    app = server();
  });

  beforeEach(async () => {
    // 创建测试用户
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    
    // 生成有效的JWT令牌
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    token = jwt.sign(
      { id: testUser._id, username: testUser.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('应该返回已认证用户的信息', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeTruthy();
    expect(response.body.user._id.toString()).toBe(testUser._id.toString());
    expect(response.body.user.username).toBe(testUser.username);
    expect(response.body.user.email).toBe(testUser.email);
    // 确保密码未返回
    expect(response.body.user.password).toBeUndefined();
  });

  it('应该拒绝未认证的请求', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('未授权');
  });

  it('应该拒绝无效的令牌', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('未授权');
  });
});