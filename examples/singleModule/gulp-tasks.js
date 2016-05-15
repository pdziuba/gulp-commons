module.exports = function(gulp){

  var gulpCommons = require('gulp-commons');

  gulpCommons.createGulpModule(gulp,{
    moduleName: "singleModule",
    cwd: __dirname
  });
}
