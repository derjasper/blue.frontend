module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            framework_js: {
                dest: 'development/framework/build/js/blueleaf.js',
                src: [
                    'development/framework/source/js/polyfills.js',
                    'development/framework/source/lib/pluginapi/*.js',
                    'development/framework/source/lib/plugins/*.js',
                    'development/framework/source/lib/cssparser/cssparser.js',
                    'development/framework/source/lib/core/core.js',
                    'development/framework/source/js/loader.js'
                ]
            }
        },
        uglify: {
            framework_js: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    'development/framework/build/js/blueleaf.min.js': ['development/framework/build/js/blueleaf.js']
                }
            }
        },
        copy: {
            framework_scss: {
                files: [
                    {
                        expand: true,
                        cwd: 'development/framework/source/scss/',
                        src: ['**'],
                        dest: 'development/framework/build/scss/'
                    },
                ]
            },
            demo: {
                files: [
                    {
                        expand: true,
                        cwd: 'development/demo/source/', 
                        src: [
                            '**'
                        ], 
                        dest: 'development/demo/build/'
                    },
                    {
                        expand: true,
                        cwd: 'development/framework/build/js', 
                        src: ['**'], 
                        dest: 'development/demo/build/libs/blueleaf/js'
                    },
                    {
                        expand: true,
                        cwd: 'development/framework/build/scss', 
                        src: ['**'], 
                        dest: 'development/demo/build/libs/blueleaf/scss'
                    },
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: 'development/docs/build/html/', src: ['**'], dest: 'dist/docs'},
                    {expand: true, cwd: 'development/demo/build/', src: ['**'], dest: 'dist/demo'},
                    {expand: true, cwd: 'development/framework/build/', src: ['**'], dest: 'dist/framework'},
                ]
            }
        },
        sass: {
            demo: {
                files: [{
                        expand: true,
                        cwd: 'development/demo/build/scss',
                        src: ['*.scss'],
                        dest: 'development/demo/build/css',
                        ext: '.css'
                    }]
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
        },
        clean: {
            dist: {
                src: ["dist"]
            },
            build: {
                src:["development/demo/build","development/framework/build","development/docs/build/html"]
            }
        },
        
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.registerTask(
            'build-framework',
            'Builds all the framework files.',
            ['concat:framework_js','uglify:framework_js','copy:framework_scss']
            );
    
    grunt.registerTask(
            'build-demo',
            'Updates the demos libs and builds all the SASS files.',
            ['copy:demo','sass:demo']
            );
    
    grunt.registerTask(
            'build-docs',
            'Builds the docs.',
            ['shell:docs']
            );
    
    grunt.registerTask(
            'build-dist',
            'Compress production files and copies framework, demo and docs into the dist directory.',
            ['clean:dist','copy:dist']
            );

    grunt.registerTask(
            'build',
            'Build framework and demo.',
            ['build-framework', 'build-demo']
            );
    grunt.registerTask(
            'cleanbuild',
            'Build everything.',
            ['build-framework', 'build-demo', 'build-docs', 'build-dist', 'clean:build']
            );
};