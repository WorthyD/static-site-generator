var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var rename = require('gulp-rename');
var fileinclude = require('gulp-file-include');
var sass = require('gulp-sass');


var banner = '/* This is a generated file on ' + new Date() + '  */\n';

gulp.task('fileinclude', function () {
    gulp.src(['src/**/*.html', '!src/resources/**.html'])
        .pipe(fileinclude({
            prefix: '<!-- @@',
            suffix: '-->'
        }))
        .pipe(gulp.dest('./dist')).pipe(browserSync.reload({
            stream: true
        }));
});
var sassPath = 'src/sass/**/*.scss';

gulp.task('sass', function () {
    return gulp.src(sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(header(banner))
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({
            stream: true
        }));

});

gulp.task('copy', function(){
    gulp.src(['src/images/**']).pipe(gulp.dest('dist/images'));
    gulp.src(['src/scripts/**']).pipe(gulp.dest('dist/scripts'));
});


//We are adding sass as a gulp dependancy. It will run 'sass' before it starts the browser sync. 
//This makes sure that we have the latest CSS.
gulp.task('browserSync', ['sass'], function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
});

//Starts up a dev server for us
//It also watches files and reloads the browser when they change.
gulp.task('dev', ['browserSync', 'copy', 'sass', 'fileinclude'], function () {
    gulp.watch('src/**/*.html', ['fileinclude']);
    gulp.watch('src/scripts/**/*.js', browserSync.reload);
    gulp.watch(sassPath, ['sass']);
});


gulp.task('default', ['copy', 'fileinclude', 'sass']);
