'use strict';

import gulp        from 'gulp';
import config      from '../config'
import runSequence from 'run-sequence';
import htmlReplace from 'gulp-html-replace';

gulp.task('replaceBaseUrl', function () {
  return gulp.src(config.views.index)
    .pipe(htmlReplace({
      baseUrl: `<base href="${config.baseUrl}">`
    }))
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('prod', ['clean'], function(cb) {
  cb = cb || function() {};

  global.isProd = true;

  runSequence([
    'styles',
    'images',
    'fonts',
    'data',
    'midis',
    'tabs',
    'views',
    'replaceBaseUrl'
  ], 'browserify', 'gzip', cb);
});
