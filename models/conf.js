'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var TYPES_ENUM = ['EMAIL'];

var Config = new Schema({
    address: {type: String, trim: true},
    password: {type: String, trim: true},
    type: {type: String, enum: TYPES_ENUM},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

Config.pre('save',function(next){
    var conf = this;
    // only hash the password if it has been modified(or is new)
    if(!conf.isModified('password')){
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err){
            return next(err);
        }
        // hash the password along with the salt
        bcrypt.hash(conf.password, salt, function(err,hash){
            if(err){
                return next(err);
            }
            // override the raw password with the hashed one
            conf.password = hash;
            next();
        });
    });

});


Config.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare( candidatePassword, this.password, function(err,isMatch){
        return cb(err,isMatch);
    });
};
module.exports = mongoose.model('Config', Config);
