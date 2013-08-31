'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function(grunt){
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var uGCConfig = {
      app: 'src',
      dist: 'dist'
  };
  grunt.initConfig({
    ugc: uGCConfig,
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= ugc.app %>/*.html',
          '<%= ugc.app %>/css/*.css',
          '{.tmp,<%= ugc.app %>}/css/{,*/}*.css',
          '{.tmp,<%= ugc.app %>}/js/{,*/}*.js',
          '<%= ugc.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
              mountFolder(connect, uGCConfig.app)
            ];
          }
        }
      },

      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, uGCConfig.dist)
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

          baseUrl: uGCConfig.app + '/js',
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
          cwd: '<%= angry.app %>',
          dest: '<%= angry.dist %>',
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
          dest: '<%= angry.dist %>/img',
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
            '<%= angry.dist %>/*',
            '!<%= angry.dist %>/.git*'
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