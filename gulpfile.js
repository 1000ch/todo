var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');

gulp.task('js:app', function () {
  return gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('js:lib', function () {
  var libs = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/underscore/underscore-min.js',
    'bower_components/backbone/backbone.js'
  ];
  return gulp.src(libs)
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('css', function () {
  var csscomb    = require('gulp-csscomb');
  var csso       = require('gulp-csso');
  return gulp.src(['bower_components/pure/pure-min.css', './css/*.css'])
    .pipe(concat('app.min.css'))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
  gulp.watch('./js/*.js', ['js:app']);
  gulp.watch('./css/*.css', ['css']);
});

gulp.task('default', ['watch', 'js:lib', 'js:app', 'css']);