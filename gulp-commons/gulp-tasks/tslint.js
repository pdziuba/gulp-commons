module.exports = function(gulp, options) {
    var TS = 'src/**/*.ts';
    return {
        isWatchTask: false,
        watchTriggersDependencies: false,
        dependencies: ['clear'],
        srcFiles: function() {
            return TS;
        },
        task: function(done) {

            var tslint = require('gulp-tslint');

            return gulp.src('src/**/*.ts', {
                    cwd: options.cwd
                })
                .pipe(tslint())
                .pipe(tslint.report('verbose'));
        }
    }

};
