/**
 * 函数库
 * createdBy Yu
 * 2021-2-22
 */
// 错误对象
exports.error = (err) => {
  let result = {status: 1, msg: '请求失败'};
  if (typeof err === 'object') {
    if(err.message){
      result.msg = err.message;
      result.error = err;
    }else if(err.msg){
      result.msg = err.msg;
    }
  }else{
    if(typeof err == 'string') result.msg = err;
    result.error = err;
  }
  return result;
}

// 成功返回格式
exports.success = data => {
  return { 
    data,
    msg: '请求成功',
    status: 0
 };
}

// 捕获异常
exports.catchErr = promise => {
  return promise
    .then(data => ({ data }))
    .catch(err => ({ err }));
}