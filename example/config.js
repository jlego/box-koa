/**
 * 项目配置
 * createdBy yu
 * at 2021-2-22
 */
module.exports = {
  // 端口
  port: 8080,
  // 环境
  env: 'development',
  // 模块路径
  modulesPath: './src',
  // 项目信息
  project: {
    name: "test_project", //项目名
    version: "20210222", //版本号
  },
  //安全
  security: {
    secretKey: "woodes4x", //私密串
    token_expire: 3600 * 12, //12小时过期
    jwt_secret: "fdf9d396-48c8-4a8d-9002-38b4e2a047d0",
  },
  //错误码
  errorCode: {

  }, 
  // 数据库
  database: {
    useObjectId: true,
    connection_string: 'mongodb://127.0.0.1:27017/test_db',
    // db_name: 'test_db',
    // host: '127.0.0.1',
    // port: 27017,
    // username: '',
    // password: '',
    // authSource: ''
  }
};
