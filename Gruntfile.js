'use strict';

module.exports = function (grunt) {

  // Loading tasks Manually
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-browserify');

  var source = {
    js: 'js',
    css: 'css'
  };

  var dest = {
    js: '../server/app/public/js',
    css: '../server/app/public/css'
  };

  grunt.initConfig({

    source: source,
    dest: dest,

    watch: {

      js: {
        files: ['<%= source.js %>/**/*.js'],
        tasks: ['browserify:controller', 'browserify:display', 'jshint'],
        options: {
          livereload: true
        }
      },

      sass: {
        files: ['<%= source.cssmin %>/**/*.{scss,sass}'],
        tasks: ['sass:dev']
      },

      css: {
        files: ['<%= dest.css %>/**/*.css'],
        options: {
          livereload: true
        }
      }

      // livereload: {
      //   options: {
      //     livereload: '<%= connect.options.livereload %>'
      //   },
      //   files: [
      //     '<%= config.app %>/{,*/}*.html',
      //     '.tmp/styles/{,*/}*.css',
      //     '<%= config.app %>/images/{,*/}*'
      //   ]
      // }
    }, // watch end

    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        base: 'app',
        hostname: 'localhost' // set to '*' for outside access
      },
      livereload: {
        options: {
        }
      },
      dist: {
        options: {
          base: 'app',
          livereload: false
        }
      }

    }, // end connect (server)

    // Empties folders to start fresh
    // clean: {
    //   dest: {
    //     options: {
    //       force: true
    //     },
    //     files: [{
    //       dot: true,
    //       src: [
    //         '.tmp',
    //         '<%= dest.js %>/*',
    //         '<%= dest.css %>/*'
    //       ]
    //     }]
    //   }
    // },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'gruntfile.js',
        '<%= source.js %>/**/*.js',
        '<%= source.js %>/{,*/}*.js',
        '!<%= source.js %>/modules/**/templates/*.*',
        '!<%= source.js %>/modules/**/templates/**/*.*'
      ]
    },
    // lint end

    sass: {
      // export: {
      //   options: {
      //     sourcemap: 'none'
      //   },
      //   files: [{
      //     expand: true,
      //     cwd: '<%= source.css %>',
      //     src: ['*.{scss,sass}'],
      //     dest: '<%= dist.css %>',
      //     ext: '.css'
      //   }]
      // },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= source.css %>',
          src: ['**/*.{scss,sass}'],
          dest: '<%= dest.css %>',
          ext: '.css'
        }]
      }
    }, // sass end

    browserify: {
      controller: {
        options: {
          browserifyOptions: {
             debug: true
          },
          transform: ['hbsfy']
        },
        files: {
          '<%= dest.js %>/controller.js': ['<%= source.js %>/controller/main.js'],
        }
      },

      display: {
        options: {
          browserifyOptions: {
             debug: true
          },
          transform: ['hbsfy']
        },
        files: {
          '<%= dest.js %>/display.js': ['<%= source.js %>/display/main.js'],
        }
      }
    }

  });

  grunt.registerTask('serve', 'Start the front-end server', function(target){
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:dest',
      'sass:dev',
      'browserify:display',
      'browserify:controller',
      'jshint',
      'connect:livereload',
      'watch'
    ]);
  }); // serve task end

  grunt.registerTask('build', [
    'clean:dest',
    'cssmin',
    'uglify',
    'copy:dist'
  ]);

  grunt.registerTask('devbuild', [
    // 'clean:dest',
    'sass:dev',
    'browserify:display',
    'browserify:controller',
    'jshint',
  ]);

  grunt.registerTask('default', [
    'devbuild'
  ]);

};