var gulp       = require('gulp');
var browserify = require('browserify');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var csscomb    = require('gulp-csscomb');
var csso       = require('gulp-csso');
var source     = require('vinyl-source-stream');

gulp.task('js', function () {
  return browserify('./js/index.js').bundle()
    .pipe(source('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'))
});

gulp.task('css', function () {
  return gulp.src('./css/*.css')
    .pipe(concat('app.min.css'))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('./'))
});