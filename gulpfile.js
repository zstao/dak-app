'use strict';
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var plugins = require('gulp-load-plugins')({
    lazy: false
});

var config = {
    styles: {
        root: 'styles',
        sassFiles: 'styles/**/*.scss',
        cssDir: 'styles',
        distDir: 'dist/styles'
    },
    scripts: {
        root: 'scripts',
        files: 'scripts/**/*.js',
        distDir: 'dist/scripts'
    },
    test: {
        root: 'test',
        files: 'test/**/*-spec.js',
        reporter: 'spec'
    },
    livereload: {

    },
    connect: {
        root: './',
        port: '8889',
        livereload: true
    }
};

// sass -> css > .min
gulp.task('styles', function() {
    return gulp.src(config.styles.sassFiles)
        .pipe(plugins.sass({
            style: 'expanded'
        }))
        .pipe(plugins.autoprefixer('last 5 versions'))
        .pipe(gulp.dest(config.styles.cssDir))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(config.styles.distDir))
        .pipe(plugins.livereload());
});

// js -> .min
gulp.task('scripts', function() {
    return gulp.src(config.scripts.files)
        .pipe(gulp.dest(config.scripts.distDir))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.scripts.distDir))
        .pipe(plugins.livereload());
});

// build: concat spec styles|scripts
gulp.task('build', function() {

});

// connect server, livereload
gulp.task('connect', function() {
    plugins.connect.server(config.connect);
});

// watch file changes, then run tasks
gulp.task('watch', function() {
    plugins.livereload.listen();
    gulp.watch(config.styles.sassFiles, ['styles']);
    gulp.watch(config.scripts.files, ['scripts']);
});

gulp.task('dev', ['connect', 'watch']);
