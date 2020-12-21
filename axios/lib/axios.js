'use strict';

// 工具类方法
var utils = require('./utils');

// 手写bind方法，将参数绑定到函数上
var bind = require('./helpers/bind');
// 核心构造函数 Axios
var Axios = require('./core/Axios');

// 合并配置方法
// 
var mergeConfig = require('./core/mergeConfig');
// 引入默认配置
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig 实例的默认配置
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  // new 实例axios生成对象
  var context = new Axios(defaultConfig)

  console.log('context', context)
  //context里边是axios的实例
  // 将实例后的axios 绑定到 request方法上
  var instance = bind(Axios.prototype.request, context)

  // Copy axios.prototype to instance
  // axios副本。原型实例（做一个axios的副本实例，作用未知）
  //复制axios.prototype到实例上，且调用的是Axios.prototype.get等别名方法
  utils.extend(instance, Axios.prototype, context)

  // Copy context to instance
//   复制context到instace实例，
//也就是为什么默认配置axios.defaults和拦截器axios.interceptors可以使用的原因
// 其实就是new Axios()。defaults和new Axios().interceptors()
  utils.extend(instance, context)

  // 返回实例对象
  return instance
}

// Create the default instance to be exported
// 导出 创建默认实例
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
// 暴露 Axios calss 允许 class 继承
axios.Axios = Axios;

// Factory for creating new instances
// 工厂模式 创建新的实例 用户可以自定义一些参数
//  工厂模式：用户不需要是如何实现的，只要会使用即可
/** 写法如下
    axios.create({
        baseURL: "http://localhost:8000",
        method: "GET",
        timeout: 2000,
        headers: {
            class: "H5200318"
        }
    });
 */
axios.create = function create(instanceConfig) {
  // 导出 创建默认实例
  return createInstance(mergeConfig(axios.defaults, instanceConfig))
};

// Expose Cancel & CancelToken
// 导出 Cancel 和 CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
// 判断是否取消请求接口
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
// 导出 all 和 spread API（promise.all方法）
axios.all = function all(promises) {
  return Promise.all(promises);
};
//利用callback.apply方法
// todo 这个作用暂时未知
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
// 也就是可以以下方式引入
// import axios from 'axios';
module.exports.default = axios;
