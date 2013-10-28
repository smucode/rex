module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      folder: "target"
    },
    coffeelint: {
      app: [
        'src/*.coffee',
        'test/*.coffee'
      ],
      options: {
        "max_line_length": {
          "value": "125",
          "level": "error"
        }
      }
    },
    coffee: {
      src: {
        options: {
          bare: true
        },
        expand: true,
        flatten: true,
        src: ['src/*.coffee'],
        dest: 'target/src',
        ext: '.js'
      },
      test: {
        expand: true,
        flatten: true,
        src: ['test/*.coffee'],
        dest: 'target/test',
        ext: '.js'
      }
    },
    concat: {
      all: {
        src: [
          'target/src/adapter.js',
          'target/src/fen.js',
          'target/src/piece.js',
          'target/src/rook.js',
          'target/src/knight.js',
          'target/src/bishop.js',
          'target/src/king.js',
          'target/src/queen.js',
          'target/src/pawn.js',
          'target/src/piece_factory.js',
          'target/src/board.js',
          'target/src/export.js'
        ],
        dest: 'target/rex.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: "(function() {",
        footer: "}).call(this);"
      },
      my_target: {
        files: {
          'rex.js': ['target/rex.js']
        }
      }
    },
    vows: {
      all: {
        src: ["target/test/*.js"],
        options: {}
      }
    }
  });

  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-vows");

  grunt.registerTask('default', [
    'clean',
    'coffeelint',
    'coffee',
    'vows',
    'concat',
    'uglify'
  ]);

};
