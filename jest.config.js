export default {
  // 告诉 Jest 这些扩展名的文件应该被视为 ES 模块
//   extensionsToTreatAsEsm: ['.js'],
  
  // 处理 ES 模块导入路径
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  // 其他配置
  testEnvironment: 'node',
  testTimeout: 10000,
  transform: {},
};
