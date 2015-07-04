'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var ROLES_ENUM = ['root', 'dispatcher', 'handler', 'assessor'];
var DEFAULT_AVATAR = '/statics/images/default-avatar.png';

var Account = new Schema({
    username: {type: String, trim: true},
    name: {type: String, trim: true},
    password: {type: String, trim: true},
    role: {type: String, trim: true, enum: ROLES_ENUM},
    avatar: {type: String, trim: true, default: DEFAULT_AVATAR},
    created_at: {type: Date, default: Date.now}
});


Account.pre('save',function(next){
    var account = this;
    // only hash the password if it has been modified(or is new)
    if(!account.isModified('password')){
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err){
            return next(err);
        }
        // hash the password along with the salt
        bcrypt.hash(account.password, salt, function(err,hash){
            if(err){
                return next(err);
            }
            // override the raw password with the hashed one
            account.password = hash;
            next();
        });
    });

});


Account.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare( candidatePassword, this.password, function(err,isMatch){
        return cb(err,isMatch);
    });
};


module.exports = mongoose.model('Account', Account);
