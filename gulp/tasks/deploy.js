'use strict';

import gulp from 'gulp';
import deploy from 'gulp-gh-pages';

gulp.task('deploy', ['prod'], function() {
  return gulp.src("./build/**/*")
    .pipe(deploy());
});
