"use strict";

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    connect: {
        	server: {
            		options: {
                		port: 9002,
                		base: 'dist',
                		hostname: '0.0.0.0',
                		keepalive: true
            		}
            	}
	    },
		clean: {
			dist : ['dist'],
			todo : ['dist/**/TODO'],
			dist_udf : [
				'dist/v<%=pkg.version%>/charting_library/datafeed/udf/*.js',
				'!dist/v<%=pkg.version%>/charting_library/datafeed/udf/datafeed.js'
			]
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'src/', src: ['**'], dest: 'dist/v<%=pkg.version%>'}
				]
			}
		},
		rename: {
			moveThis: {
				src: 'dist/v<%=pkg.version%>/index.html',
				dest: 'dist/index.html'
			}
		},
		replace: {
			version: {
				src: ['dist/index.html'],
				overwrite: true,
				replacements: [{
					from: 'v1.0.0',
					to: 'v<%=pkg.version%>'
				}]
			}
		},
		concat: {
		  js: {
		      options: {
		          separator: ''
		      },
		      src: ['dist/v<%=pkg.version%>/charting_library/datafeed/udf/datafeed.js', 'dist/v<%=pkg.version%>/charting_library/datafeed/udf/*.js'],
		      dest: 'dist/v<%=pkg.version%>/charting_library/datafeed/udf/datafeed.js'
		  }
		},
		cssmin: {
            minify: {
                expand: true,
                cwd: 'dist',
                src: ["**/main.css"],
                dest: 'dist'
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            minify: {
                expand: true,
                cwd: 'dist',
                src: ['**/index.html', "**/main.html"],
                dest: 'dist'
            }
        },
		uglify: {
		  minify: {
				files: {
					'dist/v<%=pkg.version%>/charting_library/datafeed/udf/datafeed.js' : 'dist/v<%=pkg.version%>/charting_library/datafeed/udf/datafeed.js',
					'dist/v<%=pkg.version%>/common.js' : 'dist/v<%=pkg.version%>/common.js',
					'dist/v<%=pkg.version%>/main.js' : 'dist/v<%=pkg.version%>/main.js'
				},
                options: {
                    mangle: true,
                    compress: {
                        sequences: true,
                        dead_code: true,
                        conditionals: true,
                        booleans: true,
                        unused: true,
                        if_return: true,
                        join_vars: true,
                        drop_console: true
                    }
                }
		  	}
		},
		'gh-pages': {
		    'gh-pages-beta': {
		        options: {
		            base: 'dist',
		            add: true,
		            repo: 'https://' + process.env.GIT_KEY + '@github.com/binary-com/tradingview.git',
		            message: 'Commiting v<%=pkg.version%> using TravisCI and GruntJS build process for beta'
		        },
		        src: ['**/*']
		    },
		    'gh-pages-prod': {
		        options: {
		            base: 'dist',
		            add: true,
		            repo: 'https://' + process.env.GIT_KEY + '@github.com/binary-com/tradingview.git',
		            message: 'Commiting v<%=pkg.version%> using TravisCI and GruntJS build process for prod'
		        },
		        src: ['**/*']
		    }
		},
	    bump: {
	        options: {
	            files: ['package.json'],
	            updateConfigs: [],
	            commit: false,
	            /*commitMessage: 'Release v%VERSION%',
	            commitFiles: ['package.json'],*/
	            createTag: false,
	            /*tagName: 'v%VERSION%',
	            tagMessage: 'Version %VERSION%',*/
	            push: false,
	            /*pushTo: 'upstream',
	            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
	            globalReplace: false,
	            prereleaseName: false,*/
	            regExp: false
	        }
	    },
		removelogging: {
			dist: {
				src : ["dist/**/datafeed.js", 'dist/**/common.js', 'dist/**/main.js'],
				options : {
					"verbose" : false
				}
			}
		},
		watch: {
		  scripts: {
		    files: ['src/**'],
		    tasks: ['core-tasks'],
		    options: {
		      spawn: false,
              interrupt : true
		    },
		  },
		}
	});	

	grunt.registerTask('core-tasks', ['clean:dist', 'copy:main', 'clean:todo', 'rename', 'replace', 'concat', 'clean:dist_udf']);
	grunt.registerTask('default', ['core-tasks', 'removelogging', 'uglify', 'htmlmin', 'cssmin']);

};
