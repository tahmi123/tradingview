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
    grunt.loadNpmTasks('grunt-firefox-manifest');
    grunt.loadNpmTasks('grunt-firefox-manifest');
    grunt.loadNpmTasks('grunt-contrib-jshint');

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
					{
						expand: true, 
						cwd: 'src/', 
						src: ['**'], 
						dest: 'dist/v<%=pkg.version%>'
					}
				]
			},
			copyLibraries: {
				files: [
					{
						nonull: true,
						expand: true, 
						flatten: true, 
						cwd: 'node_modules/', 
						src: [
							'jstorage/jstorage.min.js', 
							'ReconnectingWebSocket/reconnecting-websocket.min.js',
							'lokijs/build/lokijs.min.js',
							'jquery.growl/javascripts/jquery.growl.js',
							'jquery.growl/stylesheets/jquery.growl.css',
							'jquery/dist/jquery.min.js',
							'moment/min/moment.min.js'
						], 
						dest: 'dist/v<%=pkg.version%>'
					}
				]
			},
			copyChromeManifest: {
				files: [
					{
						expand: true, 
						flatten: true, 
						cwd: '.', 
						src: ["chrome_extension/*"],
						dest: 'dist/'
					}
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
			task: {
				src: ['dist/index.html', 'dist/manifest.webapp', 'dist/manifest.json', 'dist/auto-update.xml'],
				overwrite: true,
				replacements: [{
					from: '<version>',
					to: '<%=pkg.version%>'
				}, {
					from: '<package-name>',
					to: "<%=pkg.name.replace(/_/g, ' ')%>"
				}, {
					from: '<description>',
					to: "<%=pkg.description%>"
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
                src: ["**/main.css", "**/jquery.growl.css"],
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
					'dist/v<%=pkg.version%>/main.js' : 'dist/v<%=pkg.version%>/main.js',
					'dist/v<%=pkg.version%>/jquery.growl.js' : 'dist/v<%=pkg.version%>/jquery.growl.js'
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
		},
		firefoxManifest: {
			options: {
				packageJson: 'package.json',
			  	manifest: 'dist/manifest.webapp'
			},
			target: {}
		},
		jshint: {
	        options: {
	            jshintrc: true
	        },
	        src: 'src/charting_library/datafeed/udf/*.js'
	    }
	});	

	grunt.registerTask('core-tasks', ['clean:dist', 'copy:main', 'copy:copyLibraries', 'clean:todo', 'rename', 'copy:copyChromeManifest', 'firefoxManifest', 'replace', 'concat', 'clean:dist_udf']);
	grunt.registerTask('default', ['jshint', 'core-tasks', 'removelogging', 'uglify', 'htmlmin', 'cssmin']);

};
