const del = require('del');
const gulp = require('gulp');
const gulpTypescript = require('gulp-typescript');
const merge = require('merge2');

gulp.task('clean', () => {
  return del('./build/**');
});

gulp.task('compile', () => {
  const source = gulpTypescript.createProject('tsconfig.json');
  const result = gulp.src('./src/**/*.ts').pipe(source());
  return merge([
    result.dts.pipe(gulp.dest('./build/package')),
    result.js.pipe(gulp.dest('./build/package')),
  ]);
});

gulp.task('copyReadme', () => {
  return gulp.src('./README.md').pipe(gulp.dest('./build/package'));
});

gulp.task('copyPackageFile', () => {
  return gulp.src('./package.json').pipe(gulp.dest('./build/package'));
});

gulp.task('copyTypeorm', () => {
  return gulp.src('./packages/typeorm/**/*').pipe(gulp.dest('./build/package/packages/typeorm'));
});

gulp.task('copyPackages', gulp.series('copyTypeorm'));

gulp.task('copy', gulp.series('copyReadme', 'copyPackageFile', 'copyPackages'));

gulp.task('package', gulp.series('clean', 'compile', 'copy'));
