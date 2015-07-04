'use strict';

var ERROR = {
    // ensure equired
    EMAIL_REQUIRED: 'email is required',
    PASSWORD_REQUIRED: 'password is required',
    CATEGORY_NAME_REQUIRED: 'category name is required',

    // ensure pattern
    EMAIL_INVALID: 'email is invalid',
    PASSWORD_INVALID:'password pattern invalid',

    // ensure match
    ACCOUNT_NOT_MATCH: 'account info not match',

    // ensure unique
    EMAIL_TAKEN: 'email taken',

    // existance
    ACCOUNT_NOT_EXISTS: 'account not exist.',

    TERMINAL_ERROR: 'TERMINAL ERROR'
};

module.exports = ERROR;
