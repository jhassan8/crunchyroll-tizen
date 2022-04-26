var file = {
  path: "difix",
};

file.init = function () {
  tizen.filesystem.createDirectory(`documents/${file.path}`, function(newPath) {
    console.log('New directory has been created: ' + newPath);
  }, function(error) {
    console.log(error);
  });
  /*tizen.filesystem.resolve(
    "documents",
    function (directory) {
      console.log("0");
      try {
        console.log("1");
        dir = directory.createDirectory(file.path);
      } catch (error) {
        try {
          console.log("2");
          dir = directory.resolve(file.path);
        } catch (error2) {
          console.log("code 1 : ");
          console.log(error);
          console.log(error2);
        }
      }

      try {
        password = dir.createFile("crunchyroll");
      } catch (error) {
        console.log("code 2 : ");
        console.log(error);
      }

      callback && callback();
    },
    function (error) {
      console.log("code : 8");
      console.log(error);
    }
  );*/
};

file.write = function (filePath, data) {
  return new Promise(function (resolve, reject) {
    tizen.filesystem.resolve(
      "documents/" + file.path,
      function (dir) {
        var filedata = dir.resolve(filePath);
        filedata.openStream(
          "w",
          function (fs) {
            try {
              fs.write(data);
              fs.close();
              resolve(true);
            } catch (error) {
              console.log("write code : 12 ");
              console.log(error);
            }
          },
          function (error) {
            console.log("write code : 13 " + error.message);
            resolve(false);
          },
          "UTF-8"
        );
      },
      function (error) {
        console.log("write code : 14 ");
        console.log(error);
        resolve(false);
      }
    );
  });
};

file.read = function (filePath) {
  return new Promise(function (resolve, reject) {
    tizen.filesystem.resolve(
      "documents/" + file.path,
      function (dir) {
        var filedata = dir.resolve(filePath);
        filedata.openStream(
          "r",
          function (fs) {
            var result = "";
            if (filedata.fileSize > 0) {
              result = fs.read(filedata.fileSize);
            }
            fs.close();
            resolve(result);
          },
          function (error) {
            console.log("read code : 10 " + error.message);
            resolve(undefined);
          },
          "UTF-8"
        );
      },
      function (error) {
        console.log("read code : 11 " + error.message);
        resolve(undefined);
      }
    );
  });
};
