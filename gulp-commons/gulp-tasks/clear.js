module.exports = function(gulp, options) {
    var rimraf = require("rimraf");
    return {
        isWatchTask: false,
        watchTriggersDependencies: false,
        dependencies: [],
        srcFiles: function() {
            [];
        },

        task: function(cb) {
            console.log('Running clear task');
            rimraf(options.dest, cb);
        }
    }
};
