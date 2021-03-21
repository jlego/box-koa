/// <reference types="es4x" />
const config = require("./config");
const app = require("box-es4x");
import { MongoClient } from "@vertx/mongo-client";

app.db = MongoClient.create(vertx, config.database); // 创建数据库连接
app.setting(config).start(); // 启动应用
