var gulp = require("gulp");
require("./moduleA/gulp-tasks")(gulp);
require("./moduleB/gulp-tasks")(gulp);

gulp.task("default",["moduleA","moduleB"]);