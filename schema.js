/**
 * database schema class
 * createdBy Yu
 * 2021-2-22
 */
//字段赋值
function renderVal(field) {
  let newValue = { type: field.type }, defaultValue = '';
  defaultValue = field.default;
  switch (newValue.type) {
    case 'Number':
      newValue.value = typeof newValue.value === 'number' ? Number(newValue.value) : (defaultValue || 0);
      break;
    case 'String':
      newValue.value = newValue.value ? `${newValue.value}` : (defaultValue || '');
      break;
    case 'Boolean':
      newValue.value = newValue.value !== undefined ? !!newValue.value : (defaultValue || false);
      break;
    case 'Array':
      newValue.value = Array.isArray(newValue.value) ? newValue.value : (defaultValue || []);
      break;
    case 'Object':
      newValue.value = typeof newValue.value === 'object' ? newValue.value : (defaultValue || {});
      break;
    case 'Date':
      newValue.value = newValue.value instanceof Date ? newValue.value : (newValue.value ?  new Date(newValue.value) : new Date());
      break;
    default:
      newValue.value = newValue.value ? newValue.value : defaultValue;
      break;
  }
  return newValue;
}

module.exports = class Schema{
  constructor(obj){
    this.data = obj;
  }

  _showError(errObj){
    switch(errObj.type){
      case 'required':
        errObj.msg += `, [${errObj.name}]不能为空`;
        break;
      case 'type':
        errObj.msg += `, [${errObj.name}]数据类型不是${errObj.dataType}类型`;
        break;
    }
    return errObj;
  }

  _validate(obj) {
    let errObj = { msg: '错误格式' };
    errObj.name = obj.name;
    errObj.dataType = obj.type;
    if (typeof obj === 'object') {
      let value = obj.value;
      // 验证是否空值
      if (obj.required) {
        errObj.type = 'required';
        if (value === undefined) return this._showError(errObj);
      }
      // 验证数据类型
      if (obj.type) {
        errObj.type = 'type';
        if (obj.type === 'Date' && !(value instanceof Date)) return this._showError(errObj);
        if (obj.type === 'Array' && !Array.isArray(value)) return this._showError(errObj);
        if (obj.type === 'String' && typeof value !== 'string') return this._showError(errObj);
        if (obj.type === 'Number' && typeof value !== 'number') return this._showError(errObj);
        if (obj.type === 'Boolean' && typeof value !== 'boolean') return this._showError(errObj);
        if (obj.type === 'Object' && (typeof value !== 'object' || Array.isArray(value))) return this._showError(errObj);
        // if (typeof value !== obj.type.toLowerCase()) return this._showError(errObj);
      }
      //自定义验证方法
      if (obj.validator && typeof obj.validator === 'function') {
        let hasErr = obj.validator(value);
        if (hasErr) {
          errObj = hasErr.error ? hasErr.error : {...errObj, msg: errObj.msg += `, ${hasErr}` };
          return this._showError(errObj);
        }
      }
    }
    return false;
  }

  // 设置模型数据
  set(data) {
    for (let key in this.data) {
      let item = this.data[key];
      if (typeof item === 'object' && JSON.stringify(item) !== '{}') {
        item.name = key;
        let dataItem = data[key]
        if(dataItem !== undefined){
          if (item.schema instanceof Schema && (item.type === 'Object' || item.type === 'Array')) {
            if(item.type === 'Array' && Array.isArray(dataItem)) {
              item.value = dataItem.map(obj => item.schema.set(obj).get())
            }else if(item.type === 'Object' && typeof dataItem === 'object'){
              item.value = item.schema.set(dataItem).get();
            }
          } else {
            item.value = dataItem;
          }
        }else{
          item.value = renderVal(item).value;
        }
        let hasErr = this._validate(item)
        if(hasErr) throw hasErr;
      }
    }
    return this
  }

  // 获取模型数据
  get() {
    let newData = {}
    for (let key in this.data) {
      newData[key] = this.data[key].value
    }
    return newData;
  }
  
  // 处理数据
  static parse(schema, data) {
    if (schema instanceof Schema) return schema.set(data).get();
    return null;
  }
}
