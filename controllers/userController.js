import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// JWT密钥，应该从环境变量中获取
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// 注册新用户
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户名和邮箱是否已存在
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "用户名或邮箱已被使用" 
      });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 生成JWT令牌
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 返回用户信息和token（排除密码）
    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({ 
      success: false, 
      message: "服务器错误，注册失败" 
    });
  }
};

// 用户登录
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "邮箱或密码不正确" 
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "邮箱或密码不正确" 
      });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 返回用户信息和token（排除密码）
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ 
      success: false, 
      message: "服务器错误，登录失败" 
    });
  }
};

// 获取当前用户信息
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("获取用户信息错误:", error);
    res.status(500).json({ 
      success: false, 
      message: "服务器错误，获取用户信息失败" 
    });
  }
}; 