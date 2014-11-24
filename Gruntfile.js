(function(){
'use strict';


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cache_bust_token: (function(){
      return (grunt.option('dev'))? 'dev' : grunt.template.today("yymmddhhmmss");
    }()),

    src: 'web/source',
    dest: 'web/dist',
    vendorJs: ['bower_components/angular/angular.js'],
    vendorCss: [
      'bower_components/bootstrap/dist/css/bootstrap.css'
    ],

    /**
     * The directories to delete when 'grunt clean' is executed.
     */
    clean: {
      release: '<%= dest %>',
    },

    concat: {
      vendorJs: {
        nonull: true,
        src: '<%= vendorJs %>',
        dest: '<%= dest %>/js/vendor.js'
      },
      mainJs: {
        nonull: true,
        src: '<%= src %>/js/**/*.js',
        dest: '<%= dest %>/js/main.<%= cache_bust_token %>.js'
      }
    },

    copy: {
      template: {
        src: '<%= src %>/index.html',
        dest: '<%= dest %>/index.html',
        options: {
          process: function(content) {
            return content.replace(/%cache%/g, grunt.config.get('cache_bust_token'));
          }
        }
      },
      images: {
        cwd: '<%= src %>/img',
        expand: true,
        src: '**/*',
        dest: '<%= dest %>/images/'
      },
      partials: {
        cwd: '<%= src %>/partials',
        expand: true,
        src: '**/*',
        dest: '<%= dest %>/partials/'
      }
    },

    less: {
      mainCss: {
        options: {
          paths: ['less'],
          cleancss: !grunt.option('dev')
        },
        files: {
          '<%= dest %>/css/main.<%= cache_bust_token %>.css': '<%= src %>/less/**/*.less'
        }
      },
      vendorCss: {
        options: {
          cleancss: !grunt.option('dev')
        },
        files: {
          '<%= dest %>/css/vendor.css': '<%= vendorCss %>'
        }
      }
    },

    uglify: {
      files: {
          '<%= concat.vendorJs.dest %>': '<%= concat.vendorJs.dest %>',
          '<%= concat.mainJs.dest %>': '<%= concat.mainJs.dest %>',
        }
    },

    watch: {
      html: {
        files: ['<%= src %>/index.html', '<%= src %>/partials/**/*.html'],
        tasks: ['concat', 'copy:template', 'copy:partials']
      },
      scripts: {
        files: ['<%= src %>/js/**/*.js'],
        tasks: ['concat:mainJs']
      },
      css: {
        files: '<%= src %>/less/**/*.less',
        tasks: ['less']
      },
      options: {
        debounceDelay: 250
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', function(){
    grunt.task.run('clean');
    grunt.task.run('less');
    grunt.task.run('concat');
    if (!grunt.option('dev')) {
      grunt.task.run('uglify');
    }
    grunt.task.run('copy');
    //grunt.task.run('updatepaths');

    if (grunt.option('dev')) {
      grunt.task.run('watch');
    }
  });

  grunt.registerTask('test', []);

  grunt.registerTask('default', ['build']);

};
}());
