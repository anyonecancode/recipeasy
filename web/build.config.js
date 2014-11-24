(function(){
  'use strict';
  var source_dir = 'web/source',
    build_dir = 'web/dist',
    npm_dir = 'node_modules',
    bower_dir = 'bower_components';

  module.exports = {
    build_dir: build_dir,
    source_dir:source_dir,
    vendor_files: {
      js: [
        npm_dir    + '/jquery/dist/jquery.js',
        npm_dir    + '/angular/angular.js',
        npm_dir    + '/angular-route/angular-route.js',
        npm_dir    + '/angular-resource/angular-resource.js',
        source_dir + '/vendor/spacetime/spacetime.js',
        bower_dir  + '/angular-chosen-localytics/chosen.js',
        source_dir + '/vendor/angular-gridster/angular-gridster.js',
        npm_dir    + '/d3/d3.js',
        bower_dir  + '/d3-tip/index.js',
        npm_dir    + '/rickshaw/rickshaw.js',
        bower_dir  + '/highcharts-release/highcharts.js',
        bower_dir  + '/highcharts-release/themes/gray.js',
        npm_dir    + '/bootstrap/js/dropdown.js',
        npm_dir    + '/bootstrap/js/modal.js',
        npm_dir    + '/bootstrap/js/tab.js',
        npm_dir    + '/cal-heatmap/cal-heatmap.js',
        npm_dir    + '/moment/moment.js',
      ],
      css: [
        npm_dir + '/gridster/dist/jquery.gridster.css',
        npm_dir + '/cal-heatmap/cal-heatmap.css'
      ]
    }
  };

}());
