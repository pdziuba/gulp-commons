module.exports = function(gulp){

  var gulpCommons = require('gulp-commons');

  gulpCommons.createGulpModule(gulp,{
    moduleName: "moduleB",
    cwd: __dirname
  });
}
