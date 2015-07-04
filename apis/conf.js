var Config = require('../models/conf');
var ModelInterface = require('./model-interface');
var _ = require('lodash');
var Q = require('q');

var conf = {};
// 实例化接口对象
var configApi = new ModelInterface(Config, conf);

module.exports = configApi;

