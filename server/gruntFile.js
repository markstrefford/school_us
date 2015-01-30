'use strict';

/*global module*/

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		watch: {
			files: ['gruntFile.js', 'server.js', 'src/**/*.js', 'test/**/*.js'],
			tasks: 'develop'
		},
		jshint: {
			files: ['gruntFile.js', 'server.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		} /*,
		jasmine_node: {
			specNameMatcher: '', // load only specs containing specNameMatcher
			projectRoot: './test',
			requirejs: false,
			forceExit: false,
			verbose: false,
			jUnit: {
				report: false,
				savePath : './build/reports/jasmine/',
				useDotNotation: true,
				consolidate: true
			}
		}   */
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jasmine-node');

	// Default task.
	grunt.registerTask('develop', ['timestamp', 'jshint', 'test', 'watch']);

	grunt.registerTask('test', 'jasmine_node');

	grunt.registerTask('timestamp', function() {
		grunt.log.subhead(Date());
	});

	grunt.registerTask('supervise', function() {
		this.async();
		require('supervisor').run(['server.js']);
	});

	grunt.registerTask('build', ['jshint', 'test']);
};