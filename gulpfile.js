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


const cssBundleFileName = 'bundle.min.css';
const jsBundleFilename = 'bundle.min.js';

const Source = {
  html:      'app/**/*.html',
  css:       'app/template/css/*.+(scss|css)',
  js:        'app/template/js/*.js',
  images:    'app/template/img/**/*',
  fonts:     'app/template/fonts/**/*',
  jquery:    'node_modules/jquery/dist/jquery.min.js',
  normalize: 'node_modules/normalize.css/normalize.css'
}

const Output = {
  html:      'dist',
  css:       'dist/template/css',
  js:        'dist/template/js',
  images:    'dist/template/img',
  fonts:     'dist/template/fonts',
  jquery:    'app/template/js',
  normalize: 'app/template/js'
}

const imagesBuildConfig = {
  interlaced: true,
  progressive: true,
  optimizationLevel: 5
};

const autoprefixerConfig = {
  browsers: 'cover 99.5%'
};

const jsminifyConfig = {
  ext: {
    min: '.js'
  },
  noSource: true
};

gulp.task('html:build', () => {
  return gulp.src(Source.html)
    .pipe(rigger())
    .pipe(gulp.dest(Output.html))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('css:build', () => {
  return gulp.src(Source.css)
    .pipe(concat(cssBundleFileName))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(Output.css))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js:build', () => {
  return gulp.src(Source.js)
    .pipe(concat(jsBundleFilename))
    .pipe(eslint())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(jsminify(jsminifyConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(Output.js))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('img:build', () => {
  return gulp.src(Source.images)
    .pipe(imgmin(imagesBuildConfig))
    .pipe(gulp.dest(Output.images));
});

gulp.task('fonts:build', () => {
  return gulp.src(Source.fonts)
    .pipe(gulp.dest(Output.fonts));
});

gulp.task('copy', () => {
  gulp.src(Source.jquery).pipe(gulp.dest(Output.jquery));
  gulp.src(Source.normalize).pipe(gulp.dest(Output.normalize));
});

gulp.task('watch', ['browserSync', 'copy', 'html:build', 'css:build', 'js:build'], () => {
  gulp.watch('app/**/*.html', ['html:build']);
  gulp.watch('app/template/css/*.scss', ['css:build']);
  gulp.watch('app/template/js/*.js', ['js:build']);
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})