module.exports = function (grunt) {
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: {
      cdn: ["cdn"],
      online: ["online"],
      offline: ["offline"],
    },
    cssmin: {
      cdn: {
        options: {
          banner: "",
        },
        files: {
          "cdn/crunchyroll.min.css": ["**/server/css/**/*.css"],
        },
      },
      online: {
        options: {
          banner: "",
        },
        files: {
          "online/app.min.css": ["css/**/*.css"],
        },
      },
    },
    uglify: {
      options: {
        compress: true,
      },
      cdn: {
        src: ["server/js/**/*.js"],
        dest: "cdn/crunchyroll.min.js",
      },
      online: {
        src: ["js/**/*.js"],
        dest: "online/app.min.js",
      },
    },
    copy: {
      cdn: {
        files: [
          {
            expand: true,
            cwd: "server/css/icons/webfonts",
            src: ["**/*"],
            dest: "cdn/assets/icons",
          },
          {
            expand: true,
            cwd: "server/img/",
            src: ["**/*"],
            dest: "cdn/assets/imgs",
          },
        ],
      },
      online: {
        files: [
          {
            expand: true,
            cwd: "css/fonts/",
            src: ["**/*"],
            dest: "online/fonts",
          },
          {
            expand: true,
            cwd: "img/",
            src: ["**/*"],
            dest: "online/img",
          },
          {
            src: ["index.html", "config.xml", "icon.png"],
            dest: "online/",
          },
        ],
      },
    },
    "string-replace": {
      cdn: {
        files: {
          "cdn/": "cdn/*",
        },
        options: {
          replacements: [
            {
              pattern: /server\/img\//g,
              replacement:
                "https://jhassan8.github.io/crunchyroll-tizen/assets/imgs/",
            },
            {
              pattern: /\:url\(webfonts\//g,
              replacement:
                ":url(https://jhassan8.github.io/crunchyroll-tizen/assets/icons/",
            },
          ],
        },
      },
      online: {
        files: {
          "online/": "online/index.html",
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
    "clean:cdn",
    "uglify:cdn",
    "cssmin:cdn",
    "copy:cdn",
    "string-replace:cdn",
  ]);
  grunt.registerTask("online", [
    "clean:online",
    "uglify:online",
    "cssmin:online",
    "copy:online",
    "string-replace:online",
  ]);
};
