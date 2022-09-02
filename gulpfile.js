const gulp = require('gulp');
const sass = require('gulp-sass');
const rigger = require('gulp-rigger');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imgmin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');
const jsminify = require('gulp-minify');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');

const BUILD_PREFIX = 'b';

const CSS_BUNDLE_FILE_NAME = 'bundle.min.css';
const JS_BUNDLE_FILE_NAME = 'bundle.min.js';

const SOURCE = {
  HTML:      'app/**/*.html',
  CSS:       'app/template/css/*.+(scss|css)',
  JS:        'app/template/js/*.js',
  IMAGES:    'app/template/img/**/*',
  FONTS:     'app/template/fonts/**/*',
  JQUERY:    'node_modules/jquery/dist/jquery.min.js',
  NORMALIZE: 'node_modules/normalize.css/normalize.css'
}

const OUTPUT = {
  HTML:      'dist',
  CSS:       'dist/template/css',
  JS:        'dist/template/js',
  IMAGES:    'dist/template/img',
  FONTS:     'dist/template/fonts',
  JQUERY:    'app/template/js',
  NORMALIZE: 'app/template/css'
}

const WATCH = {
  HTML: 'app/**/*.html',
  CSS: 'app/template/css/*.scss',
  JS: 'app/template/js/*.js'
}

const IMAGES_BUILD_CONFIG = {
  interlaced: true,
  progressive: true,
  optimizationLevel: 5
};

const AUTOPREFIXER_CONFIG = {
  browsers: 'cover 99.5%'
};

const JSMINIFY_CONFIG = {
  ext: {
    min: '.js'
  },
  noSource: true
};

const BABEL_CONFIG = {
  presets: ['@babel/env']
}

gulp.task(`html:${BUILD_PREFIX}`, () => {
  return gulp.src(SOURCE.HTML)
    .pipe(rigger())
    .pipe(gulp.dest(OUTPUT.HTML))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task(`css:${BUILD_PREFIX}`, () => {
  return gulp.src(SOURCE.CSS)
    .pipe(concat(CSS_BUNDLE_FILE_NAME))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(AUTOPREFIXER_CONFIG))
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(OUTPUT.CSS))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task(`js:${BUILD_PREFIX}`, () => {
  return gulp.src(SOURCE.JS)
    .pipe(concat(JS_BUNDLE_FILE_NAME))
    .pipe(eslint())
    .pipe(sourcemaps.init())
    .pipe(babel(BABEL_CONFIG))
    .pipe(jsminify(JSMINIFY_CONFIG))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(OUTPUT.JS))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task(`images:${BUILD_PREFIX}`, () => {
  return gulp.src(SOURCE.IMAGES)
    .pipe(imgmin(IMAGES_BUILD_CONFIG))
    .pipe(gulp.dest(OUTPUT.IMAGES));
});

gulp.task(`fonts:${BUILD_PREFIX}`, () => {
  return gulp.src(SOURCE.FONTS)
    .pipe(gulp.dest(OUTPUT.FONTS));
});

gulp.task('copy', () => {
  gulp.src(SOURCE.JQUERY).pipe(gulp.dest(OUTPUT.JQUERY));
  gulp.src(SOURCE.NORMALIZE).pipe(gulp.dest(OUTPUT.NORMALIZE));
});

gulp.task('watch', ['browserSync', 'copy', `html:${BUILD_PREFIX}`, `css:${BUILD_PREFIX}`, `js:${BUILD_PREFIX}`], () => {
  gulp.watch(WATCH.HTML, [`html:${BUILD_PREFIX}`]);
  gulp.watch(WATCH.CSS, [`css:${BUILD_PREFIX}`]);
  gulp.watch(WATCH.JS, [`js:${BUILD_PREFIX}`]);
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})