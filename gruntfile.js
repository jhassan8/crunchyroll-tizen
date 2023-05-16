module.exports = function (grunt) {
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: ["dist"],
    cssmin: {
      cdn: {
        options: {
          banner: "",
        },
        files: {
          "dist/crunchyroll.min.css": ["**/server/css/**/*.css"],
        },
      },
      online: {
        options: {
          banner: "",
        },
        files: {
          "dist/app.min.css": ["css/**/*.css"],
        },
      },
    },
    uglify: {
      options: {
        compress: true,
      },
      cdn: {
        src: ["server/js/**/*.js"],
        dest: "dist/crunchyroll.min.js",
      },
      online: {
        src: ["js/**/*.js"],
        dest: "dist/app.min.js",
      },
    },
    copy: {
      cdn: {
        files: [
          {
            expand: true,
            cwd: "server/css/icons/webfonts",
            src: ["**/*"],
            dest: "dist/assets/icons",
          },
          {
            expand: true,
            cwd: "server/img/",
            src: ["**/*"],
            dest: "dist/assets/imgs",
          },
        ],
      },
      online: {
        files: [
          {
            expand: true,
            cwd: "css/fonts/",
            src: ["**/*"],
            dest: "dist/fonts",
          },
          {
            expand: true,
            cwd: "img/",
            src: ["**/*"],
            dest: "dist/img",
          },
          {
            src: ["index.html", "config.xml", "icon.png"],
            dest: "dist/",
          },
        ],
      },
      offline: {
        files: [
          {
            expand: true,
            cwd: "server/",
            src: ["**/*"],
            dest: "dist/server",
          },
          {
            expand: true,
            cwd: "img/",
            src: ["**/*"],
            dest: "dist/img",
          },
          {
            expand: true,
            cwd: "css/",
            src: ["**/*"],
            dest: "dist/css",
          },
          {
            expand: true,
            cwd: "js/",
            src: ["**/*"],
            dest: "dist/js",
          },
          {
            src: ["index.html", "config.xml", "icon.png"],
            dest: "dist/",
          },
        ],
      },
    },
    "string-replace": {
      cdn: {
        files: {
          "dist/": "dist/*",
        },
        options: {
          replacements: [
            {
              pattern: /server\/img\//g,
              replacement:
                "https://jhassan8.github.io/crunchyroll-tizen/assets/imgs/",
            },
            {
              pattern: /url\(webfonts\//g,
              replacement:
                "url(https://jhassan8.github.io/crunchyroll-tizen/assets/icons/",
            },
          ],
        },
      },
      online: {
        files: {
          "dist/": "dist/index.html",
        },
        options: {
          replacements: [
            {
              pattern: /<!-- start css -->([\S\s]*?)<!-- end css -->/g,
              replacement: `<script src="app.min.js"></script>
    <link rel="stylesheet" href="app.min.css" />
    <link rel="stylesheet" href="https://jhassan8.github.io/crunchyroll-tizen/crunchyroll.min.css" />`,
            },
            {
              pattern: /<!-- start js -->([\S\s]*?)<!-- end js -->/g,
              replacement:
                '<script src="https://jhassan8.github.io/crunchyroll-tizen/crunchyroll.min.js"></script>',
            },
          ],
        },
      },
    },
  });
  grunt.registerTask("cdn", [
    "clean",
    "uglify:cdn",
    "cssmin:cdn",
    "copy:cdn",
    "string-replace:cdn",
  ]);
  grunt.registerTask("online", [
    "clean",
    "uglify:online",
    "cssmin:online",
    "copy:online",
    "string-replace:online",
  ]);
  grunt.registerTask("offline", ["clean", "copy:offline"]);
};
