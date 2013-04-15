var karma = require('karma');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({

    paths: {
      routes: './routes'
      , tmp: './tmp'
      , lib: './lib'
      , js: './public/javascripts'
    }

    , concat: {
      build: {
        src: [
          '<%= paths.lib %>/browser.js'
          ,'<%= paths.lib %>/dom-lib.js'
          ,'<%= paths.lib %>/dom-test.js'
        ]
        ,dest: '<%= paths.tmp %>/app.js'
      }
    }

    , watch: {
      js: {
        files: ['<%= paths.lib %>/**/*.js'],
        tasks: ['concat', 'copy', 'jshint', 'uglify']
      }
    }

    , copy: {
      app: {
        files: [
          { src: ['<%= paths.tmp %>/app.js'], dest: '<%= paths.js %>/app.js' }
        ]
      }
    }

    , uglify: {
      app: {
        options: {
          compress: {
            conditionals  : true
            , comparisons : true
            , properties  : true
            , hoist_funs  : true
            , hoist_vars  : false
            , sequences   : true
            , if_return   : true
            , join_vars   : true
            , dead_code   : true
            , evaluate    : true
            , booleans    : true
            , warnings    : true
            , cascade     : true
            , unsafe      : true
            , unused      : true
            , loops       : true
          }
          , mangle: {
            except: [
              'Browser'
              , 'Stor'
              , 'DomTest'
              , 'dom'
              , 'jQuery'
              , '$'
              , '_'
            ]
          }
        }
        , files: { '<%= paths.js %>/app.min.js': ['<%= paths.js %>/app.js'] }
      }
    }

    , jshint: {
      options: {
        'sub'        : true
        , 'boss'     : true
        , 'devel'    : true
        , 'curly'    : false
        , 'immed'    : true
        , 'noarg'    : true
        , 'undef'    : true
        , 'shadow'   : true
        , 'newcap'   : false
        , 'eqnull'   : true
        , 'eqeqeq'   : true
        , 'browser'  : true
        , 'latedef'  : true
        , 'laxcomma' : true
        , 'laxbreak' : true
        , 'globals'  : {
          'Browser'   : true
          , 'DomTest' : true
          , 'jQuery'  : true
          , 'Stor'    : true
          , 'dom'     : true
          , '$'       : true
          , '_'       : true
        }
      }
      , all: ['<%= paths.js %>/app.js']
    }
  });

  grunt.registerTask(
    'default'
    , [
      'concat:build'
      , 'copy:app'
      , 'jshint'
      , 'uglify'
    ]);
};
