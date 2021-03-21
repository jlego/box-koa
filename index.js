/**
 * 应用主体类
 */
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const app = new Koa();
const { success, error, catchErr } = require("./func");
const config = {
  modulesPath: './src', //业务模块路径
  port: 8080,  //服务监听端口
}

app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});

module.exports = {
  application: app,
  success,
  error,
  catchErr,
  setting(conf = {}) {
    Object.assign(config, conf);
    return this
  },
  async start(_port) {
    // 加载业务模块
    let dirArr = await fs.readdirSync(config.modulesPath);
    if (Array.isArray(dirArr)) {
      for (let _path of dirArr) {
        let file = await fs.statSync(path.join(config.modulesPath, _path));
        if (file && !file.isFile()) {
          let pathArr = _path.split('/');
          try {
            require(`../.${config.modulesPath}/${pathArr[pathArr.length - 1]}/`);
          } catch (err) {
            continue
          }
        }
      }
    }
    if (this.router) {
      app.use(this.router.routes()).use(this.router.allowedMethods());
    }
    // http服务监听
    let port = _port || config.port;
    app.listen(port);
    console.log(`Server listening at: http://localhost:${port}/`);
  }
}
