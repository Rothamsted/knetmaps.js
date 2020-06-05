/* globals  module, require, -$ */

module.exports = function () {
  var config = {

    tmpDir: './.tmp/',

    // all the source files
    css: [ // ordering is important
    	'./css/knet-style.css',
    	'./css/jquery.qtip.min.css',
    	'./css/maskloader.css'
    	],
    js: ['./javascript/*.js','./config/url_mappings.js'],
    fonts: ['./fonts/*.otf','./fonts/Licenses/*.html'],
    images: ['./image/*.png','./image/*.ico','./image/*.svg','./image/*.gif','./image_legend/*.png','./css/*.gif','./css/*.svg'],
    libs: [  // ordering is important
    	'./libs/jquery-1.11.2.min.js',
    	'./libs/jquery*.js',
    	'./libs/FileSaver.min.js',
    	'./libs/cytoscape.min.js',
    	'./libs/cytoscape-*.js'
    	],

    // the development output
    build: './dist/',
    outputImages: './dist/img',
    outputCss: './dist/css',
    outputFonts: './dist/fonts',
    outputJs: './dist/js',

  };

  return config;
};