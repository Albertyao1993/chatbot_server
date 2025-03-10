import jwt from "jsonwebtoken";
import User from "../models/user.js";

// JWT密钥，应该从环境变量中获取
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// 验证用户是否已认证
export const protect = async (req, res, next) => {
  let token;

  // 从请求头或cookie中获取token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // 从Bearer token中提取
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    // 从cookie中获取
    token = req.cookies.token;
  }

  // 检查token是否存在
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "未授权，请登录",
    });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 将用户信息添加到请求对象中
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "用户不存在",
      });
    }

    next();
  } catch (error) {
    console.error("认证错误:", error);
    return res.status(401).json({
      success: false,
      message: "未授权，token无效",
    });
  }
}; 