/* globals  module, require, -$ */

module.exports = function () {
  var config = {

    tmpDir: './.tmp/',

    // all the source files
    css: [ // ordering is important
    	'./src/css/knet-style.css',
    	'./src/css/jquery.qtip.min.css',
    	'./src/css/maskloader.css'
    	],
    js: ['./src/js/*.js','./config/url_mappings.js'],
    images: ['./image/*.png','./image/*.ico','./image/*.svg','./image_legend/*.png','./src/css/*.gif','./src/css/*.svg'],
    fonts: ['./fonts/*.otf','./fonts/Licenses/*.html'],
    libs: [  // ordering is important
    	'./src/lib/jquery.min.js',
    	'./src/lib/jquery*.js',
    	'./src/lib/FileSaver.min.js',
    	'./src/lib/cytoscape.min.js',
    	'./src/lib/cytoscape-*.js'
    	],

    // the development output
    build: './dist/',
    outputFonts: './dist/fonts',
    outputImages: './dist/img',
    outputCss: './dist/css',
    outputJs: './dist/js',

    // html source files
    html: './src/*.html',


  };

  return config;
};
