var gulp       = require('gulp');

gulp.task('js', ['browserify'], function () {
  var uglify     = require('gulp-uglify');
  return gulp.src('app.min.js')
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('browserify', function () {
  var browserify = require('browserify');
  var source     = require('vinyl-source-stream');
  return browserify('./js/index.js').bundle()
    .pipe(source('app.min.js'))
    .pipe(gulp.dest('./'))
});

gulp.task('css', function () {
  var concat     = require('gulp-concat');
  var csscomb    = require('gulp-csscomb');
  var csso       = require('gulp-csso');
  return gulp.src('./css/*.css')
    .pipe(concat('app.min.css'))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('./'))
});