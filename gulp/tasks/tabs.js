'use strict';

import config      from '../config';
import changed     from 'gulp-changed';
import gulp        from 'gulp';

gulp.task('tabs', function() {
  return gulp.src(config.tabs.src)
    .pipe(changed(config.tabs.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.tabs.dest));
});
