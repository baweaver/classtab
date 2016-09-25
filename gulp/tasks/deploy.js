'use strict';

import gulp from 'gulp';
import deploy from 'gulp-gh-pages';
import shell from 'gulp-shell';

gulp.task('deploy', ['prod'], function() {
  return gulp.src('./build/**/*')
    .pipe(deploy());
});
