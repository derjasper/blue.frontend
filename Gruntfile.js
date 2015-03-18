// TODO dist-ordner mit komprimierten libs, demos, docs erstellen (clean + copy)
// TODO gitignore etc

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            demo: {
                files: [{
                    expand: true,
                    cwd: 'development/framework/scss',
                    src: ['*.scss'],
                    dest: 'development/framework/css',
                    ext: '.css'
                }]
            }
        },
        concat: {
            js: {
                dest: 'development/framework/libs/blueleaf/js/blueleaf.js',
                src: [
                    'development/framework/libs/blueleaf/js-source/pluginapi.js',
                    'development/framework/libs/blueleaf/js-source/plugins/*.js',
                    'development/framework/libs/blueleaf/js-source/cssparser.js',
                    'development/framework/libs/blueleaf/js-source/core.js',
                ]
            }
        },
        uglify: {
            js: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    'development/framework/libs/blueleaf/js/blueleaf.js': ['development/framework/libs/blueleaf/js/blueleaf.js']
                }
            }
        },
        shell: {
            docs: {
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'development/docs'
                    }
                },
                command: 'make html'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask(
            'build',
            'Compiles javascript for testing.',
            ['sass:demo','concat:js']
            );
    grunt.registerTask(
            'cleanbuild',
            'Compiles javascript, sass and docs and copies the files to the dist directory.',
            ['sass:demo','concat:js', 'uglify:js', 'shell:docs']
            );
};