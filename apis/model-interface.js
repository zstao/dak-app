/**
 * Model 操作的公用 api 封装， 包括常用的查询，更新，删除，创建操作。
 */

var config = require('../configs/config');
var Q = require('q');
var _ = require('lodash');
var logger = require('../utils/logger');

var _allowedFields = '_id,role,title,name,content,created_at,username,status,avatar';
var CONF = {
    conds: {},
    opts: {
        limit: config.app.default.LIMIT,
        skip: config.app.default.SKIP,
        sort: {
            created_at: -1
        }
    },
    fields: {
        allowed: _allowedFields.split(','),
        page: '-content' // fields for getPage
    }
};

function ModelInterface(model, conf) {
    this.model = model;
    this.conf = _.merge({}, CONF, conf);
}
var proto = ModelInterface.prototype;

proto.isQueryFieldAllowed = function(field) {
    return this.conf.fields.allowed.indexOf(field) !== -1;
};

/**
 * 通过外部查询条件 query 来构造实际的查询条件
 * @param  {[type]} conds [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
proto.parseConds = function(conds, query) {
    conds = _.merge({}, this.conf.conds, conds);
    query = query || {};
    for (var key in query) {
        if (this.isQueryFieldAllowed(key)) {
            conds[key] = query[key];
        }
    }
    return conds;
};

/**
 * [parseOpts description]
 * @param  {[type]} opts  [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
proto.parseOpts = function parseOpts(opts, query) {
    opts = _.merge({}, this.conf.opts, opts);
    query = query || {};

    // limit, skip
    var page = opts.page || query.page;
    opts.limit = query.limit || opts.limit;
    opts.skip = page > 0 ?
        (page - 1) * opts.limit :
        (query.skip || opts.skip);

    return opts;
};

/**
 * 根据 conds, opts 进行查询，返回 promise, 通过该 promise 可以获取结果数组
 * @param  {object} conds  查询条件，
 * @param  {string} fields 结果条目中应该包含或不包含(使用prefix`!`来设置)的字段
 * @param  {object} opts 查询限制的条件，如 limit, skip, sort等
 * @param  {object} query  外部查询条件，用于构造 conds, opts
 * @return {promise} onfulfill: [Array]
 *
 */
proto.get = function(conds, fields, opts, query) {
    var _query, population;
    conds = this.parseConds(conds, query);
    opts = this.parseOpts(opts, query);

    logger.info({data: conds}, 'conds');
    logger.info({data: fields}, 'fields');
    logger.info({data: opts}, 'opts');
    _query = this.model.find(conds, fields, opts);
    population = this.conf.opts.population;
    if (population) {
        _query.populate(population);
    }
    return _query.exec();
};

/**
 * 根据 conds 查询数据库,返回 promise, 通过该 promise 可以获取结果页，
 * @param  {object} conds 查询条件。可以为 null，直接通过 parseConds(conds,query) 来构造
 * @param  {number | object} page  如果是 number 类型则表明获取查询结果的第几页;
 * 如果是 object 类型数据则作为外部查询条件来构造实际进行查询所需要的 conds 和 opts,
 * @return {Promise}       通过该 promise 可以获取查询结果页数据，onfulfill:
 * {
 *     count: [number]查询结果总条目数,
 *     currentPage: [number]当前结果为第几页,
 *     pageCount: [number] 结果总页数
 *     list: [Array] 查询结果数据项集合
 * }
 */
proto.getPage = function(conds, page) {
    var _this = this;
    var defer = Q.defer();
    var query = typeof page === 'object' ? page : {
        page: page
    };
    var opts = _this.parseOpts(null, query);
    var fields = this.conf.fields.page;
    var resData = {};
    conds = _this.parseConds(conds, query);

    _this.get(conds, fields, opts)
        .then(function(list) {
            resData.list = list;
            return _this.getCount(conds);
        })
        .then(function(count) {
            resData.count = count;
            resData.currentPage = Math.ceil((opts.skip + 1) / opts.limit) || 1;
            resData.pageCount = Math.ceil(count / opts.limit);
            defer.resolve(resData);
        }, function(err) {
            delete resData.list;
            resData.err = err;
            defer.reject(resData);
        });

    return defer.promise;
};

proto.create = function(data) {
    return this.model.create(data);
};

proto.update = function(id, update, opts) {
    opts = opts || {};
    if (opts.new === undefined) {
        opts.new = true;
    }
    return this.model.findByIdAndUpdate(id, update, opts).exec();
};

proto.delete = function(conds, fields, opts) {
    return this.get(conds, fields, opts)
        .then(function(items) {
            if (items.length > 0) {
                return Q.all(items.map(function(item) {
                    return item.remove();
                }));
            } else {
                var defer = Q.defer();
                defer.resolve();
                return defer.promise;
            }
        });
};

/**
 * 根据 conds 查询，返回 promise, 在 onfulfill 中可获取查询结果的总条目数，
 * @param  {object} conds 查询条件
 * @param  {object} query 外部查询条件， 可用于构造 conds
 * @return {promise}       [description]
 */
proto.getCount = function(conds, query) {
    conds = this.parseConds(conds, query);
    return this.model.count(conds).exec();
};
proto.findOne = function() {
    return this.model.findOne.apply(this.model, arguments);
};



module.exports = ModelInterface;
