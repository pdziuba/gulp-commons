module.exports = function(gulp, options) {

    return {
        isWatchTask: false,
        watchTriggersDependencies: false,
        dependencies: ['clear'],
        srcFiles: function() {
            []
        },
        task: function(callback) {

            var tsd = require('gulp-tsd');
            tsd({
                command: 'reinstall',
                config: options.cwd + '/src/tsd.json',
                latest: false
            }, callback);


        }
    }
};
