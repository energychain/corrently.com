var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();
var injectPartials = require('gulp-inject-partials');
var r2 = require("r2");

// Set the banner content
var banner = ['/*!\n',
  ' * Corrently - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2018-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %>\n',
  ' */\n',
  ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome 5
  gulp.src([
      './node_modules/@fortawesome/**/*'
    ])
    .pipe(gulp.dest('./vendor'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});


// JS
gulp.task('js', ['js:minify']);

// Default task
gulp.task('default', ['collect','css', 'js', 'vendor','partials']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('partials', function () {
  return gulp.src([
                './html/ledger_otc.html',
                './html/dapp_dd.html',
                './html/ledger_cori.html',
                './html/investor.html',
                './html/brazil.html',
                './html/wallet.html',
                './html/airdrop.html',
                './html/summary.html',
                './html/index.html'
            ])
           .pipe(injectPartials())
           .pipe(gulp.dest('./'));
});

gulp.task('collect',async function() {
  const fs = require("fs");
  let response = await r2("https://corrently.de/static/asset_0480269a2bdb421b9f85e0f353e63c06.json").json;
  fs.writeFileSync("data/asset_0480269a2bdb421b9f85e0f353e63c06.json",JSON.stringify(response));
  response = await r2("https://corrently.de/static/asset_0c56adc82680493f946599a2f00c1d6d.json").json;
  fs.writeFileSync("data/asset_0c56adc82680493f946599a2f00c1d6d.json",JSON.stringify(response));
});

gulp.task('zeropublish',async function() {
  require("dotenv").config();
  if(typeof process.env.ZN_SITE != "undefined") {
        require('sync-directory')('.', process.env.ZN_ROOT+"/data/"+process.env.ZN_SITE, {type:"copy",exclude:["node_modules","html"]});
  }
});

// Dev task
gulp.task('dev', ['collect','css', 'js','partials', 'browserSync','zeropublish'], function() {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./html/*.html', ['partials']);
  gulp.watch('./html/sections/*.html', ['partials']);
  gulp.watch('./html/includes/*.html', ['partials']);
  gulp.watch('./*.html', browserSync.reload);
});
