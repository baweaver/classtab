'use strict';

import config      from '../config';
import changed     from 'gulp-changed';
import gulp        from 'gulp';
import browserSync from 'browser-sync';

gulp.task('font-awesome', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('bootstrap-font', function() {
  return gulp.src('node_modules/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('fonts', ['font-awesome', 'bootstrap-font'], function() {
  return gulp.src(config.fonts.src)
    .pipe(changed(config.fonts.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.fonts.dest))
    .pipe(browserSync.stream());
});
