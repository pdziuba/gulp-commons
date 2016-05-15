module.exports = function (gulp, options) {
    var TS = ['src/typescript/**/*.ts'];
    var Q = require('q');
    var ts = require('gulp-typescript');
    var rename = require("gulp-rename");
    var sourcemaps = require('gulp-sourcemaps');
    var gulpif = require('gulp-if');
    var path = require('path');

    return {
        isWatchTask: true,
        watchTriggersDependencies: false,
        dependencies: ['clear', 'tsd', 'tslint'],
        srcFiles: function(){
          return TS;
        },

        task: function () {

            var tsProject = ts.createProject(options.cwd + '/src/tsconfig.json');
            var compilationDeffered = Q.defer();

            var tsResult = gulp.src(TS, {cwd: options.cwd})
                .pipe(gulpif(!options.buildFlags.production, sourcemaps.init()))
                .pipe(ts(tsProject)).on('error', compilationDeffered.reject);

            var srcAbsPath = path.resolve('/src/' + options.moduleName);

	    tsResult.dts
            .pipe(rename(function (path) {
                path.dirname = path.dirname.replace(/^src\//,'').replace(/^src\\/,'').replace(/^src/,'');
            }))
            .pipe(gulp.dest(options.dest + '/typings'));

            tsResult.js
                .pipe(gulpif(!options.buildFlags.production, sourcemaps.write({
                    sourceRoot: function(file){
                        var resolved = path.resolve(file.dirname);
                        var relative = path.relative(resolved, srcAbsPath);
                        return relative;
                    }
                 })))
                .pipe(rename(function(path){
                    path.dirname = path.dirname.replace(/^src\//,'').replace(/^src\\/,'').replace(/^src/,'');
                }))
                .pipe(gulp.dest(options.dest)).on('end', compilationDeffered.resolve);

            return  compilationDeffered.promise;
        }
    }
};
