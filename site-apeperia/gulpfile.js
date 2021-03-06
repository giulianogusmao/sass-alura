var gulp = require('gulp')
    , clean = require('gulp-clean')
    , sass = require('gulp-sass')
    , compass = require('gulp-compass')
    , sourcemaps = require('gulp-sourcemaps')
    , sassLint = require('gulp-sass-lint')
    , browserSync = require('browser-sync').create();

var config = {
    srcPath: './src/',
    distPath: './dist/'
};

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.distPath,
        },
        // port: 8080,
        // startPath: 'index.html',
    });

    gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('clean', () => {
    return gulp
        .src(config.distPath)
        .pipe(clean());
});

gulp.task('html', () => {
    gulp
        .src(config.srcPath + '**/*.html')
        .pipe(gulp.dest(config.distPath));
});

gulp.task('img', () => {
    gulp
        .src(config.srcPath + 'imagens/**/*')
        .pipe(gulp.dest(config.distPath + 'imagens/'));
});

gulp.task('sass', function () {
    return gulp
        .src(config.srcPath + 'sass/**/*.+(sass|scss)')
        .pipe(sourcemaps.init())
        // .pipe(sassLint())
        // .pipe(sassLint.format())
        // .pipe(sassLint.failOnError())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError)) // Using gulp-sass
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.distPath + 'css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('compass', function() {
  gulp.src(config.srcPath+'sass/**/*.+(scss|sass)')
    .pipe(compass({
      css: config.distPath + 'css/',
      sass: config.srcPath + 'sass/',
      // style: 'compressed',
      style: 'nested',
      sourcemap: true
    }))
    .on('error', function(error) {
      // Would like to catch the error here
      console.log(error);
      this.emit('end');
    })
    //.pipe(minifyCSS())
    .pipe(gulp.dest(config.distPath + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.srcPath + 'sass/**/*.+(sass|scss)', ['sass']);
});

gulp.task('watch-compass', ['browserSync'], function() {
  gulp.watch(config.srcPath + 'sass/**/*.+(scss|sass)', ['compass']);
});

gulp.task('build-sass', ['clean'], () => gulp.start(
    'sass'
    , 'html'
    , 'img'
));

gulp.task('build-compass', ['clean'], () => gulp.start(
    'compass'
    , 'html'
    , 'img'
));

gulp.task('default', () => gulp.start(
    'build-compass'
));

// referencia
// http://bonsaiux.com.br/gulp-sass-automatize-a-compilacao-do-seu-css/
