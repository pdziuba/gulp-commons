module.exports = function(gulp){

  var gulpCommons = require('gulp-commons');

  gulpCommons.createGulpModule(gulp,{
    moduleName: "moduleA",
    cwd: __dirname
  });
}
