'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function(grunt){
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var appConfig = {
      app: 'src',
      dist: 'dist'
  };
  grunt.initConfig({
    cfg: appConfig,
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= cfg.app %>/*.html',
          '<%= cfg.app %>/css/*.css',
          '{.tmp,<%= cfg.app %>}/css/{,*/}*.css',
          '{.tmp,<%= cfg.app %>}/js/{,*/}*.js',
          '<%= cfg.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, appConfig.app)
            ];
          }
        }
      },

      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, appConfig.dist)
            ];
          }
        }
      }
    },
    requirejs: {
      compile: {
        // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {



          name:'main',

          mainConfigFile: "src/js/main.js",
          out: "dist/js/main.js",

          baseUrl: appConfig.app + '/js',
          optimize: 'uglify2' //,
          // TODO: Figure out how to make sourcemaps work with grunt-usemin
          // https://github.com/yeoman/grunt-usemin/issues/30
          //generateSourceMaps: true,
          // required to support SourceMaps
          // http://requirejs.org/docs/errors.html#sourcemapcomments
          //preserveLicenseComments: false
          //uglify2: {} // https://github.com/mishoo/UglifyJS2
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= cfg.app %>',
          dest: '<%= cfg.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'components/requirejs/require.js',
            'img/{,*/}*.{webp,gif,png,svg}',
            'assets/{,*/}*',
            'css/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= cfg.dist %>/img',
          src: [
            'generated/*'
          ]
        }]
      }
    },
    build_gh_pages: {
      gh_pages: {
        // Leave empty if you just want to run the defaults
      },
      production: {
        options: {
          build_branch: "gh-pages",
          dist: "dist",
          pull: false
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= cfg.dist %>/*',
            '!<%= cfg.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    }
  });
  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist',
    'requirejs',
  ]);

  grunt.registerTask('publish', [
    'build',
    'build_gh_pages:production'
  ]);

  grunt.registerTask('default', [
    'connect:livereload',
    'watch'
  ]);
}