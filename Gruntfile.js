module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:{
            'public_html/development/libs/blueleaf/js/blueleaf.js': [
                'public_html/development/libs/blueleaf/js-source/*.js',
                '!public_html/development/libs/blueleaf/js-source/blueleaf.js',
                'public_html/development/libs/blueleaf/js-source/blueleaf.js',
            ]
        },
        comments: {
            build: {
              options: {
                  singleline: false,
                  multiline: false
              },
              src: [ 'public_html/development/libs/blueleaf/js/blueleaf.js']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-stripcomments');
    
    grunt.registerTask(
        'build',
        'Compiles all the assets and copies the files to the build directory.',
       [ 'concat', 'comments' ]
    );
};