module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        sourceMap: 'dist/',
        banner: '/**\n' +
        ' * <%= pkg.name %>\n' +
        ' * <%= pkg.description %>\n' +
        ' *\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @homepage <%= pkg.homepage %>\n' +
        ' * @repository <%= pkg.repository.url %>\n' +
        ' * @license <%= pkg.license %>\n' +
        ' */\n'
      },
      build: {
        src: 'src/pubsub.js',
        dest: 'dist/pubsub.min.js'
      }
    },

    removelogging: {
      dev: {
        src: 'src/pubsub.js',
        dest: 'src/pubsub.js',
        options: {}
      },
      dist: {
        src: 'dist/pubsub.min.js',
        dest: 'dist/pubsub.min.js',
        options: {}
      }
    }
  });

  // Load plugins.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-remove-logging');

  // Register task(s).
  grunt.registerTask(
    'build',
    'Minify to dist folder and remove logs.',
    ['uglify', 'removelogging:dist']
  );

  grunt.registerTask(
    'removeloggingDev',
    'Removes logs from src files.',
    ['removelogging:dev']
  );
};
