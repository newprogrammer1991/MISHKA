'use strict';
var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var rename = require('gulp-rename');
var lesscss = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var del = require('del');
var run = require('run-sequence');
var gh_pages = require('gulp-gh-pages');
var useref = require("gulp-useref");
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var path = require('path');
var concat = require('gulp-concat');
var argv = require('minimist')(process.argv.slice(2));
var cache = require('gulp-cache');
var combine = require('stream-combiner2');
var babel = require('gulp-babel');
var filter = require('gulp-filter');


var isProduction = !!argv.production;
var buildPath = isProduction ? 'build' : 'tmp';
var srcPath = 'app/';

var f = filter('**/lib/*.js');

gulp.task('deploy', function () {
    return gulp.src('**/*', {cwd: buildPath})
        .pipe(gh_pages());
});


gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: buildPath
        },
        notify: false,
        ui: false
    });
    if (!isProduction) {
        gulp.watch("**/*.less", {cwd: path.join(srcPath, 'less')}, ['less', browserSync.reload]);
        gulp.watch('**/*.*', {cwd: path.join(srcPath, 'fonts')}, ['fonts', browserSync.reload]);
        gulp.watch('*.html', {cwd: srcPath}, ['html', browserSync.reload]);
        gulp.watch(['**/*.*', '!icons-svg/**'], {cwd: path.join(srcPath, 'img')}, ['images', browserSync.reload]);
        gulp.watch('**/*.svg', {cwd: path.join(srcPath, 'less/icons-svg')}, ['symbols', browserSync.reload]);
        gulp.watch('**/*.js', {cwd: path.join(srcPath, 'js')}, ['js'], browserSync.reload);
    }

});


gulp.task('less', function () {
    return gulp.src("less/style.less", {cwd: srcPath})
        .pipe(plumber())
        .pipe(lesscss())
        .pipe(postcss([
                autoprefixer({
                    browsers: [
                        "last 5 version",
                        "last 5 Chrome versions",
                        "last 5 Firefox versions",
                        "last 5 Opera versions",
                        "last 5 Edge versions"
                    ]
                }),
                mqpacker({
                    sort: true
                })
            ]
        ))
        .pipe(gulpIf(!isProduction, gulp.dest(path.join(srcPath, 'css'))))
        .pipe(gulp.dest(path.join(buildPath, '/css')))
});


gulp.task('symbols', function () {
    return gulp.src('**/*.svg', {cwd: path.join(srcPath, 'img/icons-svg')})
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('symbols.svg'))
        .pipe(gulp.dest(buildPath + '/img'));
});


gulp.task("images", function () {
    return gulp.src(['img/**/*.{png,jpg,gif,svg}', '!icons-svg/**'], {cwd: srcPath})
        .pipe(gulpIf(isProduction, cache(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true})
        ]))))
        .pipe(gulp.dest(buildPath + '/img'));
});

gulp.task('js', function () {
    return gulp.src('**/*.js', {cwd: srcPath})
        .pipe(gulpIf(isProduction, f))
        .pipe(gulpIf(!isProduction, babel({presets: ['es2015']})))
        .pipe(gulp.dest(buildPath))
});


gulp.task('html', function () {
    return gulp.src('*.html', {cwd: srcPath})
        .pipe(gulpIf(isProduction, useref()))
        .pipe(gulpIf(isProduction, combine(gulpIf('*.css', minify()))))
        .pipe(gulpIf(isProduction, combine(gulpIf('*.js', babel({presets: ['es2015']})))))
        .pipe(gulpIf(isProduction, combine(gulpIf('*.js', uglify()))))
        .pipe(gulp.dest(buildPath));
});


gulp.task('fonts', function () {
    return gulp.src('**/*.*', {cwd: path.join(srcPath, 'fonts')})
        .pipe(gulp.dest(buildPath + '/fonts'));
});


gulp.task("clean", function () {
    return del(buildPath);
});


gulp.task('build', function (fn) {
    run('clean', 'symbols', 'images', 'fonts', 'js', 'less', 'html', 'serve', fn);
});

gulp.task('default', ['build'], function () {
    if (isProduction) {
        gulp.start('deploy');
    }
});





