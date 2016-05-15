module.exports.createGulpModule = function(gulp, options) {

    var fs = require("fs");
    var MODULE_NAME = options.moduleName;
    if (MODULE_NAME === undefined) {
        throw "Configuration error - module name is not specified!";
    }
    if (options.dest === undefined) {
        options.dest = options.cwd + '/built';
    }
    if (options.buildFlags === undefined) {
        options.buildFlags = {};
    }
    if (options.buildFlags.production === undefined) {
        options.buildFlags.production = false;
    }

    var directoriesToSearch = [__dirname, options.cwd];
    var tasksToRun = [];
    var watchTasksToRun = [];

    for (var dirIndex = 0; dirIndex < directoriesToSearch.length; dirIndex++) {
        var currentDir = directoriesToSearch[dirIndex] + '/gulp-tasks';
        if (!fs.existsSync(currentDir)) {
            continue;
        }
        console.log('Reading task definitions from ' + currentDir);
        var taskFiles = fs.readdirSync(currentDir);

        //put all tasks in 'namespace'
        for (var i = 0; i < taskFiles.length; i++) {
            var taskName = taskFiles[i].replace(/\.js$/, '');

            if (taskName === 'skeleton') {
                continue;
            }
            var taskModule = require(currentDir + '/' + taskName)(gulp, options);

            var taskDependenciesLocalNames = taskModule.dependencies;
            var taskDependenciesQualifiedNames = [];

            if (taskDependenciesLocalNames === undefined) {
                throw "Configuration error - you have to specify dependencies for task '" + taskName;
            }

            taskDependenciesLocalNames.forEach(function(current) {
                taskDependenciesQualifiedNames.push(MODULE_NAME + ':' + current);
            });
            var globalTaskName = MODULE_NAME + ':' + taskName;

            gulp.task(globalTaskName, taskDependenciesQualifiedNames, taskModule.task);

            var canBeRun = true;
            if (options.tasksToRun !== undefined) {
                canBeRun = contains(options.tasksToRun, taskName);
            }

            if (canBeRun) {
                console.log('Adding ' + globalTaskName + ' to tasks list');
                tasksToRun.push(globalTaskName);
            }

            if (taskModule.isWatchTask) {
                var watchDependencies = [];
                if (taskModule.watchTriggersDependencies) {
                    taskDependenciesQualifiedNames.forEach(function(current) {
                        watchDependencies.push(current + ":watch");
                    });
                }
                watchTasksToRun.push({
                    name: globalTaskName + ":watch",
                    dependencies: watchDependencies,
                    srcFiles: taskModule.srcFiles(),
                    task: taskModule.task
                });
            }
        }
    }

    gulp.task(MODULE_NAME + ":watch", function() {
        for (var i = 0; i < watchTasksToRun.length; i++) {
            var watchTask = watchTasksToRun[i];
            gulp.task(watchTask.name, watchTask.dependencies, watchTask.task);
            gulp.watch(watchTask.srcFiles, {
                cwd: options.cwd
            }, [watchTask.name]);
        }
    });

    gulp.task(MODULE_NAME, tasksToRun, function(cb) {
        cb();
    });
};

function contains(stack, needle) {
    for (var i = 0; i < stack.length; i++) {
        if (stack[i] === needle) {
            return true;
        }
    }
    return false;
}
