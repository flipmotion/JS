'use strict';

import gulp from 'gulp';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import reload from 'gulp-livereload';
import connect from 'gulp-connect';
import uglify from 'gulp-uglify';
import jshint from 'gulp-jshint';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
//ES6
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';


//server
gulp.task('server', function() {
  connect.server({
    root: '',
    livereload: true
  });
});
//js
gulp.task('ES6', function () {
  var bundler = browserify({
    entries: 'build/js/my/app.js',
    debug: true
  });
  bundler.transform(babelify);

  bundler.bundle()
  .on('error', function (err) { console.error(err); })
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('assets/js'))
  .pipe(connect.reload())
  .pipe(notify({ message: 'app.js' }));
});

//watcher
gulp.task('watch', function () {
  gulp.watch(['build/js/my/*.js'], ['ES6']);
});

gulp.task('default', ['server', 'watch']);



