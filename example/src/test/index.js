const { router, success, error, db } = require("box-es4x");
const Model = require('./articleModel')

const verify = ctx => {
  ctx.put('aaa', 10)
  ctx.next()
}

router.put("/test").handler(verify).handler(async ctx => {
  console.warn(ctx.get('aaa'));
  let body = ctx.getBodyAsJson()
  console.warn(body);
  ctx.json({"data": "Hello ES4X worlddddddd!"});
});

router.get("/test/list").handler(async ctx => {
  try{
    let res = await db.find("test", { });
    ctx.json(success(res))
  }catch(err){
    ctx.json(error(err))
  }
})

router.post("/test/create").handler(async ctx => {
  try{
    let data = Model({
      title: '这是标题',
      list: [{a: 2, b: 4}, {a: 3, b: 5, c: 7}]
    })
    let res = await db.insert("test", data);
    ctx.json(success(res))
  }catch(err){
    ctx.json(error(err))
  }
})
