'use strict';

import config      from '../config';
import changed     from 'gulp-changed';
import gulp        from 'gulp';

gulp.task('midis', function() {
  return gulp.src(config.midis.src)
    .pipe(changed(config.midis.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.midis.dest));
});
