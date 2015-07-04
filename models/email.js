'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;

var RECORD_STATUS_ENUM = ['published', 'draft', 'sticked'];
var CATEGORIES_ENUM = config.db.metas.RECROD_CATEGORIES;
var GROUPS_ENUM = config.db.metas.RECORD_GROUPS;

var AttachmentAPI = require('../apis/attachment');

var Record = new Schema({
    title: {type: String, default: '', trim: true},
    content: {type: String, default: '', trim: true},

    category: {type: String, required: true, enum: CATEGORIES_ENUM},
    group: {type: String, enum: GROUPS_ENUM},
    tags: [{type: String, trim: true}],

    status: {type: String, enum: RECORD_STATUS_ENUM, default: 'draft'}, // 新闻状态：发布、草稿

    lang: {type: String, default: 'zh'},
    url: {type: String, trim: true},
    images: [{type: Schema.Types.ObjectId, ref: 'Attachment'}],
    attachments: [{type: Schema.Types.ObjectId, ref: 'Attachment'}],
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref: 'Account'},
    updatedAt: {type: Date, default: Date.now},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'Account'},
    hash: {type: String, trim: true}
});

Record.post('remove', function() {
    var record = this;

    console.log('/// post remove record');
    if (record.images.length > 0 || record.attachments.length > 0) {
        var ids = record.images.concat(record.attachments);
        AttachmentAPI.get({_id: {$in: ids}})
            .then(function(attachments) {
                attachments.forEach(function(attachment) {
                    console.log(attachment);
                    attachment.remove();
                });
            });
    }
});

module.exports = mongoose.model('Record', Record);
