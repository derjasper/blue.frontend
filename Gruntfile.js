// TODO docs build action
// TODO scss mit grunt
// TODO dist-ordner mit komprimierten libs, demos, docs erstellen
// TODO netbeans metadata zu gitignore

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            'public_html/development/libs/blueleaf/js/blueleaf.js': [
                'public_html/development/libs/blueleaf/js-source/pluginapi.js',
                'public_html/development/libs/blueleaf/js-source/plugins/*.js',
                'public_html/development/libs/blueleaf/js-source/cssparser.js',
                'public_html/development/libs/blueleaf/js-source/core.js',
            ]
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'public_html/development/libs/blueleaf/js/blueleaf.js': ['public_html/development/libs/blueleaf/js/blueleaf.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask(
            'build',
            'Compiles all the assets and copies the files to the build directory.',
            ['concat']
            );
    grunt.registerTask(
            'cleanbuild',
            'Compiles all the assets and copies the files to the build directory.',
            ['concat', 'uglify']
            );
};