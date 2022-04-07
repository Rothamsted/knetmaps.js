/* Remove jQuery as $ so it can be used by gulp-load-plugins */
/* globals require, -$ */


var {src, dest, series,task}  = require('gulp'),
    args = require('yargs').argv,
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    ignore = require('gulp-ignore'),
    runSequence = require('run-sequence'),
    $ = require('gulp-load-plugins')({ lazy: true }),
    config = require('./gulp.config')();

// *** Code analysis ***
async function vet(){
	$.util.log('Running static code analysis.');
	return src(config.alljs)
	  .pipe($.if(args.verbose, $.print()))
	  .pipe($.jscs())
	  .pipe($.jscs.reporter())
	  .pipe($.jshint())
	  .pipe($.jshint.reporter('jshint-stylish', { verbose: true }));
}

// *** cleaning tasks ***
function clean(path) {
  $.util.log('Cleaning: ' + $.util.colors.blue(path));
  return del(path);
}

async function cleanDist(){
  await clean('./dist/*');
};

// *** CSS Compilation ***

// gulp.task('copy-css',
//  series(cleanDist), 

 async function copyCss() {
  return src(config.css)
  	.pipe(concat('knetmaps.css'))
    .pipe(dest(config.outputCss, {overwrite : true}));

}


// *** JS copying ***
// gulp.task('copy-js'
async function copyJs() {
	  return src(config.js)
	  	.pipe(concat('knetmaps.js'))
	    .pipe(dest(config.outputJs, {overwrite : true}))
	  	.pipe(rename('knetmaps.min.js'))
	  	.pipe(uglify())
	    .pipe(dest(config.outputJs, {overwrite : true}));
};

//*** Lib copying ***
// gulp.task('copy-libs', 
async function copyLibs() {
	  return src(config.libs)
	  	.pipe(concat('knetmaps-lib.js'))
	    .pipe(dest(config.outputJs, {overwrite : true}))
	  	.pipe(rename('knetmaps-lib.min.js'))
	  	.pipe(uglify())
	    .pipe(dest(config.outputJs, {overwrite : true}));
};

//*** Lib copying ***
 async function copyLibsNoJquery(){
	  return src(config.libs)
	  	.pipe(ignore.exclude('jquery-1.11.2.min.js'))
	  	.pipe(concat('knetmaps-lib-nojquery.js'))
	    .pipe(dest(config.outputJs, {overwrite : true}))
	  	.pipe(rename('knetmaps-lib-nojquery.min.js'))
	  	.pipe(uglify())
	    .pipe(dest(config.outputJs, {overwrite : true}));
};

//*** Fonts copying ***
// gulp.task('copy-fonts', 
async function copyFonts() {
	  return src(config.fonts)
	    .pipe(dest(config.outputFonts, {overwrite : true}));
}

//*** Image copying ***
// gulp.task('copy-images', 
async function copyImages() {
	  return src(config.images)
	    .pipe(dest(config.outputImages, {overwrite : true}));
}


 
// create a default task and just log a message
task('help',$.taskListing)

var dev= series(
		cleanDist,
		copyCss,
		copyJs,
		copyLibs,
		copyLibsNoJquery,
		copyFonts,
		copyImages,)


exports.optimise =dev
exports.default = task('default',series('help'))



// gulp.task('optimise', series('copy-fonts','copy-css','copy-js','copy-libs-nojquery','copy-libs','copy-images'));

////////////
