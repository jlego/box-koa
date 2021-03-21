const schema = require('box-es4x/schema');
// 子结构
const SubSchema = new schema({
  a: {
    type: "number",
  },
  b: {
    type: "number",
  },
});
// 主结构
const MainSchema = new schema({
  title: {
    // 数据类型(必须)
    type: "string",
    // 默认值(可不写)
    default: '',
    // 必填验证(可不写)
    required: true,
    // 自定义验证(可不写)
    validator(val){
      if(!val) return '标题不能为空'
      return null
    }
  },
  list: {
    type: 'array',  //array或object
    schema: SubSchema  //可多层嵌套
  },
});

module.exports = data => schema.parse(MainSchema, data);
