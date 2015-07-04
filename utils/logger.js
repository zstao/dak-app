var path = require('path');
var bunyan = require('bunyan');
var LOG_DIR = path.resolve(__dirname, '../logs');

function freeSerializer(src) {
    return src;
}
var logger = bunyan.createLogger({
    name: 'Dak',
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res,
        data: freeSerializer
    },
    streams: [{
        level: 'info',
        path: LOG_DIR + '/app.log'
    }]
});

module.exports = logger;