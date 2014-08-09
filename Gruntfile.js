module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        rsync: {
            options: {
                args: ["--progress", "--update"],
                recursive: true,
                exclude: [".git", ".gitignore", "node_modules", "data", "tools"]
            },
            dist: {
                options: {
                    src: ".",
                    dest: "www-data@baierouge.fr:/var/www/guillaume.baierouge.fr/apps/Gribouille"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-rsync');

    grunt.registerTask('default', ['rsync']);
};